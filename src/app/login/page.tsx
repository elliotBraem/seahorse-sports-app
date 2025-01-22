"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/lib/hooks/use-auth";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    // <div className="flex min-h-[100dvh] flex-col items-center justify-center space-y-4">
    //   <Card className="max-w-md w-full">
    //     <CardContent className="space-y-10 pt-6">
    //       <h1 className="text-2xl font-bold">Welcome to Renegade Sports</h1>
    //       <Button onClick={login}>Connect NEAR Wallet</Button>
    //     </CardContent>
    //   </Card>
    // </div>
    <Container>
      <div className="flex min-h-[100dvh] flex-col items-center justify-center space-y-16 text-center">
        <Card className="max-w-xl">
          <CardHeader>
            <h1 className="text-4xl text-white font-bold tracking-tight">
              Welcome Back!
            </h1>
            <CardDescription>
              Login to access your fan profile and continue your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="rounded-full" size="lg">
              Connect NEAR Wallet
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Sign in with your NEAR wallet to access your account
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
