"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import { useEffect, useState } from "react";

interface UserInfoProps {
  onNext: (username: string, email: string) => void;
}

export function UserInfo({ onNext }: UserInfoProps) {
  const { data: profile, isLoading } = useUserProfile();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
    if (profile?.email) {
      setEmail(profile.email);
    }
  }, [profile]);

  const handleSubmit = () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Valid email is required");
      return;
    }

    onNext(username.trim(), email.trim());
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !username.trim() || !email.trim()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
