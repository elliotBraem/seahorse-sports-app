"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/user";
import { type ProfileResponse } from "@renegade-fanclub/types";

export function useUserProfile(userId?: string) {
  return useQuery<ProfileResponse>({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile({ userId }),
    enabled: !!userId,
  });
}
