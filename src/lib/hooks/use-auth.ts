import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../store';

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { connectWallet, disconnectWallet } = useAuthStore();

  const login = async () => {
    await connectWallet();
    const returnUrl = searchParams.get('returnUrl') || '/quests';
    router.push(decodeURIComponent(returnUrl));
  };

  const logout = async () => {
    await disconnectWallet();
    router.push('/');
  };

  return {
    login,
    logout,
    ...useAuthStore(),
  };
}
