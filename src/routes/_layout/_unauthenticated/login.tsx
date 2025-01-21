import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const Route = createFileRoute("/_layout/_unauthenticated/login")({
  component: LoginPage,
});

function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login("demo@example.com");
    navigate({ to: "/preferrances" });
  };

  return (
    <div
      className={`flex min-h-[100dvh] items-center justify-center p-6 transition-opacity duration-1000`}
    >
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Login to access your fan profile and continue your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} className="w-full" size="lg">
            Login as Demo User
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Experience the platform with our demo account
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
