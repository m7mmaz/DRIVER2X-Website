import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { STRINGS } from "../content/strings";
import { LanguageProvider, pick, useLanguage } from "../lib/i18n";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  const { lang } = useLanguage();
  return (
    <div className="fe-failure-screen">
      <div className="fe-failure-copy">
        <p>{pick(STRINGS.notFoundTitle, lang)} · 404</p>
        <h1>
          Driver2<span>X</span>
        </h1>
        <h2>{pick(STRINGS.notFoundTitle, lang)}</h2>
        <p>{pick(STRINGS.notFoundBody, lang)}</p>
        <Link to="/" className="fe-failure-action">
          {pick(STRINGS.returnToFrontend, lang)}
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { lang } = useLanguage();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="fe-failure-screen">
      <div className="fe-failure-copy">
        <p>{pick(STRINGS.errorTitle, lang)}</p>
        <h1>
          Driver2<span>X</span>
        </h1>
        <h2>{pick(STRINGS.errorTitle, lang)}</h2>
        <p>{pick(STRINGS.errorBody, lang)}</p>
        <div className="mt-7 flex flex-wrap gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="fe-failure-action"
          >
            {pick(STRINGS.retrySignal, lang)}
          </button>
          <a href="/" className="fe-failure-action">
            {pick(STRINGS.returnToFrontend, lang)}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DRIVER2X — Dynamic Driver 2 Sandbox" },
      {
        name: "description",
        content:
          "DRIVER2X is a modern PC rebuild and dynamic sandbox expansion for Driver 2: dynamic police, heat, fuel, civilian AI and more. Free launcher for Windows.",
      },
      { property: "og:title", content: "DRIVER2X — Dynamic Driver 2 Sandbox" },
      {
        property: "og:description",
        content:
          "DRIVER2X is a modern PC rebuild and dynamic sandbox expansion for Driver 2: dynamic police, heat, fuel, civilian AI and more. Free launcher for Windows.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        // Cairo now covers ALL Arabic typography (display, body, mono) --
        // see styles.css's html[dir="rtl"] rule -- so its weight range was
        // widened from 700-900 (headings-only) to 400-900 (body needs the
        // lighter weights too). Tajawal was dropped entirely: nothing
        // references it anymore now that Cairo replaced it as the body font.
        href: "https://fonts.googleapis.com/css2?family=Saira+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Barlow+Condensed:wght@400;500;600&family=Share+Tech+Mono&family=Cairo:wght@400;500;600;700;800;900&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // Always renders en/ltr on the server -- there is no way to know the
  // visitor's stored language preference before hydration without a
  // backend (explicitly out of scope). LanguageProvider corrects
  // documentElement.dir/lang from localStorage immediately on mount.
  // LanguageProvider wraps at the shell level (not inside RootComponent)
  // so it also covers notFoundComponent/errorComponent -- those can render
  // in place of RootComponent for a root-level match failure, and both use
  // useLanguage() for their own copy.
  return (
    <html lang="en" dir="ltr">
      <head>
        <HeadContent />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
