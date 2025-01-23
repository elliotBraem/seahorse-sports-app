"use client";

import { Card } from "@/components/ui/card";
import { type GameResponse } from "@renegade-fanclub/types";
import Link from "next/link";

export function GamesList({ games }: { games: GameResponse[] }) {
  if (!games.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No current games available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <Link key={game.id} href={`/games/${game.id}`}>
          <Card className="p-6 hover:bg-accent transition-colors">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-semibold">{game.homeTeamName}</h3>
                <p className="text-sm text-gray-500">Home Team</p>
              </div>
              <div className="text-center px-4">
                <span className="text-lg font-bold">VS</span>
                <p className="text-sm text-gray-500">
                  {new Date(game.startTime).toLocaleDateString()}
                </p>
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-semibold">{game.awayTeamName}</h3>
                <p className="text-sm text-gray-500">Away Team</p>
              </div>
            </div>

            <div className="text-sm text-gray-500 text-center mt-4">
              {game.status === "completed" ? (
                <span>
                  Winner: {game.winnerTeamId === game.homeTeamId 
                    ? game.homeTeamName 
                    : game.awayTeamName}
                </span>
              ) : (
                <span>Points Value: {game.pointsValue}</span>
              )}
            </div>
          </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
