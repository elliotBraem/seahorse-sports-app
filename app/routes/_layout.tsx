import { cn } from "@/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div
      className={cn(
        "min-h-[100dvh] w-full overflow-x-hidden",
        "bg-gradient-to-br from-background to-muted",
        "from-purple-600 to-blue-600"
      )}
    >
      <div className="h-full w-full">
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
}
