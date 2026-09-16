export const CHANNELS = ["line", "email", "phone"] as const;
export type Channel = (typeof CHANNELS)[number];

export const INQUIRY_TYPES = ["brand", "space", "motion", "three", "other"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_STATUSES = ["received", "assigned", "quoted", "closed"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const JOB_KINDS = ["staff_task", "sla_watch", "quote_followup"] as const;
export type JobKind = (typeof JOB_KINDS)[number];

export const JOB_STATUSES = ["queued", "running", "done", "overdue", "dead_letter"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const DRAFT_CHANNELS = ["line", "facebook", "instagram", "tiktok", "google", "web"] as const;
export type DraftChannel = (typeof DRAFT_CHANNELS)[number];

export const DRAFT_STATUSES = ["draft", "ready", "blocked"] as const;
export type DraftStatus = (typeof DRAFT_STATUSES)[number];

export type Inquiry = {
  id: string;
  at: number;
  name: string;
  channel: Channel;
  handle: string;
  type: InquiryType;
  message: string;
  status: InquiryStatus;
  assignee: string | null;
};

export type Job = {
  id: string;
  inquiryId: string | null;
  kind: JobKind;
  status: JobStatus;
  createdAt: number;
  dueAt: number;
  receipt: string | null;
};

export type Draft = {
  id: string;
  channel: DraftChannel;
  titleEn: string;
  titleTh: string;
  bodyEn: string;
  bodyTh: string;
  status: DraftStatus;
  updatedAt: number;
  blockReason: string | null;
};

export type OpsState = {
  inquiries: Inquiry[];
  jobs: Job[];
  drafts: Draft[];
};

export type Clock = {
  now: number;
  id: () => string;
};

export const SLA_MS = {
  staff_task: 48 * 60 * 60 * 1000,
  sla_watch: 48 * 60 * 60 * 1000,
  quote_followup: 7 * 24 * 60 * 60 * 1000,
} as const;
