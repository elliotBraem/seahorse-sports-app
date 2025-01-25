"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithEmail, loginWithPhoneNumber } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Login } from "../_components/login";

function LoginContent() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const loginType = searchParams.get("type");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const phoneParam = searchParams.get("phone");
    if (emailParam) {
      setValue(emailParam);
    } else if (phoneParam) {
      setValue(phoneParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === "email") {
      await loginWithEmail(value);
    } else if (loginType === "phone") {
      await loginWithPhoneNumber(value);
    }
  };

  if (!loginType) {
    return <Login />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Sign in with {loginType === "email" ? "Email" : "Phone"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type={loginType === "email" ? "email" : "tel"}
            placeholder={`Enter your ${loginType === "email" ? "email" : "phone"}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
          <Button type="submit" className="w-full rounded-full" size="lg">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}