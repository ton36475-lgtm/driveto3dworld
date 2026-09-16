import {
  CHANNELS,
  INQUIRY_TYPES,
  type Channel,
  type Draft,
  type DraftChannel,
  type Inquiry,
  type InquiryType,
  type Job,
  type OpsState,
  SLA_MS,
  type Clock,
} from "./types.ts";

export type InquiryInput = {
  name: string;
  channel: Channel;
  handle: string;
  type: InquiryType;
  message: string;
};

export type EngineError = { ok: false; error: string };
export type EngineOk<T = OpsState> = { ok: true; state: T; id?: string };
export type EngineResult<T = OpsState> = EngineOk<T> | EngineError;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9][0-9\s-]{7,14}$/;

export function emptyOps(): OpsState {
  return { inquiries: [], jobs: [], drafts: seedDrafts(0) };
}

export function validateInquiry(input: InquiryInput): string | null {
  if (!input || !CHANNELS.includes(input.channel)) return "channel";
  if (!INQUIRY_TYPES.includes(input.type)) return "type";
  if (typeof input.name !== "string" || input.name.trim().length < 2 || input.name.length > 120)
    return "name";
  if (typeof input.message !== "string" || input.message.length > 10000) return "message";
  if (typeof input.handle !== "string" || input.handle.length > 254) return "handle";
  if (input.message.trim().length < 8) return "message";
  const handle = input.handle.trim();
  if (input.channel === "email" && !EMAIL.test(handle)) return "handle";
  if (input.channel === "phone" && !PHONE.test(handle)) return "handle";
  if (input.channel === "line" && handle.length < 2) return "handle";
  return null;
}

export function createInquiry(state: OpsState, input: InquiryInput, clock: Clock): EngineResult {
  const error = validateInquiry(input);
  if (error) return { ok: false, error };

  // Repeated clicks/retries within five minutes return the same local receipt.
  const duplicate = state.inquiries.find(
    (item) =>
      clock.now >= item.at &&
      clock.now - item.at < 5 * 60 * 1000 &&
      item.name === input.name.trim() &&
      item.channel === input.channel &&
      item.handle === input.handle.trim() &&
      item.type === input.type &&
      item.message === input.message.trim(),
  );
  if (duplicate) return { ok: true, id: duplicate.id, state };

  const inquiry: Inquiry = {
    id: clock.id(),
    at: clock.now,
    name: input.name.trim(),
    channel: input.channel,
    handle: input.handle.trim(),
    type: input.type,
    message: input.message.trim(),
    status: "received",
    assignee: null,
  };

  const staff: Job = {
    id: clock.id(),
    inquiryId: inquiry.id,
    kind: "staff_task",
    status: "queued",
    createdAt: clock.now,
    dueAt: clock.now + SLA_MS.staff_task,
    receipt: "inquiry.received → staff_task",
  };

  const watch: Job = {
    id: clock.id(),
    inquiryId: inquiry.id,
    kind: "sla_watch",
    status: "running",
    createdAt: clock.now,
    dueAt: clock.now + SLA_MS.sla_watch,
    receipt: "inquiry.received → sla_watch",
  };

  return {
    ok: true,
    id: inquiry.id,
    state: {
      ...state,
      inquiries: [inquiry, ...state.inquiries],
      jobs: [staff, watch, ...state.jobs],
    },
  };
}

export function assignInquiry(
  state: OpsState,
  inquiryId: string,
  assignee: string,
  clock: Clock,
): EngineResult {
  const inquiry = state.inquiries.find((item) => item.id === inquiryId);
  if (!inquiry) return { ok: false, error: "missing" };
  if (inquiry.status === "closed") return { ok: false, error: "closed" };
  if (inquiry.status === "quoted") return { ok: false, error: "quoted" };
  if (typeof assignee !== "string" || !assignee.trim() || assignee.length > 120)
    return { ok: false, error: "assignee" };
  if (inquiry.status === "assigned" && inquiry.assignee === assignee.trim())
    return { ok: true, id: inquiryId, state };

  return {
    ok: true,
    id: inquiryId,
    state: {
      ...state,
      inquiries: state.inquiries.map((item) =>
        item.id === inquiryId ? { ...item, status: "assigned", assignee: assignee.trim() } : item,
      ),
      jobs: state.jobs.map((job) =>
        job.inquiryId === inquiryId &&
        job.kind === "staff_task" &&
        (job.status === "queued" || job.status === "running")
          ? { ...job, status: "running", receipt: `assigned:${assignee.trim()}@${clock.now}` }
          : job,
      ),
    },
  };
}

export function quoteInquiry(state: OpsState, inquiryId: string, clock: Clock): EngineResult {
  const inquiry = state.inquiries.find((item) => item.id === inquiryId);
  if (!inquiry) return { ok: false, error: "missing" };
  if (inquiry.status === "closed") return { ok: false, error: "closed" };
  if (inquiry.status === "received") return { ok: false, error: "unassigned" };

  if (inquiry.status === "quoted") return { ok: true, id: inquiryId, state };

  const follow: Job = {
    id: clock.id(),
    inquiryId,
    kind: "quote_followup",
    status: "queued",
    createdAt: clock.now,
    dueAt: clock.now + SLA_MS.quote_followup,
    receipt: "quote.draft → followup",
  };

  return {
    ok: true,
    id: inquiryId,
    state: {
      ...state,
      inquiries: state.inquiries.map((item) =>
        item.id === inquiryId ? { ...item, status: "quoted" } : item,
      ),
      jobs: [
        follow,
        ...state.jobs.map((job) =>
          job.inquiryId === inquiryId &&
          (job.kind === "staff_task" || job.kind === "sla_watch") &&
          job.status !== "done" &&
          job.status !== "dead_letter"
            ? { ...job, status: "done" as const, receipt: "quoted" }
            : job,
        ),
      ],
    },
  };
}

export function closeInquiry(state: OpsState, inquiryId: string): EngineResult {
  const inquiry = state.inquiries.find((item) => item.id === inquiryId);
  if (!inquiry) return { ok: false, error: "missing" };

  return {
    ok: true,
    id: inquiryId,
    state: {
      ...state,
      inquiries: state.inquiries.map((item) =>
        item.id === inquiryId ? { ...item, status: "closed" } : item,
      ),
      jobs: state.jobs.map((job) =>
        job.inquiryId === inquiryId && job.status !== "done" && job.status !== "dead_letter"
          ? { ...job, status: "done", receipt: "closed locally" }
          : job,
      ),
    },
  };
}

export function tickJobs(state: OpsState, now: number): OpsState {
  let changed = false;
  const jobs = state.jobs.map((job) => {
    if ((job.status === "queued" || job.status === "running") && now >= job.dueAt) {
      changed = true;
      return { ...job, status: "overdue" as const, receipt: `sla.overdue@${now}` };
    }
    return job;
  });
  return changed ? { ...state, jobs } : state;
}

export function deadLetter(state: OpsState, jobId: string, reason: string): EngineResult {
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) return { ok: false, error: "missing" };
  if (job.status === "done") return { ok: false, error: "done" };
  if (!reason.trim() || reason.length > 500) return { ok: false, error: "reason" };
  if (job.status === "dead_letter") return { ok: true, id: jobId, state };
  return {
    ok: true,
    id: jobId,
    state: {
      ...state,
      jobs: state.jobs.map((item) =>
        item.id === jobId ? { ...item, status: "dead_letter", receipt: reason } : item,
      ),
    },
  };
}

export function saveDraft(
  state: OpsState,
  draftId: string,
  patch: Partial<Pick<Draft, "bodyEn" | "bodyTh" | "titleEn" | "titleTh">>,
  now: number,
): EngineResult {
  const draft = state.drafts.find((item) => item.id === draftId);
  if (!draft) return { ok: false, error: "missing" };
  const safePatch: typeof patch = {};
  for (const key of ["bodyEn", "bodyTh", "titleEn", "titleTh"] as const) {
    if (patch[key] !== undefined) {
      if (typeof patch[key] !== "string" || patch[key]!.length > 10000)
        return { ok: false, error: "draft" };
      safePatch[key] = patch[key];
    }
  }
  return {
    ok: true,
    id: draftId,
    state: {
      ...state,
      drafts: state.drafts.map((item) =>
        item.id === draftId
          ? { ...item, ...safePatch, status: "draft", blockReason: null, updatedAt: now }
          : item,
      ),
    },
  };
}

export function markDraftReady(state: OpsState, draftId: string, now: number): EngineResult {
  const draft = state.drafts.find((item) => item.id === draftId);
  if (!draft) return { ok: false, error: "missing" };
  if (
    draft.bodyEn.trim().length < 20 ||
    draft.bodyTh.trim().length < 20 ||
    !draft.titleEn.trim() ||
    !draft.titleTh.trim()
  ) {
    return {
      ok: true,
      id: draftId,
      state: {
        ...state,
        drafts: state.drafts.map((item) =>
          item.id === draftId
            ? {
                ...item,
                status: "blocked",
                blockReason: "body-too-short",
                updatedAt: now,
              }
            : item,
        ),
      },
    };
  }
  return {
    ok: true,
    id: draftId,
    state: {
      ...state,
      drafts: state.drafts.map((item) =>
        item.id === draftId
          ? { ...item, status: "ready", blockReason: null, updatedAt: now }
          : item,
      ),
    },
  };
}

export function counts(state: OpsState) {
  return {
    openInquiries: state.inquiries.filter((item) => item.status !== "closed").length,
    overdueJobs: state.jobs.filter((item) => item.status === "overdue").length,
    readyDrafts: state.drafts.filter((item) => item.status === "ready").length,
    queuedJobs: state.jobs.filter((item) => item.status === "queued" || item.status === "running")
      .length,
  };
}

function draft(
  channel: DraftChannel,
  titleEn: string,
  titleTh: string,
  bodyEn: string,
  bodyTh: string,
): Draft {
  return {
    id: channel,
    channel,
    titleEn,
    titleTh,
    bodyEn,
    bodyTh,
    status: "draft",
    updatedAt: 0,
    blockReason: null,
  };
}

export function seedDrafts(now: number): Draft[] {
  return [
    draft(
      "line",
      "LINE OA — first reply",
      "LINE OA — ข้อความแรก",
      "SIRAWAT × BALL, Phitsanulok. Send the brief here. The 3D salon and the grounds are on the site — we answer in this chat, not through an OTA.",
      "SIRAWAT × BALL พิษณุโลก ส่งบรีฟมาที่แชตนี้ แกลเลอรี 3D และลานขับอยู่บนเว็บ — เราตอบในแชต ไม่ผ่านตัวกลางจอง",
    ),
    draft(
      "facebook",
      "Facebook — atelier note",
      "Facebook — บันทึกห้องทำงาน",
      "Two principals. One room. Brand systems and spatial 3D from Phitsanulok. Inquire on the site or LINE — this post is not a booking.",
      "สองคน หนึ่งห้อง ระบบแบรนด์และสามมิติจากพิษณุโลก สอบถามบนเว็บหรือ LINE — โพสต์นี้ไม่ใช่การจอง",
    ),
    draft(
      "instagram",
      "Instagram — salon still",
      "Instagram — ภาพห้อง",
      "Orbit the octagon. Click a frame. The site is the room, not a grid.",
      "โคจรในห้องแปดเหลี่ยม คลิกกรอบภาพ เว็บคือห้อง ไม่ใช่ตารางรูป",
    ),
    draft(
      "tiktok",
      "TikTok — drive the grounds",
      "TikTok — ขับในลาน",
      "WASD through four zones. Twelve studies. A turns left. Cut: night plaza, coral car, crystal.",
      "WASD สี่โซน สิบสองชิ้นงาน A เลี้ยวซ้าย ตัดภาพ: ลานกลางคืน รถ คริสตัล",
    ),
    draft(
      "google",
      "Google Business — facts only",
      "Google Business — เฉพาะข้อเท็จจริง",
      "Category: Design studio. City: Phitsanulok. No live rate. Photos: salon, grounds, bench. Review ask after a finished commission, via LINE.",
      "หมวด: สตูดิโอออกแบบ เมือง: พิษณุโลก ไม่มีเรทสด รูป: ห้อง ลาน โต๊ะงาน ขอรีวิวหลังจบงาน ผ่าน LINE",
    ),
    draft(
      "web",
      "Site — source of truth",
      "เว็บ — ต้นฉบับ",
      "The site holds the 3D salon, the grounds, and the enquiry. LINE is the conversation. Google is discovery. Nothing here is a confirmed reservation.",
      "เว็บถือแกลเลอรี 3D ลาน และข้อความ LINE คือบทสนทนา Google คือการค้นพบ ไม่มีการยืนยันจองในระบบนี้",
    ),
  ].map((item) => ({ ...item, updatedAt: now }));
}
