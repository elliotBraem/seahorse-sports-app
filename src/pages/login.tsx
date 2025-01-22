import { Button } from "@/components/ui/button";
import { useNear } from "@/context/near";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const { wallet, signedAccountId } = useNear();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (signedAccountId) {
      router.push((redirect as string) || "/polls");
    }
  }, [signedAccountId, router, redirect]);

  const handleLogin = () => {
    wallet.signIn();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Renegade Sports</h1>
      <Button onClick={handleLogin}>Connect NEAR Wallet</Button>
    </div>
  );
}
