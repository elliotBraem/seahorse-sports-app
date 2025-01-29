"use client";

import { QuestCard } from "./quest-card";
import {
  QuestResponse,
  QuestCompletionResponse,
} from "@renegade-fanclub/types";
import { useQueryClient } from "@tanstack/react-query";

interface QuestsListProps {
  quests: QuestResponse[];
  completedQuests: QuestCompletionResponse[];
}

export function QuestsList({ quests, completedQuests }: QuestsListProps) {
  const queryClient = useQueryClient();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {quests.map((quest) => {
        const isCompleted = completedQuests.some(
          (completed) => completed.questId === quest.id,
        );
        return (
          <QuestCard
            key={quest.id}
            quest={quest}
            isCompleted={isCompleted}
            onComplete={() => {
              // Invalidate quests and user points data
              queryClient.invalidateQueries({ queryKey: ["quests"] });
              queryClient.invalidateQueries({ queryKey: ["user-points"] });
            }}
          />
        );
      })}
    </div>
  );
}
