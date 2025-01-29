"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { completeQuest } from "@/lib/api/quests";
import { QuestResponse } from "@renegade-fanclub/types";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faTrophy, faFootball } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface QuestCardProps {
  quest: QuestResponse;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function QuestCard({ quest, onComplete, isCompleted }: QuestCardProps) {
  const { toast } = useToast();
  const verificationData = quest.verificationData as {
    platform?: string;
    action?: string;
    intent_url?: string;
    game_id?: number;
    game_link?: string;
    game_type?: string;
  };

  const handleQuestComplete = useCallback(async () => {
    try {
      await completeQuest(quest.id, { verificationProof: {} });
      toast({
        title: "Quest Completed!",
        description: `You earned ${quest.pointsValue} points!`,
      });
      onComplete?.();
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      // If error includes specific messages, show appropriate message
      if (errorMessage.includes("already completed")) {
        toast({
          title: "Already Completed",
          description: "You've already completed this quest!",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage.includes("not active")
            ? "This quest is not currently active"
            : errorMessage.includes("Campaign is not active")
            ? "This campaign is not currently active"
            : "Failed to complete quest. Please try again.",
        });
      }
    }
  }, [quest.id, quest.pointsValue, onComplete, toast]);

  const handleSocialFollow = useCallback(async () => {
    // Complete quest when social follow button is clicked
    await handleQuestComplete();
    // Open social link in new tab
    if (verificationData.intent_url) {
      window.open(verificationData.intent_url, "_blank");
    }
  }, [handleQuestComplete, verificationData.intent_url]);

  return (
    <Card className="w-full overflow-hidden px-5 pt-6 pb-4 md:px-5 md:pb-2 md:pt-6 flex flex-col justify-between">
      <div className="flex flex-col items-start justify-start gap-2 flex-grow">
        <div
          title={`You will earn ${quest.pointsValue} points for completing this quest`}
          className="flex items-center space-x-1"
        >
          <FontAwesomeIcon
            icon={faTrophy}
            className="h-5 w-5 text-yellow-500"
          />
          <span className="font-medium text-lg">{quest.pointsValue}</span>
        </div>
        <div className="flex flex-col gap-1.5 sm:gap-2 pt-2">
          <CardTitle className="text-white/70 text-xs sm:text-sm leading-tight font-thin">
            {quest.name}
          </CardTitle>
          <CardDescription className="text-xs text-white/70 sm:text-sm leading-tight font-thin line-clamp-2 sm:line-clamp-none">
            {quest.description}
          </CardDescription>
        </div>
      </div>

      <CardContent className="pt-4">
        <div className="flex flex-col">
          {/* Quest-specific actions */}
          {quest.verificationType === "social_follow" &&
            verificationData.platform === "twitter" && (
              <button
                onClick={handleSocialFollow}
                disabled={isCompleted}
                className={`flex items-center justify-center space-x-2 h-9 w-28 text-sm px-5 py-2 rounded-full mt-auto ${
                  isCompleted
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-white text-purple-900 hover:bg-gray-200"
                }`}
              >
                <FontAwesomeIcon icon={faXTwitter} />
                <span>Follow</span>
              </button>
            )}

          {quest.verificationType === "prediction" &&
            verificationData.game_link && (
              <Button
                asChild
                className={`flex items-center space-x-1 text-sm px-5 py-2 h-9 w-28 mt-auto ${
                  isCompleted ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isCompleted}
              >
                <Link
                  href={verificationData.game_link}
                  className="w-full sm:w-auto"
                >
                  <FontAwesomeIcon icon={faFootball} />
                  <span>Predict</span>
                </Link>
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
