"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/lib/hooks/use-auth";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

export default function HomePage() {
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
    <Container>
      <div className="flex min-h-dvh flex-col justify-center items-center px-4 text-center space-y-16">
        <div className="w-64 h-64 relative">
          <Image
            src="/images/rngfanclub-logo-white.png"
            alt="Renegade Fan Club"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="space-y-6">
          <Button onClick={login} className="rounded-full" size="lg">
            Get in the game
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Connect with Apple or Google to start
          </p>
        </div>
      </div>
    </Container>
  );
}
