"use client";

import { Gamepad2, Target, Trophy, User } from "lucide-react";
import { cn } from "../lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function BottomNav() {
  const currentPath = usePathname();
  const links = [
    {
      to: "/games",
      icon: Gamepad2,
      label: "Games",
    },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-gray-800 bg-background shadow-[0_-4px_0_rgba(0,0,0,1)]">
      <div className="container mx-auto pb-1 flex h-16 items-center justify-around px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.to;
          return (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                "flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-white/10 border backdrop-blur-lg shadow-md ",
                isActive
                  ? " text-white border-white"
                  : "border-white/20 hover:border-white",
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
