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
    <div
      className="flex flex-col items-center gap-2"
      style={{ width: "200px", height: "180px" }}
    >
      <div
        style={{
          filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))",
        }}
      >
        <FootballHelmet
          primary={teamMetadata?.colors?.primary || "#666666"}
          secondary={teamMetadata?.colors?.secondary || "#333333"}
          size={120}
          direction={isHome ? "right" : "left"}
        />
      </div>
      <div
        className="w-full"
        style={{
          textAlign: "center",
        }}
      >
        <h3 className="font-bold text-lg">{teamName}</h3>
      </div>
    </div>
  );
}
