"use client";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useGame } from "@/lib/hooks/use-games";
import { type GameResponse } from "@renegade-fanclub/types";
import { GamePredictionForm } from "../../_components/game-prediction-form";
import { GamePredictions } from "../../_components/game-predictions";
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
            <div className="flex justify-between items-center">
              <TeamCard
                teamName={currentGame.homeTeamName}
                teamMetadata={currentGame.homeTeamMetadata}
                isHome={true}
              />

              <div className="text-center px-6 py-2">
                <span className="text-2xl font-black bg-gray-900 text-white px-4 py-2 rounded-full">
                  VS
                </span>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(currentGame.startTime).toLocaleDateString()}
                </p>
              </div>

              <TeamCard
                teamName={currentGame.awayTeamName}
                teamMetadata={currentGame.awayTeamMetadata}
                isHome={false}
              />
            </div>

            <div className="text-center space-y-2">
              {typeof currentGame.apiMetadata === "object" &&
                currentGame.apiMetadata !== null &&
                "location" in currentGame.apiMetadata && (
                  <p className="text-sm text-gray-400">
                    {currentGame.apiMetadata.location as string}
                  </p>
                )}
              {typeof currentGame.apiMetadata === "object" &&
                currentGame.apiMetadata !== null &&
                "conference" in currentGame.apiMetadata && (
                  <p className="text-xs font-semibold text-gray-400">
                    {currentGame.apiMetadata.conference as string} Championship
                  </p>
                )}
              {currentGame.status === "completed" ? (
                <div className="bg-gray-100 rounded-full px-4 py-2 inline-block">
                  <span className="font-semibold">
                    Winner:{" "}
                    {currentGame.winnerTeamId === currentGame.homeTeamId
                      ? currentGame.homeTeamName
                      : currentGame.awayTeamName}
                  </span>
                </div>
              ) : (
                <div
                  className="bg-gray-900 text-white rounded-full px-6 py-2 inline-block mt-2"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(45,45,45,0.9) 100%)",
                  }}
                >
                  <span className="font-bold">
                    {currentGame.pointsValue} Points
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {currentGame.status === "upcoming" && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Make Your Prediction</h2>
            <GamePredictionForm game={currentGame} />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">Predictions</h2>
          <GamePredictions gameId={gameId} />
        </div>
      </div>
    </Container>
  );
}
