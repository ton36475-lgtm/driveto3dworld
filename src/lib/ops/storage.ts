import {
  createInquiry,
  emptyOps,
  validateInquiry,
  type EngineResult,
  type InquiryInput,
} from "./engine.ts";
import {
  CHANNELS,
  DRAFT_CHANNELS,
  DRAFT_STATUSES,
  INQUIRY_STATUSES,
  INQUIRY_TYPES,
  JOB_KINDS,
  JOB_STATUSES,
  type OpsState,
} from "./types.ts";

export const STORAGE_KEY = "sxb-ops";
export const LEGACY_KEY = "sxb-inquiries";
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
export type LocalStorage = Pick<Storage, "getItem" | "setItem">;
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const text = (value: unknown, max = 10000): value is string =>
  typeof value === "string" && value.length <= max;
const nonempty = (value: unknown, max = 120): value is string =>
  text(value, max) && value.trim().length > 0;
const time = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 8.64e15;
const member = (items: readonly string[], value: unknown) =>
  typeof value === "string" && items.includes(value);

/** Validate persisted/imported data before it reaches UI or state transitions. */
export function validOps(value: unknown): value is OpsState {
  if (!isObject(value)) return false;
  const { inquiries, jobs, drafts } = value;
  if (!Array.isArray(inquiries) || !Array.isArray(jobs) || !Array.isArray(drafts)) return false;
  if (inquiries.length > 10000 || jobs.length > 30000 || drafts.length > 1000) return false;
  const ids = new Set<string>();
  const uniqueId = (id: unknown) => {
    if (!nonempty(id, 200) || ids.has(id)) return false;
    ids.add(id);
    return true;
  };
  if (
    !inquiries.every(
      (row: unknown) =>
        isObject(row) &&
        uniqueId(row.id) &&
        time(row.at) &&
        nonempty(row.name) &&
        member(CHANNELS, row.channel) &&
        nonempty(row.handle, 254) &&
        member(INQUIRY_TYPES, row.type) &&
        text(row.message) &&
        validateInquiry(row as unknown as InquiryInput) === null &&
        member(INQUIRY_STATUSES, row.status) &&
        (row.assignee === null || nonempty(row.assignee)) &&
        (!(row.status === "assigned" || row.status === "quoted") || nonempty(row.assignee)),
    )
  )
    return false;
  const inquiryIds = new Set(inquiries.map((row) => row.id));
  if (
    !jobs.every(
      (row: unknown) =>
        isObject(row) &&
        uniqueId(row.id) &&
        (row.inquiryId === null ||
          (typeof row.inquiryId === "string" && inquiryIds.has(row.inquiryId))) &&
        member(JOB_KINDS, row.kind) &&
        member(JOB_STATUSES, row.status) &&
        time(row.createdAt) &&
        time(row.dueAt) &&
        row.dueAt >= row.createdAt &&
        (row.receipt === null || text(row.receipt, 1000)),
    )
  )
    return false;
  return drafts.every(
    (row: unknown) =>
      isObject(row) &&
      uniqueId(row.id) &&
      member(DRAFT_CHANNELS, row.channel) &&
      text(row.titleEn) &&
      text(row.titleTh) &&
      (row.titleZh === undefined || text(row.titleZh)) &&
      text(row.bodyEn) &&
      text(row.bodyTh) &&
      (row.bodyZh === undefined || text(row.bodyZh)) &&
      member(DRAFT_STATUSES, row.status) &&
      time(row.updatedAt) &&
      (row.blockReason === null || text(row.blockReason, 500)),
  );
}

/**
 * Additive EN/TH -> EN/TH/ZH migration. Missing translations stay absent: silently
 * copying English into Chinese would mislabel user content and inflate full backups.
 * A legacy ready flag becomes draft (same encoded byte length), so even backups at
 * the 5 MiB boundary remain importable. Original text/timestamps are left untouched.
 * Reads normalize in memory; the next successful write persists the migrated status.
 */
export function migrateDraftLanguages(state: OpsState): OpsState {
  const missingChinese = (draft: OpsState["drafts"][number]) =>
    !draft.titleZh?.trim() || !draft.bodyZh?.trim();
  if (!state.drafts.some((draft) => draft.status === "ready" && missingChinese(draft)))
    return state;
  return {
    ...state,
    drafts: state.drafts.map((draft) =>
      draft.status === "ready" && missingChinese(draft) ? { ...draft, status: "draft" } : draft,
    ),
  };
}

function parseJson(raw: string): unknown {
  if (new TextEncoder().encode(raw).length > MAX_BACKUP_BYTES) throw new Error("backup-too-large");
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("invalid-backup");
  }
}

export function readStored(storage: LocalStorage): OpsState {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return emptyOps();
  const envelope = parseJson(raw);
  if (!isObject(envelope) || envelope.version !== 0 || !validOps(envelope.state))
    throw new Error("invalid-storage");
  return migrateDraftLanguages(envelope.state);
}

const MAX_TIMESTAMP = 8.64e15;

function compactBackup(state: OpsState, exportedAt: number): string {
  return JSON.stringify({ format: "sxb-ops-backup", version: 1, exportedAt, state });
}

/** Admit only states whose largest supported backup envelope fits the import limit. */
function portableState(state: OpsState): OpsState {
  if (!validOps(state)) throw new Error("invalid-state");
  const migrated = migrateDraftLanguages(state);
  const data = { inquiries: migrated.inquiries, jobs: migrated.jobs, drafts: migrated.drafts };
  if (new TextEncoder().encode(compactBackup(data, MAX_TIMESTAMP)).length > MAX_BACKUP_BYTES)
    throw new Error("backup-too-large");
  return data;
}

export function writeStored(storage: LocalStorage, state: OpsState): void {
  const encoded = JSON.stringify({ state: portableState(state), version: 0 });
  // Persist first. A failed write must never be reported as a saved operation.
  storage.setItem(STORAGE_KEY, encoded);
}

export function migrateLegacy(state: OpsState, raw: string | null): OpsState {
  if (!raw) return state;
  let rows: unknown;
  try {
    rows = parseJson(raw);
  } catch {
    return state;
  }
  if (!Array.isArray(rows)) return state;
  let next = state;
  for (const row of rows) {
    if (!isObject(row) || !nonempty(row.id, 180) || !time(row.at)) continue;
    const id = row.id;
    if (next.inquiries.some((item) => item.id === id)) continue;
    if (
      typeof row.name !== "string" ||
      typeof row.email !== "string" ||
      typeof row.message !== "string" ||
      !member(INQUIRY_TYPES, row.type)
    )
      continue;
    let sequence = 0;
    const result = createInquiry(
      next,
      {
        name: row.name,
        channel: "email",
        handle: row.email,
        type: row.type as OpsState["inquiries"][number]["type"],
        message: row.message,
      },
      { now: row.at, id: () => (sequence++ === 0 ? id : `legacy-job:${id}:${sequence}`) },
    );
    if (result.ok && validOps(result.state)) next = result.state;
  }
  return next;
}

export function exportBackup(state: OpsState, now = Date.now()): string {
  if (!time(now)) throw new Error("invalid-timestamp");
  return compactBackup(portableState(state), now);
}

/** Restore into an empty desk; require explicit reset elsewhere before replacing work. */
export function importBackup(state: OpsState, raw: string): EngineResult {
  let envelope: unknown;
  try {
    envelope = parseJson(raw);
  } catch {
    return { ok: false, error: "invalid-backup" };
  }
  if (
    !isObject(envelope) ||
    envelope.format !== "sxb-ops-backup" ||
    envelope.version !== 1 ||
    !validOps(envelope.state)
  )
    return { ok: false, error: "invalid-backup" };
  let incoming: OpsState;
  try {
    incoming = portableState(envelope.state);
  } catch {
    return { ok: false, error: "invalid-backup" };
  }
  // Identical backups are idempotent. Otherwise refuse to overwrite local edits.
  if (JSON.stringify(state) === JSON.stringify(incoming)) return { ok: true, state };
  if (
    state.inquiries.length ||
    state.jobs.length ||
    state.drafts.some((draft) => draft.updatedAt !== 0)
  ) {
    return { ok: false, error: "restore-nonempty" };
  }
  return { ok: true, state: incoming };
}

export function downloadText(filename: string, body: string, mime = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([body], { type: mime }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
