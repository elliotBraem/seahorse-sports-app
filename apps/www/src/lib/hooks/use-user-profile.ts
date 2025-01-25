"use client";

import { getUserProfile } from "@/lib/api/user";
import { getCurrentUserInfo } from "@/lib/auth";
import { type ProfileResponse } from "@renegade-fanclub/types";
import { useQuery } from "@tanstack/react-query";

export function useUserProfile(userId?: string) {
  if (!userId) {
    const magicQuery = useQuery({
      queryKey: ["magic-user"],
      queryFn: getCurrentUserInfo,
      staleTime: 1000 * 60 * 1, // Cache for 1 minutes
    });

    const magicUser = magicQuery.data;

    const profileQuery = useQuery<ProfileResponse>({
      queryKey: ["user-profile", magicUser?.issuer],
      queryFn: () => getUserProfile({ userId: magicUser?.issuer! }),
      enabled: !!magicUser?.issuer,
      staleTime: 1000 * 60 * 1, // Cache for 1 minutes
    });

    const combinedData = magicUser && {
      ...profileQuery.data,
      issuer: magicUser.issuer,
      publicAddress: magicUser.publicAddress,
      email: magicUser.email,
      phoneNumber: magicUser.phoneNumber,
      isMfaEnabled: magicUser.isMfaEnabled,
    };

    return {
      data: combinedData || null,
      isLoading: magicQuery.isLoading || profileQuery.isLoading,
      error: magicQuery.error || profileQuery.error,
    };
  } else {
    const profileQuery = useQuery<ProfileResponse>({
      queryKey: ["user-profile", userId],
      queryFn: () => getUserProfile({ userId: userId! }),
      enabled: !!userId,
      staleTime: 1000 * 60 * 1, // Cache for 1 minutes
    });

    return {
      data: profileQuery.data ? {
        ...profileQuery.data,
        issuer: userId,
      } : null,
      isLoading: profileQuery.isLoading,
      error: profileQuery.error,
    };
  }
}
