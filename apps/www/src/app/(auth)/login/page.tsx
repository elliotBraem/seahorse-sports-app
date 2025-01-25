"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { loginWithEmail, loginWithPhoneNumber } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { Login } from "../_components/login";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loginType = searchParams.get("type");
  const inputRef = useRef<HTMLInputElement>(null);

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
    setError("");
    setIsLoading(true);

    try {
      if (loginType === "email") {
        await loginWithEmail(value);
      } else if (loginType === "phone") {
        await loginWithPhoneNumber(value);
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
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
          <div className="space-y-2 [&_input]:bg-background">
            {loginType === "email" ? (
              <Input
                ref={inputRef}
                type="email"
                inputMode="email"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                className="h-12 text-lg rounded-full px-6 bg-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none"
                required
                disabled={isLoading}
                autoFocus
                autoComplete="email"
              />
            ) : (
              <PhoneInput
                value={value}
                onChange={(value) => {
                  setValue(value || "");
                  setError("");
                }}
                defaultCountry="US"
                international
                countryCallingCodeEditable
                className="[&>input]:px-6 [&>input]:text-base [&>input]:placeholder:text-muted-foreground [&>input]:appearance-none [&>input]:bg-background"
                disabled={isLoading}
                autoFocus
                placeholder="(555) 555-5555"
              />
            )}
            {error && (
              <p className="text-sm text-red-500 px-4">{error}</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full rounded-full h-12 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (loginType === "email" ? "Sending link..." : "Sending code...") : "Continue"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => router.push("/")}
            disabled={isLoading}
          >
            Back
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
