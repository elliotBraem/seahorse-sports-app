"use client";

import { useCreatePrediction } from "@/lib/hooks/use-games";
import { useQueryClient } from "@tanstack/react-query";
import { completeQuest } from "@/lib/api/quests";
import { type GameResponse, type QuestResponse } from "@renegade-fanclub/types";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface GamePredictionFormProps {
  game: GameResponse;
  predictionQuest?: QuestResponse;
}

export function GamePredictionForm({ game, predictionQuest }: GamePredictionFormProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const { mutate: createPrediction, isPending: submitting } = useCreatePrediction();
  const queryClient = useQueryClient();

  // Ensure metadata is properly structured with fallbacks
  const homeTeamColor = game.homeTeamMetadata?.colors?.primary || "#666666";
  const awayTeamColor = game.awayTeamMetadata?.colors?.primary || "#666666";

  const handlePredict = () => {
    if (!selectedTeamId) return;

    createPrediction(
      {
        gameId: game.id,
        predictedWinnerId: selectedTeamId,
      },
      {
        onSuccess: async () => {
          toast.success("Prediction submitted successfully!");
          setSelectedTeamId(null);

          // Complete prediction quest if it exists
          if (predictionQuest) {
            try {
              await completeQuest(predictionQuest.id, { verificationProof: {} });
              toast.success(`Quest completed! You earned ${predictionQuest.pointsValue} points!`);
              // Invalidate the user profile query to refresh points
              queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            } catch (error: any) {
              // Ignore already completed quest errors
              if (!error?.message?.includes("already completed")) {
                console.error("Failed to complete quest:", error);
              }
            }
          }
        },
        onError: (error) => {
          toast.error("Failed to submit prediction. Please try again.");
          console.error("Failed to submit prediction:", error);
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        <button
          className={`px-6 py-3 rounded-lg transition-all ${
            selectedTeamId === game.homeTeamId
              ? "text-white"
              : "text-gray-700 border-2"
          }`}
          style={{
            background:
              selectedTeamId === game.homeTeamId
                ? homeTeamColor
                : "transparent",
            borderColor: homeTeamColor,
          }}
          onClick={() => setSelectedTeamId(game.homeTeamId)}
        >
          <span className="font-bold">{game.homeTeamName} Wins</span>
        </button>
        <button
          className={`px-6 py-3 rounded-lg transition-all ${
            selectedTeamId === game.awayTeamId
              ? "text-white"
              : "text-gray-700 border-2"
          }`}
          style={{
            background:
              selectedTeamId === game.awayTeamId
                ? awayTeamColor
                : "transparent",
            borderColor: awayTeamColor,
          }}
          onClick={() => setSelectedTeamId(game.awayTeamId)}
        >
          <span className="font-bold">{game.awayTeamName} Wins</span>
        </button>
      </div>

      {selectedTeamId && (
        <button
          className="w-full px-6 py-3 rounded-lg text-white font-bold transition-all disabled:opacity-50"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(45,45,45,0.9) 100%)",
          }}
          onClick={handlePredict}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Prediction"}
        </button>
      )}
    </div>
  );
}
