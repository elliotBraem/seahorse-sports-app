import {
  type AddFavoriteTeamRequest,
  type AddSocialAccountRequest,
  type CreateProfileRequest,
  type PredictionResponse,
  type ProfileResponse,
  type SocialAccountResponse,
  type UpdateProfileRequest,
} from "@renegade-fanclub/types";
import { type ApiOptions, apiRequest } from "./types";

export async function createUserProfile(
  data: CreateProfileRequest,
  options?: ApiOptions,
): Promise<ProfileResponse> {
  return apiRequest("/user/profile", {
    method: "POST",
    body: data,
    options,
  });
}

export async function getUserProfile(
  options?: ApiOptions,
): Promise<ProfileResponse> {
  return apiRequest("/user/profile", { options });
}

export async function updateUserProfile(
  data: UpdateProfileRequest,
  options?: ApiOptions,
): Promise<ProfileResponse> {
  return apiRequest("/user/profile", {
    method: "PATCH",
    body: data,
    options,
  });
}

export async function addFavoriteTeam(
  data: AddFavoriteTeamRequest,
  options?: ApiOptions,
): Promise<ProfileResponse> {
  return apiRequest("/user/favorites/teams", {
    method: "POST",
    body: data,
    options,
  });
}

export async function removeFavoriteTeam(
  teamId: number,
  options?: ApiOptions,
): Promise<ProfileResponse> {
  return apiRequest(`/user/favorites/teams/${teamId}`, {
    method: "DELETE",
    options,
  });
}

export async function getUserPredictions(
  options?: ApiOptions,
): Promise<PredictionResponse[]> {
  return apiRequest("/predictions/mine", { options });
}

export async function getGamePrediction(
  gameId: number,
  options?: ApiOptions,
): Promise<PredictionResponse> {
  return apiRequest(`/predictions/${gameId}`, { options });
}

export async function addSocialAccount(
  data: AddSocialAccountRequest,
  options?: ApiOptions,
): Promise<SocialAccountResponse> {
  return apiRequest("/user/social", {
    method: "POST",
    body: data,
    options,
  });
}

export async function removeSocialAccount(
  platform: string,
  options?: ApiOptions,
): Promise<void> {
  return apiRequest(`/user/social/${platform}`, {
    method: "DELETE",
    options,
  });
}

export async function getSocialAccounts(
  options?: ApiOptions,
): Promise<SocialAccountResponse[]> {
  return apiRequest("/user/social", { options });
}
