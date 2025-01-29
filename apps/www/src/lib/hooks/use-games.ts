import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listGames,
  getGame,
  getGamePredictions,
  createPrediction,
  getCurrentUserGamePrediction,
} from "@/lib/api/games";
import type {
  CreatePredictionRequest,
  GameResponse,
} from "@renegade-fanclub/types";

export function useGames(initialData?: GameResponse[]) {
  return useQuery({
    queryKey: ["games"],
    queryFn: () => listGames(),
    initialData,
    staleTime: 30 * 1000,
  });
}

export function useGame(gameId: number) {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: () => getGame(gameId),
  });
}

export function useGamePredictions(gameId: number) {
  return useQuery({
    queryKey: ["game-predictions", gameId],
    queryFn: () => getGamePredictions(gameId),
  });
}

export function useCreatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePredictionRequest) => createPrediction(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["game-predictions", variables.gameId],
      });
      queryClient.invalidateQueries({
        queryKey: ["current-user-game-prediction", variables.gameId],
      });
    },
  });
}

export function useCurrentUserGamePrediction(gameId: number) {
  return useQuery({
    queryKey: ["current-user-game-prediction", gameId],
    queryFn: () => getCurrentUserGamePrediction(gameId),
  });
}
