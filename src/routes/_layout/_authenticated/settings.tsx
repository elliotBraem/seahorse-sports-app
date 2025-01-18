import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_authenticated/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 md:px-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings!</p>
      </div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
