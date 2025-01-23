"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function Login() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  // Handle email from query params
  useEffect(() => {
    const email = searchParams.get("email");
    if (email && user) {
      setUser({ ...user, email });
    }
  }, [searchParams, user, setUser]);

  return (
    <Button onClick={login} className="rounded-full" size="lg">
      Get in the game
    </Button>
  );
}
