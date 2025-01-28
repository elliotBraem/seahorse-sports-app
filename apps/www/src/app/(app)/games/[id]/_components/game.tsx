"use client";

import Poll from "@/app/(app)/games/_components/poll";
import { TeamCard } from "@/app/(app)/games/_components/team-card";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  useCreatePrediction,
  useGame,
  useGamePredictions,
} from "@/lib/hooks/use-games";
import {
  type GameResponse,
  type PredictionResponse,
} from "@renegade-fanclub/types";
import { useState, useMemo } from "react";

interface GameProps {
  gameId: number;
  initialGame: GameResponse;
}

export function Game({ gameId, initialGame }: GameProps) {
  const { data: game, isLoading: gameLoading } = useGame(gameId);
  const { data: predictions, isLoading: predictionsLoading } =
    useGamePredictions(gameId);
  const currentGame = game || initialGame;
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const { toast } = useToast();
  const { mutate: createPrediction, isPending: submitting } =
    useCreatePrediction();

  const existingPrediction = useMemo(() => {
    // Make sure we only get predictions for this specific game
    const gamePrediction = predictions?.find((p) => p.gameId === gameId);
    console.log("Game prediction for game", gameId, ":", gamePrediction);
    return gamePrediction;
  }, [predictions, gameId]);

  const handleVote = (teamId: number, teamTitle: string) => {
    if (currentGame.status === "completed") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot make predictions for completed games",
      });
      return;
    }

    if (existingPrediction) {
      const existingTeam =
        existingPrediction.predictedWinnerId === currentGame.homeTeamId
          ? currentGame.homeTeamName
          : currentGame.awayTeamName;

      toast({
        variant: "destructive",
        title: "Warning",
        description: `You have already predicted ${existingTeam} will win this game`,
      });
      return;
    }

    if (submitting) {
      console.log("Submission in progress, returning early");
      return;
    }

    createPrediction(
      {
        gameId,
        predictedWinnerId: teamId,
      },
      {
        onSuccess: () => {
          setSelectedTeamId(teamId);
          toast({
            title: "Success",
            description: "Prediction submitted successfully!",
          });
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage.includes("UNAUTHORIZED")
              ? "Please sign in to make predictions"
              : "Failed to submit prediction. Please try again.",
          });
          console.error("Failed to submit prediction:", error);
        },
      },
    );
  };

  if ((gameLoading || predictionsLoading) && !initialGame) {
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
      <div className="flex flex-col">
        {typeof currentGame.apiMetadata === "object" &&
          currentGame.apiMetadata !== null &&
          "conference" in currentGame.apiMetadata && (
            <div className="text-center my-4">
              <h2 className="text-2xl font-bold">
                {currentGame.apiMetadata.conference as string} Championship
              </h2>
              <p className="text-base font-medium text-white mt-2">
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
      <h3 className="text-2xl py-4 font-bold text-center">Who Will Win?</h3>
      <div className="flex justify-center gap-8 mb-8">
        <TeamCard
          teamName={currentGame.homeTeamName}
          teamMetadata={currentGame.homeTeamMetadata}
          isHome={true}
          selected={
            existingPrediction?.predictedWinnerId === currentGame.homeTeamId
          }
          onClick={() =>
            handleVote(currentGame.homeTeamId, currentGame.homeTeamName)
          }
        />
        <TeamCard
          teamName={currentGame.awayTeamName}
          teamMetadata={currentGame.awayTeamMetadata}
          isHome={false}
          selected={
            existingPrediction?.predictedWinnerId === currentGame.awayTeamId
          }
          onClick={() =>
            handleVote(currentGame.awayTeamId, currentGame.awayTeamName)
          }
        />
      </div>
      <div className="pt-8">
        <Poll game={currentGame} />
      </div>
    </>
  );
}
