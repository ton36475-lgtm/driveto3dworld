import { create } from "zustand";
import {
  assignInquiry,
  closeInquiry,
  createInquiry,
  deadLetter,
  emptyOps,
  markDraftReady,
  quoteInquiry,
  saveDraft,
  tickJobs,
  type EngineResult,
  type InquiryInput,
} from "./engine.ts";
import { importBackup, LEGACY_KEY, migrateLegacy, readStored, writeStored } from "./storage.ts";
import type { Draft, Inquiry, Job, OpsState } from "./types.ts";

const clock = () => ({ now: Date.now(), id: () => crypto.randomUUID() });
export type OpsStore = OpsState & {
  hydrated: boolean;
  storageError: string | null;
  hydrateLegacy: () => void;
  submitInquiry: (input: InquiryInput) => string | null;
  assign: (id: string, assignee: string) => string | null;
  quote: (id: string) => string | null;
  close: (id: string) => string | null;
  tick: () => void;
  parkJob: (id: string, reason: string) => string | null;
  editDraft: (
    id: string,
    patch: Partial<Pick<Draft, "bodyEn" | "bodyTh" | "bodyZh" | "titleEn" | "titleTh" | "titleZh">>,
  ) => string | null;
  readyDraft: (id: string) => string | null;
  restore: (raw: string) => string | null;
};

export const useOps = create<OpsStore>()((set) => {
  function apply(action: (state: OpsState) => EngineResult): string | null {
    if (typeof window === "undefined") return "storage";
    try {
      // Read before every transaction so another tab's committed changes are retained.
      const stored = readStored(window.localStorage);
      const state = migrateLegacy(stored, window.localStorage.getItem(LEGACY_KEY));
      const result = action(state);
      if (!result.ok) {
        set({ ...state, hydrated: true });
        return result.error;
      }
      // Write only changed data. Catch denied/quota-exhausted storage before UI success.
      if (result.state !== stored) writeStored(window.localStorage, result.state);
      set({ ...result.state, hydrated: true, storageError: null });
      return null;
    } catch {
      set({ hydrated: true, storageError: "storage" });
      return "storage";
    }
  }
  return {
    ...emptyOps(),
    hydrated: false,
    storageError: null,
    hydrateLegacy: () => {
      apply((state) => ({ ok: true, state }));
    },
    submitInquiry: (input) => apply((state) => createInquiry(state, input, clock())),
    assign: (id, assignee) => apply((state) => assignInquiry(state, id, assignee, clock())),
    quote: (id) => apply((state) => quoteInquiry(state, id, clock())),
    close: (id) => apply((state) => closeInquiry(state, id)),
    tick: () => {
      apply((state) => ({ ok: true, state: tickJobs(state, Date.now()) }));
    },
    parkJob: (id, reason) => apply((state) => deadLetter(state, id, reason)),
    editDraft: (id, patch) => apply((state) => saveDraft(state, id, patch, Date.now())),
    readyDraft: (id) => apply((state) => markDraftReady(state, id, Date.now())),
    restore: (raw) => apply((state) => importBackup(state, raw)),
  };
});

export function selectInquiries(state: OpsStore): Inquiry[] {
  return state.inquiries;
}
export function selectJobs(state: OpsStore): Job[] {
  return state.jobs;
}
export function selectDrafts(state: OpsStore): Draft[] {
  return state.drafts;
}
