import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store';

export function useAuth() {
  const router = useRouter();
  const { connectWallet, disconnectWallet } = useAuthStore();

  const login = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Login failed:', error);
      // Stay on login page if there's an error
    }
  };

  const logout = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    login,
    logout,
    ...useAuthStore(),
  };
}
