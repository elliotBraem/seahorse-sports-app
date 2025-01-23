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
  handleCreatePrediction,
  handleGetGamePredictions,
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
    return await handleListCampaigns(request, env, corsHeaders);
  }
  if (path.match(/^\/campaigns\/\d+$/) && method === "GET") {
    return await handleGetCampaign(request, env, corsHeaders);
  }
  if (path.match(/^\/campaigns\/\d+\/leaderboard$/) && method === "GET") {
    return await handleGetCampaignLeaderboardDetailed(
      request,
      env,
      corsHeaders,
    );
  }

  // Games
  if (path === "/games" && method === "GET") {
    return await handleListGames(request, env, corsHeaders);
  }
  if (path.match(/^\/games\/\d+$/) && method === "GET") {
    return await handleGetGame(request, env, corsHeaders);
  }
  if (path === "/games/current" && method === "GET") {
    return await handleGetCurrentGames(request, env, corsHeaders);
  }

  // Teams
  if (path === "/teams" && method === "GET") {
    return await handleListTeams(request, env, corsHeaders);
  }
  if (path.match(/^\/teams\/\d+$/) && method === "GET") {
    return await handleGetTeam(request, env, corsHeaders);
  }
  if (path.match(/^\/teams\/\d+\/fans$/) && method === "GET") {
    return await handleGetTeamFans(request, env, corsHeaders);
  }

  // Leaderboards
  if (path === "/leaderboard/all-time" && method === "GET") {
    return await handleGetAllTimeLeaderboard(request, env, corsHeaders);
  }
  if (path.match(/^\/leaderboard\/\d+$/) && method === "GET") {
    return await handleGetCampaignLeaderboard(request, env, corsHeaders);
  }

  // Protected Endpoints

  // User Profile
  if (path === "/user/profile" && method === "GET") {
    return await handleGetUserProfile(request, env, corsHeaders);
  }
  if (path === "/user/profile" && method === "PATCH") {
    return await handleUpdateUserProfile(request, env, corsHeaders);
  }
  if (path === "/user/favorites/teams" && method === "POST") {
    return await handleAddFavoriteTeam(request, env, corsHeaders);
  }
  if (path.match(/^\/user\/favorites\/teams\/\d+$/) && method === "DELETE") {
    return await handleRemoveFavoriteTeam(request, env, corsHeaders);
  }

  // Game Predictions
  if (path.match(/^\/games\/\d+\/predict$/) && method === "POST") {
    return await handleCreatePrediction(request, env, corsHeaders);
  }
  if (path.match(/^\/games\/\d+\/predictions$/) && method === "GET") {
    return await handleGetGamePredictions(request, env, corsHeaders);
  }

  // User Predictions
  if (path === "/predictions/mine" && method === "GET") {
    return await handleGetUserPredictions(request, env, corsHeaders);
  }
  if (path.match(/^\/predictions\/\d+$/) && method === "GET") {
    return await handleGetGamePrediction(request, env, corsHeaders);
  }

  // Quests
  if (path === "/quests" && method === "GET") {
    return await handleListQuests(request, env, corsHeaders);
  }
  if (path.match(/^\/quests\/\d+\/complete$/) && method === "POST") {
    return await handleCompleteQuest(request, env, corsHeaders);
  }
  if (path === "/quests/mine" && method === "GET") {
    return await handleGetUserQuests(request, env, corsHeaders);
  }

  // Social Accounts
  if (path === "/user/social" && method === "POST") {
    return await handleAddSocialAccount(request, env, corsHeaders);
  }
  if (path.match(/^\/user\/social\/[^\/]+$/) && method === "DELETE") {
    return await handleRemoveSocialAccount(request, env, corsHeaders);
  }
  if (path === "/user/social" && method === "GET") {
    return await handleGetSocialAccounts(request, env, corsHeaders);
  }

  // Admin Endpoints

  // Campaign Management
  if (path === "/admin/campaigns" && method === "POST") {
    return await handleCreateCampaign(request, env, corsHeaders);
  }
  if (path.match(/^\/admin\/campaigns\/\d+$/) && method === "PATCH") {
    return await handleUpdateCampaign(request, env, corsHeaders);
  }
  if (path.match(/^\/admin\/campaigns\/\d+$/) && method === "DELETE") {
    return await handleDeleteCampaign(request, env, corsHeaders);
  }

  // Game Management
  if (path === "/admin/games" && method === "POST") {
    return await handleCreateGame(request, env, corsHeaders);
  }
  if (path.match(/^\/admin\/games\/\d+$/) && method === "PATCH") {
    return await handleUpdateGame(request, env, corsHeaders);
  }
  if (path.match(/^\/admin\/games\/\d+$/) && method === "DELETE") {
    return await handleDeleteGame(request, env, corsHeaders);
  }

  // Quest Management
  if (path === "/admin/quests" && method === "POST") {
    return await handleCreateQuest(request, env, corsHeaders);
  }
  if (path.match(/^\/admin\/quests\/\d+$/) && method === "PATCH") {
    return await handleUpdateQuest(request, env, corsHeaders);
  }
  if (path.match(/^\/admin\/quests\/\d+$/) && method === "DELETE") {
    return await handleDeleteQuest(request, env, corsHeaders);
  }

  return createErrorResponse(
    "NOT_FOUND",
    "Endpoint not found",
    404,
    corsHeaders,
  );
}
