"use client";

import { cn } from "../lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFootball,
  faMedal,
  faTrophy,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export function BottomNav() {
  const currentPath = usePathname();
  const links = [
    {
      to: "/games",
      icon: faFootball,
      label: "Games",
    },
    {
      to: "/quests",
      icon: faMedal,
      label: "Quests",
    },
    {
      to: "/leaderboard",
      icon: faTrophy,
      label: "Leaderboard",
    },
    {
      to: "/profile",
      icon: faUser,
      label: "Profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-gray-800 bg-background shadow-[0_-4px_0_rgba(0,0,0,1)]">
      <div className="container mx-auto flex h-24 items-center justify-around px-4 md:h-24 max-w-lg">
        {links.map((link) => {
          const isActive = currentPath === link.to;
          return (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                "flex flex-col items-center justify-center h-16 w-16 rounded-xl bg-white/10 border backdrop-blur-lg shadow-md ",
                isActive
                  ? " text-white border-white"
                  : "border-white/20 hover:border-white text-white/80 hover:text-white",
              )}
            >
              <FontAwesomeIcon icon={link.icon} size="lg" className="h-7 w-7" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
