"use client";

import { type GameResponse } from "@renegade-fanclub/types";
import FootballHelmet from "@/components/football-helmet";

interface TeamCardProps {
  teamName: string;
  teamMetadata:
    | GameResponse["homeTeamMetadata"]
    | GameResponse["awayTeamMetadata"];
  isHome: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export function TeamCard({
  teamName,
  teamMetadata,
  isHome,
  selected,
  onClick,
}: TeamCardProps) {
  return (
    <div
      onClick={selected ? undefined : onClick}
      className={`flex flex-col items-center gap-3 w-[160px] sm:w-[180px] transition-all duration-300 ${
        selected
          ? "scale-110 ring-2 ring-white/50 rounded-lg p-3 cursor-not-allowed"
          : "cursor-pointer"
      }`}
    >
      <div className="relative w-[80px] sm:w-[120px] aspect-square">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="transform transition-transform hover:scale-105"
            style={{
              filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))",
            }}
          >
            <FootballHelmet
              primary={teamMetadata?.colors?.primary || "#666666"}
              secondary={teamMetadata?.colors?.secondary || "#333333"}
              size={80}
              direction={isHome ? "right" : "left"}
            />
          </div>
        </div>
      </div>
      <h3 className="font-bold text-xs sm:text-base text-center leading-tight">
        {teamName}
      </h3>
    </div>
  );
}
