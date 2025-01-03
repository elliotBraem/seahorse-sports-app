import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Target, Trophy, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export function NavLinks() {
  const { logout } = useAuthStore();

  return (
    <>
      <Link
        to="/quests"
        className="flex items-center space-x-2 font-medium transition hover:text-primary"
      >
        <Target className="h-4 w-4" />
        <span>Quests</span>
      </Link>
      <Link
        to="/leaderboard"
        className="flex items-center space-x-2 font-medium transition hover:text-primary"
      >
        <Trophy className="h-4 w-4" />
        <span>Leaderboard</span>
      </Link>
      <Link
        to="/profile"
        className="flex items-center space-x-2 font-medium transition hover:text-primary"
      >
        <User className="h-4 w-4" />
        <span>Profile</span>
      </Link>
      <Button variant="ghost" onClick={logout} className="space-x-2">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </>
  );
}