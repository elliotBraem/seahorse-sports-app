"use client";

import { Card } from "@/components/ui/card";
import { type PredictionResponse } from "@renegade-fanclub/types";

export function GamePredictionsList({ predictions }: { predictions: PredictionResponse[] }) {
  if (!predictions.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No predictions yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction) => (
        <Card key={prediction.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">User {prediction.userId}</p>
              <p className="text-sm text-gray-500">
                Predicted: {prediction.predictedWinnerName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {new Date(prediction.createdAt).toLocaleDateString()}
              </p>
              {prediction.pointsEarned !== null && (
                <p className="text-sm font-medium">
                  Points: {prediction.pointsEarned}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
