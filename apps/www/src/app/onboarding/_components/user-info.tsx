"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";

interface UserInfoProps {
  onNext: (username: string, email: string) => void;
}

export function UserInfo({ onNext }: UserInfoProps) {
  const user = useAuthStore((state) => state.user);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [error, setError] = useState("");

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
        {!user?.email && (
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
        )}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!username.trim() || (!user?.email && !email.trim())}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
