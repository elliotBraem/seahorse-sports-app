import { Outlet } from '@tanstack/react-router';
import { Navigate } from '@tanstack/react-router';
import { useAuthStore } from '@/lib/store';
import { MainNav } from './MainNav';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <MainNav />
      <main className="container mx-auto py-6 px-4 md:px-6">{children}</main>
    </>
  );
}