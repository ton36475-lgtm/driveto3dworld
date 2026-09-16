import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteChrome } from "@/components/layout/site-chrome";
import { AuthProvider } from "@/lib/auth/provider";
import { useLang } from "@/lib/lang";
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
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
