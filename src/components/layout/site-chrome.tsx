import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const immersive = pathname === "/" || pathname === "/gallery" || pathname === "/drive";

  return (
    <div className="min-h-svh bg-background text-foreground">
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <SiteNav transparent={immersive} />
      <div id="content">{children}</div>
      {pathname === "/gallery" || pathname === "/drive" ? null : <SiteFooter />}
    </div>
  );
}
