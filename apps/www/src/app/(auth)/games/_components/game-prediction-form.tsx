"use client";

import { createPrediction } from "@/lib/api/games";
import { type GameResponse } from "@renegade-fanclub/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function GamePredictionForm({ game }: { game: GameResponse }) {
  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Ensure metadata is properly structured with fallbacks
  const homeTeamColor = game.homeTeamMetadata?.colors?.primary || "#666666";
  const awayTeamColor = game.awayTeamMetadata?.colors?.primary || "#666666";

  const handlePredict = async () => {
    if (!selectedTeamId) return;

    setSubmitting(true);
    try {
      await createPrediction({
        gameId: game.id,
        predictedWinnerId: selectedTeamId,
      });
      router.refresh(); // Refresh the page to show the new prediction
    } catch (error) {
      console.error("Failed to submit prediction:", error);
    } finally {
      setSubmitting(false);
    }
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
