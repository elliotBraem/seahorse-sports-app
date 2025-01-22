import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";
import { NotFound } from "./components/not-found";

export function createRouter() {
  const queryClient = new QueryClient();
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      defaultPreload: "intent",
      // Since we're using React Query, we don't want loader calls to ever be stale
      // This will ensure that the loader is always called when the route is preloaded or visited
      defaultPreloadStaleTime: 0,
      context: {
        auth: undefined,
        queryClient,
      },
      defaultErrorComponent: () => <p>caught</p>,
      defaultNotFoundComponent: () => <NotFound />,
    }),
    queryClient
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
