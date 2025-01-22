import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_unauthenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
