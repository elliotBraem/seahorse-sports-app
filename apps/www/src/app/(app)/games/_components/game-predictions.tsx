"use client";

import { useGamePredictions } from "@/lib/hooks/use-games";
import { GamePredictionsList } from "./game-predictions-list";

export function GamePredictions({ gameId }: { gameId: number }) {
  const { data: predictions, isLoading } = useGamePredictions(gameId);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return <GamePredictionsList predictions={predictions || []} />;
}
