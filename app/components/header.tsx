import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import { LogOut, Menu, Target, Trophy, User } from "lucide-react";

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <Trophy className="h-6 w-6" />
          <span className="font-bold">-------</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <nav className="hidden items-center space-x-6 md:flex">
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}

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
