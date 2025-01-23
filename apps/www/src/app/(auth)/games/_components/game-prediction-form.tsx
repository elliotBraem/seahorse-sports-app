"use client";

import { Button } from "@/components/ui/button";
import { createPrediction } from "@/lib/api/games";
import { useAuth } from "@/lib/hooks/use-auth";
import { type GameResponse } from "@renegade-fanclub/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function GamePredictionForm({ game }: { game: GameResponse }) {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePredict = async () => {
    if (!user || !selectedTeamId) return;

    setSubmitting(true);
    try {
      await createPrediction(game.id, {
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

  if (!user) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <p className="text-sm text-gray-500">
          Please log in to make predictions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        <Button
          variant={selectedTeamId === game.homeTeamId ? "default" : "outline"}
          onClick={() => setSelectedTeamId(game.homeTeamId)}
        >
          {game.homeTeamName} Wins
        </Button>
        <Button
          variant={selectedTeamId === game.awayTeamId ? "default" : "outline"}
          onClick={() => setSelectedTeamId(game.awayTeamId)}
        >
          {game.awayTeamName} Wins
        </Button>
      </div>
      
      {selectedTeamId && (
        <Button
          className="w-full"
          onClick={handlePredict}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Prediction"}
        </Button>
      )}
    </div>
  );
}
