import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assignInquiry,
  closeInquiry,
  counts,
  createInquiry,
  deadLetter,
  emptyOps,
  markDraftReady,
  quoteInquiry,
  saveDraft,
  tickJobs,
  validateInquiry,
} from "./engine.ts";
import type { Clock, OpsState } from "./types.ts";

function seqClock(start = 1_000_000): Clock & { now: number } {
  let n = 0;
  const clock = {
    now: start,
    id: () => `id-${++n}`,
  };
  return clock;
}

function must<T extends { ok: true; state: OpsState }>(result: {
  ok: boolean;
  error?: string;
  state?: OpsState;
}): T {
  assert.equal(result.ok, true, result.ok ? "" : result.error);
  return result as T;
}

test("rejects a thin enquiry", () => {
  assert.equal(
    validateInquiry({ name: "A", channel: "email", handle: "x@y.z", type: "brand", message: "hi" }),
    "name",
  );
  assert.equal(
    validateInquiry({
      name: "Ara",
      channel: "email",
      handle: "bad",
      type: "brand",
      message: "A longer brief.",
    }),
    "handle",
  );
  assert.equal(
    validateInquiry({
      name: "Ara",
      channel: "line",
      handle: "@sxb",
      type: "space",
      message: "Need a room system.",
    }),
    null,
  );
});

test("enquiry creates staff task and SLA watch", () => {
  const clock = seqClock();
  const result = must(
    createInquiry(
      emptyOps(),
      {
        name: "Mali",
        channel: "line",
        handle: "@mali",
        type: "three",
        message: "We need a 3D salon for a riverside inn.",
      },
      clock,
    ),
  );
  assert.equal(result.state.inquiries.length, 1);
  assert.equal(result.state.inquiries[0]?.status, "received");
  assert.equal(result.state.jobs.length, 2);
  assert.deepEqual(result.state.jobs.map((job) => job.kind).sort(), ["sla_watch", "staff_task"]);
  assert.equal(counts(result.state).openInquiries, 1);
});

test("cannot quote before assign; assign then quote then close", () => {
  const clock = seqClock();
  let state = must(
    createInquiry(
      emptyOps(),
      {
        name: "Mali",
        channel: "email",
        handle: "mali@inn.test",
        type: "brand",
        message: "Identity for two houses and a cafe.",
      },
      clock,
    ),
  ).state;

  assert.equal(quoteInquiry(state, state.inquiries[0]!.id, clock).ok, false);

  state = must(assignInquiry(state, state.inquiries[0]!.id, "Sirawat", clock)).state;
  assert.equal(state.inquiries[0]?.status, "assigned");
  assert.equal(state.inquiries[0]?.assignee, "Sirawat");

  state = must(quoteInquiry(state, state.inquiries[0]!.id, clock)).state;
  assert.equal(state.inquiries[0]?.status, "quoted");
  assert.equal(
    state.jobs.some((job) => job.kind === "quote_followup"),
    true,
  );

  state = must(closeInquiry(state, state.inquiries[0]!.id)).state;
  assert.equal(state.inquiries[0]?.status, "closed");
  assert.equal(
    state.jobs.every((job) => job.status === "done"),
    true,
  );
  assert.equal(counts(state).openInquiries, 0);
});

test("SLA tick marks overdue without touching done jobs", () => {
  const clock = seqClock();
  let state = must(
    createInquiry(
      emptyOps(),
      {
        name: "Ball client",
        channel: "phone",
        handle: "+66 81 234 5678",
        type: "space",
        message: "Interior for a teak house in Phitsanulok.",
      },
      clock,
    ),
  ).state;
  const later = clock.now + 49 * 60 * 60 * 1000;
  state = tickJobs(state, later);
  assert.equal(state.jobs.filter((job) => job.status === "overdue").length, 2);
  state = must(deadLetter(state, state.jobs[0]!.id, "unknown-provider-result")).state;
  assert.equal(state.jobs[0]?.status, "dead_letter");
});

test("draft ready requires a real body; never publishes", () => {
  const clock = seqClock();
  let state = emptyOps();
  const line = state.drafts.find((item) => item.channel === "line");
  assert.ok(line);
  state = must(saveDraft(state, line.id, { bodyEn: "short", bodyTh: "สั้น" }, clock.now)).state;
  state = must(markDraftReady(state, line.id, clock.now)).state;
  assert.equal(state.drafts.find((item) => item.id === line.id)?.status, "blocked");

  state = must(
    saveDraft(
      state,
      line.id,
      {
        bodyEn: "A complete LINE first reply that names the atelier and the 3D salon.",
        bodyTh: "ข้อความตอบ LINE ที่ระบุชื่อห้องทำงานและแกลเลอรีสามมิติอย่างชัดเจน",
      },
      clock.now,
    ),
  ).state;
  state = must(markDraftReady(state, line.id, clock.now)).state;
  assert.equal(state.drafts.find((item) => item.id === line.id)?.status, "ready");
  assert.equal(
    state.drafts.every((item) => item.status !== ("published" as string)),
    true,
  );
});

import {
  exportBackup,
  importBackup,
  LEGACY_KEY,
  MAX_BACKUP_BYTES,
  migrateLegacy,
  readStored,
  STORAGE_KEY,
  validOps,
  writeStored,
} from "./storage.ts";

const client = {
  name: "Mali",
  channel: "email" as const,
  handle: "mali@inn.test",
  type: "brand" as const,
  message: "Identity for two houses and a cafe.",
};

test("duplicate submission and quote retries do not multiply work or regress state", () => {
  const clock = seqClock();
  let state = must(createInquiry(emptyOps(), client, clock)).state;
  const repeated = must(createInquiry(state, client, clock));
  assert.equal(repeated.state, state);
  assert.equal(repeated.state.jobs.length, 2);
  const id = state.inquiries[0]!.id;
  state = must(assignInquiry(state, id, "Ball", clock)).state;
  state = must(quoteInquiry(state, id, clock)).state;
  assert.equal(must(quoteInquiry(state, id, clock)).state, state);
  assert.equal(assignInquiry(state, id, "Sirawat", clock).ok, false);
  assert.equal(state.jobs.filter((job) => job.kind === "quote_followup").length, 1);
  assert.equal(state.jobs.find((job) => job.kind === "sla_watch")?.status, "done");
  assert.equal(tickJobs(state, clock.now + 49 * 3600 * 1000), state);
});

test("overdue tick is inclusive and preserves the original overdue receipt", () => {
  const state = must(createInquiry(emptyOps(), client, seqClock())).state;
  const overdue = tickJobs(state, state.jobs[0]!.dueAt);
  assert.equal(overdue.jobs[0]?.status, "overdue");
  assert.equal(tickJobs(overdue, state.jobs[0]!.dueAt + 1000), overdue);
});

test("completed and parked work is not revived by quote or park", () => {
  const clock = seqClock();
  let state = must(createInquiry(emptyOps(), client, clock)).state;
  const id = state.inquiries[0]!.id;
  state = must(deadLetter(state, state.jobs[0]!.id, "Needs review")).state;
  state = must(assignInquiry(state, id, "Ball", clock)).state;
  state = must(quoteInquiry(state, id, clock)).state;
  assert.equal(state.jobs.find((job) => job.kind === "staff_task")?.status, "dead_letter");
  const done = state.jobs.find((job) => job.status === "done")!;
  assert.equal(deadLetter(state, done.id, "Oops").ok, false);
});

test("both languages must be complete before a draft is ready", () => {
  let state = must(
    saveDraft(
      emptyOps(),
      "line",
      { bodyEn: "A sufficiently long and detailed English copy.", bodyTh: "" },
      10,
    ),
  ).state;
  state = must(markDraftReady(state, "line", 11)).state;
  assert.equal(state.drafts[0]?.status, "blocked");
  assert.equal(saveDraft(state, "line", { bodyEn: "x".repeat(10001) }, 12).ok, false);
});

test("rejects untrusted input enums and excessive payloads", () => {
  assert.equal(validateInquiry({ ...client, channel: "unknown" } as never), "channel");
  assert.equal(validateInquiry({ ...client, type: "unknown" } as never), "type");
  assert.equal(validateInquiry({ ...client, message: "x".repeat(10001) }), "message");
  assert.equal(validateInquiry({ ...client, name: null } as never), "name");
});

test("legacy migration is repeatable, keeps unique job IDs, and skips invalid rows", () => {
  const raw = JSON.stringify([
    {
      id: "legacy-1",
      at: 1,
      name: client.name,
      email: client.handle,
      message: client.message,
      type: "brand",
    },
    null,
    { id: "bad", at: 1, name: 10, email: "broken" },
  ]);
  const state = migrateLegacy(emptyOps(), raw);
  assert.equal(state.inquiries.length, 1);
  assert.equal(new Set([...state.inquiries, ...state.jobs].map((row) => row.id)).size, 3);
  assert.equal(validOps(state), true);
  assert.equal(migrateLegacy(state, raw), state);
  const other = must(createInquiry(emptyOps(), client, seqClock())).state;
  assert.equal(migrateLegacy(other, raw).inquiries.length, 2);
  assert.equal(migrateLegacy(state, "{broken"), state);
});

test("backup round trip validates references and does not overwrite local work", () => {
  const state = must(createInquiry(emptyOps(), client, seqClock())).state;
  const encoded = exportBackup(state, 1234);
  assert.deepEqual(must(importBackup(emptyOps(), encoded)).state, state);
  assert.equal(must(importBackup(state, encoded)).state, state);
  assert.equal(importBackup(state, exportBackup(emptyOps())).ok, false);
  assert.equal(importBackup(emptyOps(), "null").ok, false);
  assert.equal(importBackup(emptyOps(), JSON.stringify({ state })).ok, false);
  const corrupt = structuredClone(state);
  corrupt.jobs[0]!.inquiryId = "missing-inquiry";
  assert.equal(validOps(corrupt), false);
  assert.throws(() => exportBackup(corrupt));
  const duplicate = structuredClone(state);
  duplicate.jobs[0]!.id = duplicate.inquiries[0]!.id;
  assert.equal(validOps(duplicate), false);
});

test("storage never overwrites unreadable state and surfaces denied writes", () => {
  const memory = new Map<string, string>();
  const storage = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memory.set(key, value);
    },
  };
  assert.deepEqual(readStored(storage), emptyOps());
  const state = must(createInquiry(emptyOps(), client, seqClock())).state;
  writeStored(storage, state);
  assert.deepEqual(readStored(storage), state);
  memory.set(STORAGE_KEY, "{broken");
  assert.throws(() => readStored(storage));
  assert.equal(memory.get(STORAGE_KEY), "{broken");
  assert.throws(() =>
    writeStored(
      {
        ...storage,
        setItem: () => {
          throw new Error("quota");
        },
      },
      state,
    ),
  );
  assert.equal(memory.has(LEGACY_KEY), false);
});

test("local store commits persistently, catches quota failures, and retains other-tab changes", async () => {
  const { useOps } = await import("./store.ts");
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  const memory = new Map<string, string>();
  let denied = false;
  const storage = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (denied) throw new Error("Storage quota exceeded");
      memory.set(key, value);
    },
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage },
  });
  try {
    useOps.getState().hydrateLegacy();
    assert.equal(useOps.getState().hydrated, true);
    assert.equal(useOps.getState().submitInquiry(client), null);
    assert.equal(readStored(storage).inquiries.length, 1);
    const id = useOps.getState().inquiries[0]!.id;
    denied = true;
    assert.equal(useOps.getState().assign(id, "Ball"), "storage");
    assert.equal(useOps.getState().inquiries[0]!.status, "received");
    assert.equal(readStored(storage).inquiries[0]!.status, "received");
    denied = false;
    // A second tab saves a new inquiry while this tab holds an older snapshot.
    const incoming = must(
      createInquiry(
        readStored(storage),
        { ...client, name: "Another client" },
        seqClock(2_000_000),
      ),
    ).state;
    writeStored(storage, incoming);
    assert.equal(useOps.getState().assign(id, "Ball"), null);
    assert.equal(useOps.getState().inquiries.length, 2);
    assert.equal(readStored(storage).inquiries.length, 2);
    assert.equal(useOps.getState().storageError, null);
    memory.set(STORAGE_KEY, "{invalid");
    assert.equal(useOps.getState().submitInquiry({ ...client, name: "Not saved" }), "storage");
    assert.equal(memory.get(STORAGE_KEY), "{invalid");
    assert.equal(useOps.getState().inquiries.length, 2);
  } finally {
    useOps.setState({ ...emptyOps(), hydrated: false, storageError: null });
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("large saved work exports compactly and round-trips through the backup limit", () => {
  const state = emptyOps();
  state.inquiries = Array.from({ length: 511 }, (_, index) => ({
    ...client,
    id: `large-${index}`,
    at: 1,
    message: "x".repeat(10000),
    status: "received" as const,
    assignee: null,
  }));
  let persisted = "";
  const storage = {
    getItem: () => persisted,
    setItem: (_key: string, raw: string) => {
      persisted = raw;
    },
  };
  writeStored(storage, state);
  const backup = exportBackup(readStored(storage));
  assert.ok(new TextEncoder().encode(backup).length <= MAX_BACKUP_BYTES);
  assert.deepEqual(must(importBackup(emptyOps(), backup)).state, state);
});

test("storage and backup share an exact UTF-8 byte boundary and reject overflow before writes", () => {
  const maxTimestamp = 8.64e15;
  const bytes = (raw: string) => new TextEncoder().encode(raw).length;
  const rawEnvelope = (state: OpsState) =>
    JSON.stringify({ format: "sxb-ops-backup", version: 1, exportedAt: maxTimestamp, state });
  const state = emptyOps();
  const row = {
    ...client,
    at: 1,
    message: "x".repeat(10000),
    status: "received" as const,
    assignee: null,
  };
  state.inquiries = Array.from({ length: 511 }, (_, index) => ({
    ...row,
    id: `boundary-${index}`,
  }));
  // Include multi-byte content so the limit cannot silently become a character count.
  state.inquiries[0]!.message = "ก".repeat(3333) + "x";
  while (true) {
    const next = { ...row, id: `boundary-${state.inquiries.length}` };
    if (bytes(rawEnvelope({ ...state, inquiries: [...state.inquiries, next] })) > MAX_BACKUP_BYTES)
      break;
    state.inquiries.push(next);
  }
  const last = { ...row, id: "boundary-final", message: "xxxxxxxx" };
  state.inquiries.push(last);
  const spare = MAX_BACKUP_BYTES - bytes(rawEnvelope(state));
  assert.ok(spare >= 0 && spare <= 9992, "fixture must have space for a valid final message");
  last.message += "x".repeat(spare);
  assert.equal(bytes(rawEnvelope(state)), MAX_BACKUP_BYTES);
  let persisted = "";
  let writes = 0;
  const storage = {
    getItem: () => persisted,
    setItem: (_key: string, raw: string) => {
      persisted = raw;
      writes++;
    },
  };
  writeStored(storage, state);
  assert.equal(writes, 1);
  const backup = exportBackup(readStored(storage), maxTimestamp);
  assert.equal(bytes(backup), MAX_BACKUP_BYTES);
  assert.deepEqual(must(importBackup(emptyOps(), backup)).state, state);
  const tooLarge = structuredClone(state);
  tooLarge.inquiries.at(-1)!.message += "x";
  assert.equal(validOps(tooLarge), true);
  assert.throws(() => writeStored(storage, tooLarge), /backup-too-large/);
  assert.throws(() => exportBackup(tooLarge), /backup-too-large/);
  assert.equal(importBackup(emptyOps(), rawEnvelope(tooLarge)).ok, false);
  assert.equal(writes, 1);
  assert.deepEqual(readStored(storage), state);
  assert.throws(() => exportBackup(state, Infinity), /invalid-timestamp/);
});
