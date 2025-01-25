"use client";

import Poll from "@/app/(app)/games/_components/poll";
import { TeamCard } from "@/app/(app)/games/_components/team-card";
import { Card } from "@/components/ui/card";
import { useGame } from "@/lib/hooks/use-games";
import { type GameResponse } from "@renegade-fanclub/types";

interface GameProps {
  gameId: number;
  initialGame: GameResponse;
}

export function Game({ gameId, initialGame }: GameProps) {
  const { data: game, isLoading } = useGame(gameId);
  const currentGame = game || initialGame;

  if (isLoading && !initialGame) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <Card className="p-6 mb-8">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </Card>
          <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center gap-8 mb-8">
        <TeamCard
          teamName={currentGame.homeTeamName}
          teamMetadata={currentGame.homeTeamMetadata}
          isHome={true}
        />
        <TeamCard
          teamName={currentGame.awayTeamName}
          teamMetadata={currentGame.awayTeamMetadata}
          isHome={false}
        />
      </div>
      <div className="flex flex-col">
        {typeof currentGame.apiMetadata === "object" &&
          currentGame.apiMetadata !== null &&
          "conference" in currentGame.apiMetadata && (
            <div className="text-center my-4">
              <h2 className="text-2xl font-bold">
                {currentGame.apiMetadata.conference as string} Championship
              </h2>
              <p className="text-md font-medium text-gray-300 mt-2">
                {new Date(currentGame.startTime).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

        {currentGame.status === "completed" && (
          <div className="text-center my-8">
            <div className="bg-gray-100 rounded-full px-6 py-3 inline-block">
              <span className="font-semibold text-lg">
                Winner:{" "}
                {currentGame.winnerTeamId === currentGame.homeTeamId
                  ? currentGame.homeTeamName
                  : currentGame.awayTeamName}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8">
        <Poll game={currentGame} />
      </div>
    </>
  );
}
