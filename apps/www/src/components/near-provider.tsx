"use client";

import { NearContext } from "@/near/context";
import { Wallet } from "@/near/wallet";
import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";
import { setAuthCookie, removeAuthCookie } from "@/app/actions";
import { getUserProfile } from "@/lib/api/user";

const GuestbookNearContract = "dev-1234567890123"; // Replace with actual contract ID
const NetworkId = "testnet";

export default function NearProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setWallet, setAccountId, accountId } = useAuthStore();

  useEffect(() => {
    const wallet = new Wallet({
      createAccessKeyFor: GuestbookNearContract,
      networkId: NetworkId,
    });

    setWallet(wallet);
    wallet.startUp(async (accountId) => {
      setAccountId(accountId || null);

      if (accountId) {
        // User is signed in
        const url = new URL(window.location.href);
        const email = url.searchParams.get("email") || accountId;

        // Set auth cookie using server action
        await setAuthCookie(accountId);
        useAuthStore.setState({ isAuthenticated: true });

        try {
          // Check onboarding status
          const profile = await getUserProfile();

          useAuthStore.setState({ user: profile });

          if (!profile.profileData.onboardingComplete) {
            window.location.href = "/onboarding";
            return;
          }

          // If onboarding is complete, handle returnUrl or go to quests
          const returnUrl = url.searchParams.get("returnUrl");
          if (returnUrl && !returnUrl.startsWith("http")) {
            window.location.href = decodeURIComponent(returnUrl);
          } else {
            window.location.href = "/quests";
          }
        } catch (error) {
          console.error("Failed to check onboarding status:", error);
          // If we can't determine onboarding status, assume it's needed
          window.location.href = "/onboarding";
        }
      } else {
        // User is signed out
        await removeAuthCookie();
        useAuthStore.setState({ user: null, isAuthenticated: false });
      }
    });
  }, [setWallet, setAccountId]);

  // Get wallet instance for backward compatibility with NearContext
  const wallet = useAuthStore((state) => state.wallet);

  return (
    <NearContext.Provider
      value={{
        wallet: wallet || ({} as Wallet),
        signedAccountId: accountId || undefined,
      }}
    >
      {children}
    </NearContext.Provider>
  );
}
