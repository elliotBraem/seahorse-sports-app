"use client";

import Poll from "@/app/(auth)/games/_components/poll";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useGame } from "@/lib/hooks/use-games";
import { type GameResponse } from "@renegade-fanclub/types";
import { TeamCard } from "../../_components/team-card";

interface GameProps {
  gameId: number;
  initialGame: GameResponse;
}

export function Game({ gameId, initialGame }: GameProps) {
  const { data: game, isLoading } = useGame(gameId);
  const currentGame = game || initialGame;

  if (isLoading && !initialGame) {
    return (
      <Container>
        <div className="container py-8">
          <div className="animate-pulse">
            <Card className="p-6 mb-8">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </Card>
            <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="container py-8">
        <Card className="p-6 mb-8">
          <div className="flex flex-col gap-6">
            {typeof currentGame.apiMetadata === "object" &&
              currentGame.apiMetadata !== null &&
              "conference" in currentGame.apiMetadata && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold">
                    {currentGame.apiMetadata.conference as string} Championship
                  </h2>
                  {typeof currentGame.apiMetadata.location === "string" && (
                    <p className="text-md text-gray-200 mt-1">
                      {currentGame.apiMetadata.location}
                    </p>
                  )}
                  <p className="text-md font-medium text-gray-300 mt-2">
                    {new Date(currentGame.startTime).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              )}

            {currentGame.status === "completed" && (
              <div className="text-center">
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
        </Card>

        <div className="space-y-8">
          <Poll game={currentGame} />
        </div>
      </div>
    </Container>
  );
}
