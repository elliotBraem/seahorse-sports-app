import { MainNav } from "@/components/header";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => (
    <>
      <MainNav />
      <main className="container mx-auto py-6 px-4 md:px-6">
        <Outlet />
      </main>
    </>
  ),
});
