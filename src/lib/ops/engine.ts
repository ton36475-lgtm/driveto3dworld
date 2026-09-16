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
  patch: Partial<Pick<Draft, "bodyEn" | "bodyTh" | "bodyZh" | "titleEn" | "titleTh" | "titleZh">>,
  now: number,
): EngineResult {
  const draft = state.drafts.find((item) => item.id === draftId);
  if (!draft) return { ok: false, error: "missing" };
  const safePatch: typeof patch = {};
  for (const key of ["bodyEn", "bodyTh", "bodyZh", "titleEn", "titleTh", "titleZh"] as const) {
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
    (draft.bodyZh?.trim().length ?? 0) < 20 ||
    !draft.titleEn.trim() ||
    !draft.titleTh.trim() ||
    !draft.titleZh?.trim()
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
  titleZh: string,
  bodyZh: string,
): Draft {
  return {
    id: channel,
    channel,
    titleEn,
    titleTh,
    bodyEn,
    bodyTh,
    titleZh,
    bodyZh,
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
      "SIRAWAT × BALL, Phitsanulok. Tell us about your website, creative media, or music project. Explore the 3D gallery, then share your brief through your chosen contact channel.",
      "SIRAWAT × BALL พิษณุโลก เล่าโครงการเว็บไซต์ สื่อสร้างสรรค์ หรือดนตรีของคุณ ชมแกลเลอรี 3D แล้วส่งบรีฟผ่านช่องทางติดต่อที่คุณเลือก",
      "LINE 官方账号 — 首次回复",
      "SIRAWAT × BALL，来自彭世洛。欢迎介绍您的网站、创意媒体或音乐项目。先浏览三维展厅，再通过您选择的联系渠道分享需求说明。",
    ),
    draft(
      "facebook",
      "Facebook — atelier note",
      "Facebook — บันทึกห้องทำงาน",
      "AI, websites, and music from Phitsanulok. Explore Sirawat’s technology projects, Ball Anekprasong’s folk music, and ideas for future collaborations in the shared portfolio.",
      "AI เว็บไซต์ และดนตรีจากพิษณุโลก ชมโครงการเทคโนโลยีของศิรวัฒน์ ดนตรีโฟลคของพี่บอลอเนกประสงค์ และแนวทางทำงานร่วมกันในพอร์ตโฟลิโอ",
      "Facebook — 创作札记",
      "来自彭世洛的人工智能、网站与音乐。在共同作品集中，了解 Sirawat 的技术项目、Ball Anekprasong 的民谣音乐，以及未来合作的构想。",
    ),
    draft(
      "instagram",
      "Instagram — salon still",
      "Instagram — ภาพห้อง",
      "Orbit the octagon. Click a frame. The site is the room, not a grid.",
      "โคจรในห้องแปดเหลี่ยม คลิกกรอบภาพ เว็บคือห้อง ไม่ใช่ตารางรูป",
      "Instagram — 展厅影像",
      "环绕八角形展厅，点击画框探索作品。在这个网站中，每件作品都是空间体验的一部分，邀请您从不同角度了解创作。",
    ),
    draft(
      "tiktok",
      "TikTok — drive the grounds",
      "TikTok — ขับในลาน",
      "WASD through four zones. Twelve studies. A turns left. Cut: night plaza, coral car, crystal.",
      "WASD สี่โซน สิบสองชิ้นงาน A เลี้ยวซ้าย ตัดภาพ: ลานกลางคืน รถ คริสตัล",
      "TikTok — 驾驶探索",
      "使用 WASD 在四个区域中驾驶，探索十二个作品节点，A 键向左转。短片镜头建议：夜间广场、汽车与水晶。",
    ),
    draft(
      "google",
      "Google Business — facts only",
      "Google Business — เฉพาะข้อเท็จจริง",
      "Location: Phitsanulok. Work: AI, websites, and music. Use current, verified contact information. Show portfolio concepts as concepts; do not present them as completed client work.",
      "ที่ตั้ง: พิษณุโลก งาน: AI เว็บไซต์ และดนตรี ใช้ข้อมูลติดต่อที่ตรวจสอบล่าสุด ระบุงานแนวคิดในพอร์ตตามจริง ไม่กล่าวอ้างว่าเป็นงานลูกค้าที่ส่งมอบแล้ว",
      "Google 商家资料 — 事实信息",
      "所在地：彭世洛。工作方向：人工智能、网站与音乐。使用经过核实的最新联系方式；作品集中的概念方案应明确标注，不能宣称为已交付的客户项目。",
    ),
    draft(
      "web",
      "Site — source of truth",
      "เว็บ — ต้นฉบับ",
      "Explore the 3D gallery, driving grounds, and individual portfolios. Save your brief locally, download it, then share it through your preferred contact channel. Saving does not send the brief.",
      "ชมแกลเลอรี 3D ลานขับ และพอร์ตของแต่ละคน บันทึกบรีฟในเครื่อง ดาวน์โหลด แล้วส่งต่อผ่านช่องทางที่คุณเลือก การบันทึกยังไม่ใช่การส่งบรีฟ",
      "网站 — 项目信息",
      "探索三维展厅、驾驶场景和个人作品集。将需求说明保存在本地并下载，再通过您选择的联系渠道分享。保存操作不会自动发送需求说明。",
    ),
  ].map((item) => ({ ...item, updatedAt: now }));
}
