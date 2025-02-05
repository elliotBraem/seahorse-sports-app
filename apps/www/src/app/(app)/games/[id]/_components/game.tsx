"use client";

import Poll from "@/app/(app)/games/_components/poll";
import { TeamCard } from "@/app/(app)/games/_components/team-card";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreatePrediction,
  useGame,
  useCurrentUserGamePrediction,
  useGamePredictions,
} from "@/lib/hooks/use-games";
import { listQuests, completeQuest } from "@/lib/api/quests";
import { type GameResponse, type QuestResponse } from "@renegade-fanclub/types";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { Skeleton } from "@/components/ui/skeleton";

interface GameProps {
  gameId: number;
  initialGame: GameResponse;
  predictionQuest?: QuestResponse;
}

export function Game({ gameId, initialGame, predictionQuest }: GameProps) {
  const { data: game, isLoading: gameLoading } = useGame(gameId);
  const { user: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: userPrediction, isLoading: userPredictionLoading } =
    useCurrentUserGamePrediction(gameId);
  const { data: predictions = [], isLoading: predictionsLoading } =
    useGamePredictions(gameId);
  const queryClient = useQueryClient();
  const currentGame = game || initialGame;
  const [localPrediction, setLocalPrediction] = useState<number | null>(null);
  const [isSubmitting, setisSubmitting] = useState(false);

  // Update localPrediction when userPrediction changes or initially loads
  useEffect(() => {
    if (
      !userPredictionLoading &&
      userPrediction?.predictedWinnerId !== undefined // Avoid updating while loading
    ) {
      setLocalPrediction(userPrediction.predictedWinnerId);
    }
  }, [userPrediction, userPredictionLoading]);

  const { toast } = useToast();
  const { mutate: createPrediction, isPending: submitting } =
    useCreatePrediction();

  const debouncedCreatePrediction = useRef(
    debounce((teamId: number) => {
      createPrediction(
        {
          gameId,
          predictedWinnerId: teamId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Prediction updated successfully!",
            });
            // Invalidate both the user's prediction and all predictions for this game
            queryClient.invalidateQueries({
              queryKey: ["game-prediction", gameId],
            });
            queryClient.invalidateQueries({
              queryKey: ["game-predictions", gameId],
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
                : "Failed to update prediction. Please try again.",
            });
            console.error("Failed to update prediction:", error);
          },
        },
      );
    }, 5000),
  ).current;

  const currentPrediction = useMemo(
    () => (localPrediction ? { predictedWinnerId: localPrediction } : null),
    [localPrediction],
  );

  const handleVote = useCallback(
    async (teamId: number, teamTitle: string) => {
      if (currentGame.status === "completed") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Cannot make predictions for completed games",
        });
        return;
      }

      setisSubmitting(true);
      const gameStartTime = new Date(currentGame.startTime);
      const currentTime = new Date();

      if (currentTime > gameStartTime) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Cannot change predictions after the game has started",
        });
        return;
      }

      if (!currentUser || !currentUser.issuer) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to make predictions",
        });
        return;
      }

      // Update local state immediately for quick UI feedback
      setLocalPrediction(teamId);

      // Use debounced prediction update
      debouncedCreatePrediction(teamId);

      // If this is the first prediction and there's a quest, handle it with optimistic update
      if (!userPrediction && predictionQuest) {
        try {
          // Optimistically update points
          const currentPoints =
            queryClient.getQueryData<number>(["user-points"]) ?? 0;
          queryClient.setQueryData(
            ["user-points"],
            currentPoints + predictionQuest.pointsValue,
          );

          // Complete the quest
          await completeQuest(predictionQuest.id, { verificationProof: {} });

          // Invalidate queries to get fresh data
          queryClient.invalidateQueries({ queryKey: ["quests"] });
          queryClient.invalidateQueries({ queryKey: ["user-points"] });

          toast({
            title: "Quest Completed!",
            description: `You earned ${predictionQuest.pointsValue} points!`,
          });
          // Invalidate the user profile query to refresh points
          queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        } catch (error: any) {
          // On error, revert the optimistic update
          const currentPoints =
            queryClient.getQueryData<number>(["user-points"]) ?? 0;
          queryClient.setQueryData(
            ["user-points"],
            currentPoints - predictionQuest.pointsValue,
          );

          // Ignore already completed quest errors
          if (!error?.message?.includes("already completed")) {
            console.error("Failed to complete quest:", error);
          }
        }
      }

      // If not already submitting, submit immediately
      if (!submitting) {
        debouncedCreatePrediction.cancel(); // Cancel any pending debounced updates
        createPrediction(
          {
            gameId,
            predictedWinnerId: teamId,
          },
          {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Prediction submitted successfully!",
              });
              // Invalidate both the user's prediction and all predictions for this game
              queryClient.invalidateQueries({
                queryKey: ["game-prediction", gameId],
              });
              queryClient.invalidateQueries({
                queryKey: ["game-predictions", gameId],
              });
            },
            onError: (error) => {
              // Revert local state on error
              setLocalPrediction(null);
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
      }
      setisSubmitting(false);
    },
    [
      gameId,
      currentGame,
      submitting,
      createPrediction,
      debouncedCreatePrediction,
      toast,
      currentUser,
      predictionQuest,
      userPrediction,
    ],
  );

  // Show loading state when game data or user prediction is loading
  // if ((gameLoading && !initialGame) || userPredictionLoading) {
  //   return (
  //     <>
  //       <h3 className="text-2xl py-4 font-bold text-center">Who Will Win?</h3>
  //       <div className="flex items-center justify-evenly py-8">
  //         <Skeleton className="bg-white/10 h-32 w-44 rounded-xl" />
  //         <Skeleton className="bg-white/10 h-32 w-44 rounded-xl" />
  //       </div>
  //       <Skeleton className="bg-white/10 h-12 w-full rounded-xl" />
  //     </>
  //   );
  // }

  return (
    <>
      <h3 className="text-2xl py-4 font-bold text-center">Who Will Win?</h3>
      {(gameLoading && !initialGame) ||
      userPredictionLoading ||
      !currentUser ? (
        <>
          <div className="flex items-center justify-evenly py-8">
            <Skeleton className="bg-white/10 h-32 w-44 rounded-xl" />
            <Skeleton className="bg-white/10 h-32 w-44 rounded-xl" />
          </div>
          <Skeleton className="bg-white/10 h-12 w-full rounded-xl" />
        </>
      ) : (
        <>
          <div className={`flex flex-col `}>
            {typeof currentGame.apiMetadata === "object" &&
              currentGame.apiMetadata !== null &&
              "conference" in currentGame.apiMetadata && (
                <div className="text-center my-4">
                  <h2 className="text-2xl font-bold">
                    {currentGame.apiMetadata.conference as string} Championship
                  </h2>
                  <p className="text-base font-medium text-white mt-2">
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
          {/* Show loading state when game data or user prediction is loading */}

          <div
            className={`flex justify-center gap-8 mb-8 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <motion.div
              animate={{
                scale:
                  currentPrediction?.predictedWinnerId ===
                  currentGame.homeTeamId
                    ? 1.02
                    : 1,
                filter:
                  currentPrediction?.predictedWinnerId ===
                  currentGame.homeTeamId
                    ? "brightness(1.2) drop-shadow(0 0 15px rgba(74, 222, 128, 0.4))"
                    : currentPrediction?.predictedWinnerId ===
                        currentGame.awayTeamId
                      ? "brightness(0.8)"
                      : "brightness(1)",
              }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <TeamCard
                teamName={currentGame.homeTeamName}
                teamMetadata={currentGame.homeTeamMetadata}
                isHome={true}
                selected={
                  currentPrediction?.predictedWinnerId ===
                  currentGame.homeTeamId
                }
                onClick={() =>
                  handleVote(currentGame.homeTeamId, currentGame.homeTeamName)
                }
              />
            </motion.div>
            <motion.div
              animate={{
                scale:
                  currentPrediction?.predictedWinnerId ===
                  currentGame.awayTeamId
                    ? 1.02
                    : 1,
                filter:
                  currentPrediction?.predictedWinnerId ===
                  currentGame.awayTeamId
                    ? "brightness(1.2) drop-shadow(0 0 15px rgba(74, 222, 128, 0.4))"
                    : currentPrediction?.predictedWinnerId ===
                        currentGame.homeTeamId
                      ? "brightness(0.8)"
                      : "brightness(1)",
              }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <TeamCard
                teamName={currentGame.awayTeamName}
                teamMetadata={currentGame.awayTeamMetadata}
                isHome={false}
                selected={
                  currentPrediction?.predictedWinnerId ===
                  currentGame.awayTeamId
                }
                onClick={() =>
                  handleVote(currentGame.awayTeamId, currentGame.awayTeamName)
                }
              />
            </motion.div>
          </div>
          {currentPrediction !== null && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              {new Date() < new Date(currentGame.startTime) && (
                <p className="text-sm text-gray-400 mt-2">
                  You can change your prediction until the game starts.
                </p>
              )}
            </motion.div>
          )}
          <div className="pt-8">
            <Poll
              game={currentGame}
              selectedTeamId={localPrediction}
              predictions={predictions}
            />
          </div>
        </>
      )}
    </>
  );
}
