import { Env } from "../../types/env";
import { createErrorResponse } from "../../types/api";
import {
  handleGetAllTimeLeaderboard,
  handleGetCampaignLeaderboard,
} from "./leaderboard";
import {
  handleCreateQuest,
  handleListQuests,
  handleCompleteQuest,
  handleGetUserQuests,
  handleUpdateQuest,
  handleDeleteQuest,
} from "./quests";
import {
  handleListCampaigns,
  handleGetCampaign,
  handleGetCampaignLeaderboard as handleGetCampaignLeaderboardDetailed,
  handleCreateCampaign,
  handleUpdateCampaign,
  handleDeleteCampaign,
} from "./campaigns";
import {
  handleListGames,
  handleGetGame,
  handleGetCurrentGames,
  handleCreateGame,
  handleUpdateGame,
  handleDeleteGame,
} from "./games";
import { handleListTeams, handleGetTeam, handleGetTeamFans } from "./teams";
import {
  handleGetUserProfile,
  handleUpdateUserProfile,
  handleAddFavoriteTeam,
  handleRemoveFavoriteTeam,
  handleCreatePrediction,
  handleGetUserPredictions,
  handleGetGamePrediction,
  handleAddSocialAccount,
  handleRemoveSocialAccount,
  handleGetSocialAccounts,
} from "./user";

export async function handleV1Routes(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
) {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/v1", "");
  const method = request.method;

  // Public Endpoints

  // Campaigns
  if (path === "/campaigns" && method === "GET") {
    return await handleListCampaigns(request, env);
  }
  if (path.match(/^\/campaigns\/\d+$/) && method === "GET") {
    return await handleGetCampaign(request, env);
  }
  if (path.match(/^\/campaigns\/\d+\/leaderboard$/) && method === "GET") {
    return await handleGetCampaignLeaderboardDetailed(request, env);
  }

  // Games
  if (path === "/games" && method === "GET") {
    return await handleListGames(request, env);
  }
  if (path.match(/^\/games\/\d+$/) && method === "GET") {
    return await handleGetGame(request, env);
  }
  if (path === "/games/current" && method === "GET") {
    return await handleGetCurrentGames(request, env);
  }

  // Teams
  if (path === "/teams" && method === "GET") {
    return await handleListTeams(request, env);
  }
  if (path.match(/^\/teams\/\d+$/) && method === "GET") {
    return await handleGetTeam(request, env);
  }
  if (path.match(/^\/teams\/\d+\/fans$/) && method === "GET") {
    return await handleGetTeamFans(request, env);
  }

  // Leaderboards
  if (path === "/leaderboard/all-time" && method === "GET") {
    return await handleGetAllTimeLeaderboard(request, env);
  }
  if (path.match(/^\/leaderboard\/\d+$/) && method === "GET") {
    return await handleGetCampaignLeaderboard(request, env);
  }

  // Protected Endpoints

  // User Profile
  if (path === "/user/profile" && method === "GET") {
    return await handleGetUserProfile(request, env);
  }
  if (path === "/user/profile" && method === "PATCH") {
    return await handleUpdateUserProfile(request, env);
  }
  if (path === "/user/favorites/teams" && method === "POST") {
    return await handleAddFavoriteTeam(request, env);
  }
  if (path.match(/^\/user\/favorites\/teams\/\d+$/) && method === "DELETE") {
    return await handleRemoveFavoriteTeam(request, env);
  }

  // Predictions
  if (path === "/predictions" && method === "POST") {
    return await handleCreatePrediction(request, env);
  }
  if (path === "/predictions/mine" && method === "GET") {
    return await handleGetUserPredictions(request, env);
  }
  if (path.match(/^\/predictions\/\d+$/) && method === "GET") {
    return await handleGetGamePrediction(request, env);
  }

  // Quests
  if (path === "/quests" && method === "GET") {
    return await handleListQuests(request, env);
  }
  if (path.match(/^\/quests\/\d+\/complete$/) && method === "POST") {
    return await handleCompleteQuest(request, env);
  }
  if (path === "/quests/mine" && method === "GET") {
    return await handleGetUserQuests(request, env);
  }

  // Social Accounts
  if (path === "/user/social" && method === "POST") {
    return await handleAddSocialAccount(request, env);
  }
  if (path.match(/^\/user\/social\/[^\/]+$/) && method === "DELETE") {
    return await handleRemoveSocialAccount(request, env);
  }
  if (path === "/user/social" && method === "GET") {
    return await handleGetSocialAccounts(request, env);
  }

  // Admin Endpoints

  // Campaign Management
  if (path === "/admin/campaigns" && method === "POST") {
    return await handleCreateCampaign(request, env);
  }
  if (path.match(/^\/admin\/campaigns\/\d+$/) && method === "PATCH") {
    return await handleUpdateCampaign(request, env);
  }
  if (path.match(/^\/admin\/campaigns\/\d+$/) && method === "DELETE") {
    return await handleDeleteCampaign(request, env);
  }

  // Game Management
  if (path === "/admin/games" && method === "POST") {
    return await handleCreateGame(request, env);
  }
  if (path.match(/^\/admin\/games\/\d+$/) && method === "PATCH") {
    return await handleUpdateGame(request, env);
  }
  if (path.match(/^\/admin\/games\/\d+$/) && method === "DELETE") {
    return await handleDeleteGame(request, env);
  }

  // Quest Management
  if (path === "/admin/quests" && method === "POST") {
    return await handleCreateQuest(request, env);
  }
  if (path.match(/^\/admin\/quests\/\d+$/) && method === "PATCH") {
    return await handleUpdateQuest(request, env);
  }
  if (path.match(/^\/admin\/quests\/\d+$/) && method === "DELETE") {
    return await handleDeleteQuest(request, env);
  }

  return createErrorResponse(
    "NOT_FOUND",
    "Endpoint not found",
    404,
    corsHeaders,
  );
}
