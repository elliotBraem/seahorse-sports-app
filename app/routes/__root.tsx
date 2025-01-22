import { Wallet } from "@/near/wallet";
import { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import * as React from "react";
import appCss from "@/index.css?url";

export const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

export const ReactQueryDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/react-query-devtools").then((d) => ({
          default: d.ReactQueryDevtools,
        }))
      );

interface NearAuth {
  signedAccountId: string;
  wallet: Wallet;
}

export const Route = createRootRouteWithContext<{
  auth: NearAuth | undefined;
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      }
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: RootComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth?.signedAccountId) {
      return { auth: undefined };
    }
    return { auth: context.auth };
  },
  // notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <head>
          <Meta />
        </head>
      <body>
        {children}
        <ScrollRestoration />
        <React.Suspense>
          <TanStackRouterDevtools position="bottom-left" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </React.Suspense>
        <Scripts />
      </body>
    </html>
  );
}
