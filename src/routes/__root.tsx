import { Outlet, createRootRoute } from '@tanstack/react-router';
import { RootLayout } from '@/components/layout/RootLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { useAuthStore } from '@/lib/store';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <RootLayout>
      {isAuthenticated ? (
        <AuthLayout>
          <Outlet />
        </AuthLayout>
      ) : (
        <Outlet />
      )}
    </RootLayout>
  );
}