import {
  type TeamFansPageResponse,
  type TeamResponse,
} from "@renegade-fanclub/types";
import { type ApiOptions, apiRequest } from "./types";

export async function listTeams(options?: ApiOptions): Promise<TeamResponse[]> {
  return apiRequest("/teams", { options, requiresAuth: false });
}

export async function getTeam(
  teamId: number,
  options?: ApiOptions,
): Promise<TeamResponse> {
  return apiRequest(`/teams/${teamId}`, { options, requiresAuth: false });
}

export async function getTeamFans(
  teamId: number,
  page: number = 1,
  limit: number = 20,
  options?: ApiOptions,
): Promise<TeamFansPageResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiRequest(`/teams/${teamId}/fans?${params}`, { options });
}
