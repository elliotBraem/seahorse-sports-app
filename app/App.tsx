import { GuestbookNearContract, NETWORK_ID } from "@/near/config";
import { Wallet } from "@/near/wallet";
import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface AppProps {
  router: any;
}

type RouterContext = {
  auth: { signedAccountId: string; wallet: Wallet } | undefined;
  queryClient: any;
};

type SearchParams = {
  _data: RouterContext;
  [key: string]: any;
};

export function App({ router }: AppProps) {
  const [wallet] = useState(
    () =>
      new Wallet({
        createAccessKeyFor: GuestbookNearContract,
        networkId: NETWORK_ID,
      })
  );

  useEffect(() => {
    wallet
      .startUp((newAccountId) => {
        // Update router context when account changes
        router.navigate({
          search: (prev: SearchParams) => ({
            ...prev,
            _data: {
              ...router.state.context,
              auth: newAccountId
                ? { signedAccountId: newAccountId, wallet }
                : undefined,
            },
          }),
        });
      })
      .then((initialAccount) => {
        // Set initial account
        router.navigate({
          search: (prev: SearchParams) => ({
            ...prev,
            _data: {
              ...router.state.context,
              auth: initialAccount
                ? { signedAccountId: initialAccount, wallet }
                : undefined,
            },
          }),
        });
      });
  }, [wallet, router]);

  return <RouterProvider router={router} />;
}
