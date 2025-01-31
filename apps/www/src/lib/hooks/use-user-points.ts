import { useQuery } from "@tanstack/react-query";
import { getUserQuests } from "../api/quests";

export function useUserPoints() {
  return useQuery({
    queryKey: ["user-points"],
    queryFn: async () => {
      const completedQuests = await getUserQuests();
      return completedQuests.reduce(
        (sum, quest) => sum + quest.pointsEarned,
        0,
      );
    },
    staleTime: 0, // Always refetch when invalidated
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
