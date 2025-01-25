"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithPhoneNumber } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function phoneLoginPage() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const phoneParam = searchParams.get("phone");
    if (phoneParam) {
      setPhone(phoneParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithPhoneNumber(phone);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign in with phone</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="phone"
            placeholder="Enter your phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
