"use client";

import { removeAuthCookie, setAuthCookie } from "@/app/actions";
import { useAuthStore } from "@/lib/store";
import { NearContext } from "@/near/context";
import { Wallet } from "@/near/wallet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const GuestbookNearContract = "dev-1234567890123"; // Replace with actual contract ID
const NetworkId = "testnet";

export default function NearProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setWallet, setAccountId, accountId } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const wallet = new Wallet({
      createAccessKeyFor: GuestbookNearContract,
      networkId: NetworkId,
    });

    setWallet(wallet);
    wallet.startUp(async (accountId) => {
      setAccountId(accountId || null);

      if (accountId) {
        // Set auth cookie using server action
        await setAuthCookie(accountId);

        useAuthStore.setState({
          isAuthenticated: true,
        });

        // Redirect to /quests (middleware will handle onboarding check)
        router.push("/quests");
      } else {
        // User is signed out
        await removeAuthCookie();
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
        });

        // Redirect to home
        router.push("/");
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
