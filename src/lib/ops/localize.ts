import type { Draft } from "./types.ts";

// Kept dependency-free so locale behavior and old-backup display can be tested in Node.
export type OpsLocale = "en" | "th" | "zh";
export const OPS_DATE_LOCALES: Record<OpsLocale, string> = {
  en: "en-GB",
  th: "th-TH",
  zh: "zh-CN",
};
export const DRAFT_FIELDS = {
  en: { title: "titleEn", body: "bodyEn" },
  th: { title: "titleTh", body: "bodyTh" },
  zh: { title: "titleZh", body: "bodyZh" },
} as const;

export function draftText(draft: Draft, lang: OpsLocale) {
  const fields = DRAFT_FIELDS[lang];
  return { title: draft[fields.title] ?? "", body: draft[fields.body] ?? "" };
}

/** Translate known system receipts only; preserve user-entered reasons verbatim. */
export function receiptText(receipt: string, lang: OpsLocale): string {
  const known = {
    "inquiry.received → staff_task": {
      en: "Local follow-up task created",
      th: "สร้างงานติดตามในเครื่องแล้ว",
      zh: "已创建本地跟进任务",
    },
    "inquiry.received → sla_watch": {
      en: "Local deadline reminder created",
      th: "สร้างการเตือนกำหนดเวลาในเครื่องแล้ว",
      zh: "已创建本地时限提醒",
    },
    "quote.draft → followup": {
      en: "Local quote follow-up created",
      th: "สร้างงานติดตามใบเสนอในเครื่องแล้ว",
      zh: "已创建本地报价跟进任务",
    },
    quoted: {
      en: "Quote marked as prepared locally",
      th: "ระบุว่าเตรียมใบเสนอแล้วในเครื่อง",
      zh: "已在本地标记报价已准备",
    },
    "closed locally": {
      en: "Closed on this device",
      th: "ปิดรายการบนอุปกรณ์นี้แล้ว",
      zh: "已在此设备关闭记录",
    },
    "manual-reconcile": {
      en: "Parked for manual review",
      th: "พักไว้เพื่อตรวจสอบด้วยตัวเอง",
      zh: "已暂存，等待人工核查",
    },
  };
  if (Object.hasOwn(known, receipt)) return known[receipt as keyof typeof known][lang];
  if (/^sla\.overdue@\d+$/.test(receipt)) {
    return { en: "Local deadline passed", th: "เกินกำหนดเวลาในเครื่อง", zh: "本地任务已逾期" }[
      lang
    ];
  }
  const assigned = /^assigned:(.+)@\d+$/.exec(receipt);
  if (assigned) {
    return `${{ en: "Assigned locally to", th: "มอบหมายในเครื่องให้", zh: "本地负责人：" }[lang]} ${assigned[1]}`;
  }
  return receipt;
}
