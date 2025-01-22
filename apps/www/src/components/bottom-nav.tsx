"use client";

import { Target, Trophy, User } from "lucide-react";
import { cn } from "../lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function BottomNav() {
  const currentPath = usePathname();
  const links = [
    {
      to: "/quests",
      icon: Target,
      label: "Quests",
    },
    {
      to: "/leaderboard",
      icon: Trophy,
      label: "Leaderboard",
    },
    {
      to: "/profile",
      icon: User,
      label: "Profile",
    },
  ];

  return (
    <nav className="fixed h-16 bottom-0 left-0 right-0 z-50 border-gray-800 bg-background shadow-[0_-4px_0_rgba(0,0,0,1)]">
      <div className="container mx-auto flex h-16 items-center justify-around px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.to;
          return (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                "flex flex-col items-center space-y-1",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
