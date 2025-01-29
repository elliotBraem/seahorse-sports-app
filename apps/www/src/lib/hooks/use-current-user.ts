import { getCurrentUserInfo } from "@/lib/auth";
import { useEffect, useState } from "react";
import type { MagicUserMetadata } from "magic-sdk";

export function useCurrentUser() {
  const [user, setUser] = useState<MagicUserMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await getCurrentUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading };
}
