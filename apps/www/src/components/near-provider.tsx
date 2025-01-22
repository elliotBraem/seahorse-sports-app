"use client";

import { NearContext } from "@/near/context";
import { Wallet } from "@/near/wallet";
import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";
import { setAuthCookie, removeAuthCookie } from "@/app/actions";

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
        const email = accountId; // Using accountId as email for demo
        const user = {
          id: accountId,
          email,
          name: accountId.split(".")[0], // Use first part of accountId as name
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          points: 0,
          completedQuests: [],
        };

        // Set auth cookie using server action
        await setAuthCookie(user.id);
        useAuthStore.setState({ user, isAuthenticated: true });

        // Handle returnUrl redirect
        const url = new URL(window.location.href);
        const returnUrl = url.searchParams.get("returnUrl");
        if (returnUrl && !returnUrl.startsWith("http")) {
          window.location.href = decodeURIComponent(returnUrl);
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
