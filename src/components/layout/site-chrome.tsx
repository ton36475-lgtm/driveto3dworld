import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useLocale } from "@/lib/copy";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";

export function SiteChrome({ children }: { children: ReactNode }) {
  const lang = useLocale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const immersive = pathname === "/" || pathname === "/gallery" || pathname === "/drive";

  return (
    <div className="min-h-svh bg-background text-foreground">
      <a href="#content" className="skip-link">
        {{ en: "Skip to content", th: "ข้ามไปที่เนื้อหา", zh: "跳转到内容" }[lang]}
      </a>
      <SiteNav transparent={immersive} />
      <div id="content" className="route-content" key={pathname}>
        {children}
      </div>
      {pathname === "/gallery" || pathname === "/drive" ? null : <SiteFooter />}
    </div>
  );
}
