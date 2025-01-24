"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import { type PredictionResponse } from "@renegade-fanclub/types";

function PredictionCard({ prediction }: { prediction: PredictionResponse }) {
  const { data: userProfile } = useUserProfile(prediction.userId);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userProfile?.avatar ?? undefined} />
          <AvatarFallback>
            {(userProfile?.username ?? prediction.userId).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">
            {userProfile?.username ?? prediction.userId}
          </p>
          <p className="text-sm text-gray-500">
            Predicted: {prediction.predictedWinnerName}
          </p>
        </div>
        {prediction.pointsEarned !== null && (
          <div className="text-sm font-medium">
            Points: {prediction.pointsEarned}
          </div>
        )}
      </div>
    </Card>
  );
}

export function GamePredictionsList({
  predictions,
}: {
  predictions: PredictionResponse[];
}) {
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
        <PredictionCard key={prediction.id} prediction={prediction} />
      ))}
    </div>
  );
}
