import { BottomNav } from "../../components/bottom-nav";
import { createFileRoute, Outlet, redirect, useRouteContext } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { auth } = useRouteContext({ from: "/_layout/_authenticated" });

  const handleLogout = async () => {
    await auth?.wallet.signOut();
  };

  return (
    <>
      <header className="border-b border-gray-800 bg-white shadow-[0_4px_0_rgba(0,0,0,1)]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="font-semibold">
            {auth?.signedAccountId}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4 pb-24 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="border-2 border-gray-800 bg-white p-6 shadow-[4px_4px_0_rgba(0,0,0,1)]">
            <Outlet />
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
