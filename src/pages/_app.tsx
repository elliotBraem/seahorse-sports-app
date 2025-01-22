import { useEffect } from 'react';
import { NearContext } from '../context/near';
import { Wallet } from '../near/wallet';
import { BottomNav } from '../components/bottom-nav';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useAuthStore } from '@/lib/store';

const GuestbookNearContract = "dev-1234567890123"; // Replace with actual contract ID
const NetworkId = "testnet";

export default function App({ Component, pageProps }: AppProps) {
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

  // Set cookie for middleware auth check
  useEffect(() => {
    if (accountId) {
      document.cookie = `near_account_id=${accountId}; path=/`;
    } else {
      document.cookie = 'near_account_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
  }, [accountId]);

  // Get wallet instance for backward compatibility with NearContext
  const wallet = useAuthStore((state) => state.wallet);

  return (
    <NearContext.Provider value={{ wallet: wallet || {} as Wallet, signedAccountId: accountId || undefined }}>
      {accountId && <BottomNav />}
      <Component {...pageProps} />
    </NearContext.Provider>
  );
}
