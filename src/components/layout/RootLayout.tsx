import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';

interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function RootLayout({ children, className }: RootLayoutProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div
      className={cn(
        'min-h-[100dvh] w-full overflow-x-hidden',
        'bg-gradient-to-br from-background to-muted',
        !isAuthenticated && 'from-purple-600 to-blue-600',
        className
      )}
    >
      <div className="h-full w-full">{children}</div>
    </div>
  );
}