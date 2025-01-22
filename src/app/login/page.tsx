"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";

function LoginContent() {
  const { login } = useAuth();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Renegade Sports</h1>
      <Button onClick={login}>Connect NEAR Wallet</Button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[100dvh] items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
