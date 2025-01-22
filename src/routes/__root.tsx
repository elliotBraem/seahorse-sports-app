import { NotFound } from "@/components/not-found";
import { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import React from "react";

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

import { Wallet } from "@/near/wallet";

interface NearAuth {
  signedAccountId: string;
  wallet: Wallet;
}

export const Route = createRootRouteWithContext<{
  auth: NearAuth | undefined;
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth?.signedAccountId) {
      return { auth: undefined };
    }
    return { auth: context.auth };
  },
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <React.Suspense>
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </React.Suspense>
    </>
  );
}
