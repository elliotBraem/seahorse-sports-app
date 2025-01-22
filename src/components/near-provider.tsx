'use client';

import { NearContext } from '@/near/context';
import { Wallet } from '@/near/wallet';
import { useAuthStore } from '@/lib/store';
import { useEffect } from 'react';

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
    wallet.startUp((accountId) => {
      setAccountId(accountId || null);
    });
  }, [setWallet, setAccountId]);

  // Get wallet instance for backward compatibility with NearContext
  const wallet = useAuthStore((state) => state.wallet);

  return (
    <NearContext.Provider value={{ wallet: wallet || {} as Wallet, signedAccountId: accountId || undefined }}>
      {children}
    </NearContext.Provider>
  );
}
