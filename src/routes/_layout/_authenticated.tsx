import { BottomNav } from "../../components/bottom-nav";
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
      <main className="container mx-auto py-6 px-4 pb-24 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="border-2 border-gray-800 bg-white p-6 shadow-[4px_4px_0_rgba(0,0,0,1)]">
            <Outlet />
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  ),
});
