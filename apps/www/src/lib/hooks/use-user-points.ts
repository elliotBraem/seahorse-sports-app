import { useQuery } from "@tanstack/react-query";
import { getUserPoints } from "../api/user";

export function useUserPoints() {
  return useQuery({
    queryKey: ["user-points"],
    queryFn: async () => {
      const { points } = await getUserPoints();
      return points;
    },
  });
}
