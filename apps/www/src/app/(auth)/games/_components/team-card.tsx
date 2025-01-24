"use client";

import { type GameResponse } from "@renegade-fanclub/types";

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
      className="flex-1 p-4 rounded-lg"
      style={{
        background: teamMetadata?.colors?.primary || "#666666",
        color: "#FFFFFF",
        boxShadow: `0 4px 6px -1px ${teamMetadata?.colors?.primary || "#666666"}33`,
        textAlign: isHome ? "left" : "right",
      }}
    >
      <h3 className="font-bold text-lg">{teamName}</h3>
      <p className="text-sm opacity-80">{isHome ? "Home Team" : "Away Team"}</p>
    </div>
  );
}
