import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteChrome } from "@/components/layout/site-chrome";
import { AuthProvider } from "@/lib/auth/provider";
import { Button } from "@/components/ui/button";
import { useCopy, useLocale } from "@/lib/copy";
import { htmlLang, useLang } from "@/lib/lang";
import appCss from "../styles.css?url";

const APP_NAME = "SIRAWAT × BALL";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "SIRAWAT × BALL — a two-principal creative atelier in Phitsanulok for brand, space, and cinematic 3D.",
      },
      { name: "theme-color", content: "#0b0b0c" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
  notFoundComponent: PageMissing,
});

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <PreviewHostBridge />
        <div className="grain" aria-hidden="true" />
        <AuthProvider>
          <HtmlLang />
          <SiteChrome>
            <Outlet />
          </SiteChrome>
          <Toaster
            theme="dark"
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#1c1c20",
                color: "#f1ece4",
                border: "1px solid #2a2926",
              },
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function HtmlLang() {
  const lang = useLang((s) => s.lang);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    void Promise.resolve(useLang.persist.rehydrate()).finally(() => setHydrated(true));
  }, []);
  useEffect(() => {
    document.documentElement.lang = htmlLang(lang);
    if (!hydrated) return;
    document.documentElement.dataset.appReady = "true";
    return () => {
      delete document.documentElement.dataset.appReady;
    };
  }, [lang, hydrated]);
  return null;
}

function PageMissing() {
  const copy = useCopy();
  const lang = useLocale();
  const description = {
    en: "This page could not be found. Browse the work index to continue.",
    th: "ไม่พบหน้านี้ ดูสารบัญผลงานเพื่อไปต่อ",
    zh: "未找到此页面。请返回作品目录继续浏览。",
  }[lang];
  return (
    <main className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 pt-20 text-center">
      <h1 className="font-display text-3xl">{copy.notFound.title}</h1>
      <p className="mt-3 text-muted">{description}</p>
      <Button asChild className="mt-8">
        <Link to="/work">{copy.notFound.back}</Link>
      </Button>
    </main>
  );
}
