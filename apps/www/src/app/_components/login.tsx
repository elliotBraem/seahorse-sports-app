"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";

export function Login() {
  const { login } = useAuth();

  return (
    <Button onClick={login} className="rounded-full" size="lg">
      Sign in with Google
    </Button>
  );
}
