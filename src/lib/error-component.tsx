import type { ErrorComponentProps } from "@tanstack/react-router";
import { useLocale } from "@/lib/copy";
import { TriangleAlert } from "lucide-react";

const messages = {
  en: {
    title: "Something went wrong",
    body: "An unexpected error occurred. Try reloading the page.",
    details: "Technical details",
  },
  th: {
    title: "เกิดข้อผิดพลาด",
    body: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาโหลดหน้าใหม่",
    details: "รายละเอียดทางเทคนิค",
  },
  zh: { title: "出现了问题", body: "发生了意外错误，请尝试重新加载页面。", details: "技术详情" },
};

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const lang = useLocale();
  const text = messages[lang];
  const detail = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  return (
    <main
      className={
        "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center " +
        "bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
      }
    >
      <span className="text-red-500" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="text-lg font-semibold">{text.title}</h1>
      <p className="max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400">{text.body}</p>
      {detail && (
        <details className="max-w-md text-sm break-words">
          <summary className="cursor-pointer">{text.details}</summary>
          <p>{detail}</p>
        </details>
      )}
    </main>
  );
}
