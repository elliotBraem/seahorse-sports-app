"use client";

import { Card } from "@/components/ui/card";
import { useGamePredictions } from "@/lib/hooks/use-games";
import { GameResponse } from "@renegade-fanclub/types";

interface PollProps {
  game: GameResponse;
  selectedTeamId?: number | null;
}

export default function Poll({ game, selectedTeamId }: PollProps) {
  const {
    id: gameId,
    homeTeamId,
    awayTeamId,
    homeTeamName,
    awayTeamName,
    homeTeamMetadata,
    awayTeamMetadata,
  } = game;
  const { data: predictions = [] } = useGamePredictions(gameId);

  // Calculate votes for each team, including the local prediction
  const homeTeamVotes = predictions.filter(
    (p) => p.predictedWinnerId === homeTeamId,
  ).length + (selectedTeamId === homeTeamId ? 1 : 0);
  const awayTeamVotes = predictions.filter(
    (p) => p.predictedWinnerId === awayTeamId,
  ).length + (selectedTeamId === awayTeamId ? 1 : 0);
  const totalVotes = homeTeamVotes + awayTeamVotes;

  // Calculate percentage widths
  const homeTeamWidth =
    totalVotes === 0 ? 50 : (homeTeamVotes / totalVotes) * 100;
  const awayTeamWidth =
    totalVotes === 0 ? 50 : (awayTeamVotes / totalVotes) * 100;

  const teams = [
    {
      id: homeTeamId,
      title: homeTeamName,
      color: homeTeamMetadata?.colors?.primary || "#666666",
      votes: homeTeamVotes,
    },
    {
      id: awayTeamId,
      title: awayTeamName,
      color: awayTeamMetadata?.colors?.primary || "#666666",
      votes: awayTeamVotes,
    },
  ];

  // Removed handleVote since it's now handled in the parent Game component

  return (
    <div className="">
      {/* Dynamic Bar */}
      <div className="relative bg-gray-200 rounded-lg h-12 transition-all overflow-hidden flex items-center">
        <div
          className="h-full transition-all"
          style={{
            width: `${homeTeamWidth}%`,
            backgroundColor: `${teams[0].color}`,
          }}
        ></div>

        {/* VS Sign on Bar */}
        <div
          className="absolute top-0 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border-2 border-gray-300 text-lg font-extrabold text-red-500"
          style={{
            left: `calc(${homeTeamWidth}% - 24px)`,
          }}
        >
          VS
        </div>

        <div
          className="h-full transition-all"
          style={{
            width: `${awayTeamWidth}%`,
            backgroundColor: `${teams[1].color}`,
          }}
        ></div>
      </div>

      {/* Vote counts display */}
      <div className="flex justify-between mt-4 px-4">
        <div className="text-center">
          <p className="text-lg font-bold">{homeTeamVotes} votes</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{awayTeamVotes} votes</p>
        </div>
      </div>
    </div>
  );
}
