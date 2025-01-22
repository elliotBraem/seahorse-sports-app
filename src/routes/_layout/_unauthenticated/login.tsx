import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_unauthenticated/login")({
  component: LoginPage,
});

function LoginPage() {
  const { auth } = useRouteContext({ from: "/_layout/_unauthenticated/login" });

  const handleLogin = async () => {
    await auth?.wallet.signIn();
    // Navigation will be handled by App.tsx when auth state changes
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
            Connect NEAR Wallet
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Sign in with your NEAR wallet to access your account
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
