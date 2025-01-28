"use client";

import { type GameResponse } from "@renegade-fanclub/types";
import FootballHelmet from "@/components/football-helmet";

interface TeamCardProps {
  teamName: string;
  teamMetadata:
    | GameResponse["homeTeamMetadata"]
    | GameResponse["awayTeamMetadata"];
  isHome: boolean;
}

export function TeamCard({ teamName, teamMetadata, isHome }: TeamCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 w-[160px] sm:w-[180px]">
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
