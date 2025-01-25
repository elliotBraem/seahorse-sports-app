"use client";

import { getUserProfile } from "@/lib/api/user";
import { getCurrentUserInfo } from "@/lib/auth";
import { type ProfileResponse } from "@renegade-fanclub/types";
import { useQuery } from "@tanstack/react-query";

export function useUserProfile() {
  const { data: magicUser, ...magicQuery } = useQuery({
    queryKey: ["magic-user"],
    queryFn: getCurrentUserInfo,
  });

  console.log("magicUser", magicUser);

  const profileQuery = useQuery<ProfileResponse>({
    queryKey: ["user-profile", magicUser?.issuer],
    queryFn: () => getUserProfile({ userId: magicUser?.issuer! }),
    enabled: !!magicUser?.issuer,
  });

  return {
    data: profileQuery.data,
    isLoading: magicQuery.isLoading || profileQuery.isLoading,
    error: magicQuery.error || profileQuery.error,
  };
}
