import { useQuery } from "@tanstack/react-query";
import { getUserPoints } from "../api/user";

export function useUserPoints(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ["user-points"],
    queryFn: async () => {
      const { points } = await getUserPoints();
      return points;
    },
    // Refetch every 5 seconds by default when games are active
    refetchInterval: options?.refetchInterval ?? 5000,
    // Don't refetch when window is hidden
    refetchIntervalInBackground: false,
  });
}
