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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset bg-background/80 backdrop-blur-xl shadow-lg">
      <div className="container mx-auto flex h-16 justify-center items-center gap-3 max-w-sm">
        {links.map((link) => {
          const isActive = currentPath === link.to;
          return (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                "relative flex flex-col items-center justify-center h-12 w-16 rounded-2xl transition-all duration-200",
                "hover:scale-105 active:scale-95",
                "touch-none select-none",
                isActive
                  ? "text-white after:absolute after:bottom-0 after:h-1 after:w-8 after:rounded-full after:bg-gradient-to-r after:from-secondary after:to-[#FFA37BB0]"
                  : "text-white/60 hover:text-white/80",
              )}
            >
              <FontAwesomeIcon 
                icon={link.icon} 
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isActive && "scale-110"
                )} 
              />
              <span className="mt-1 text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
