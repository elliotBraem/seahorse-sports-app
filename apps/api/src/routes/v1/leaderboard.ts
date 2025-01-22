import {
  LeaderboardRankingResponse,
  AllTimeLeaderboardResponse,
  CampaignLeaderboardResponse,
} from "@renegade-fanclub/types";
import { createSuccessResponse, createErrorResponse } from "../../types/api";
import { Env } from "../../types/env";

// GET /api/leaderboard/all-time
export async function handleGetAllTimeLeaderboard(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const offset = (page - 1) * limit;

    const stmt = env.DB.prepare(
      `
      SELECT * FROM all_time_leaderboard
      LIMIT ? OFFSET ?
    `,
    ).bind(limit, offset);

    const leaderboard = await stmt.all();

    // Get total count
    const countStmt = env.DB.prepare(`
      SELECT COUNT(*) as total FROM (
        SELECT DISTINCT user_id 
        FROM user_points
      )
    `);

    const { total } = (await countStmt.first()) as { total: number };

    const rankings: LeaderboardRankingResponse[] = leaderboard.results.map(r => ({
      userId: r.user_id as string,
      username: r.username as string,
      avatar: r.avatar as string | null,
      totalPoints: r.total_points as number,
      predictionPoints: r.prediction_points as number,
      questPoints: r.quest_points as number,
      rank: r.rank as number,
      lastUpdated: r.last_updated as string,
    }));

    const response: AllTimeLeaderboardResponse = {
      rankings,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };

    return createSuccessResponse(response);
  } catch (error) {
    console.error("[All-Time Leaderboard Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch all-time leaderboard",
      500,
    );
  }
}

// GET /api/leaderboard/:campaignId
export async function handleGetCampaignLeaderboard(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const campaignId = url.pathname.split("/").pop();
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (!campaignId) {
      return createErrorResponse("INVALID_PARAMS", "Campaign ID is required");
    }

    const offset = (page - 1) * limit;

    // First verify campaign exists
    const campaignStmt = env.DB.prepare(
      `
      SELECT id, name, status 
      FROM campaigns 
      WHERE id = ?
    `,
    ).bind(campaignId);

    const campaign = await campaignStmt.first();

    if (!campaign) {
      return createErrorResponse("NOT_FOUND", "Campaign not found", 404);
    }

    // Get leaderboard
    const stmt = env.DB.prepare(
      `
      SELECT * FROM campaign_leaderboard
      WHERE campaign_id = ?
      LIMIT ? OFFSET ?
    `,
    ).bind(campaignId, limit, offset);

    const leaderboard = await stmt.all();

    // Get total count
    const countStmt = env.DB.prepare(
      `
      SELECT COUNT(*) as total 
      FROM user_points 
      WHERE campaign_id = ?
    `,
    ).bind(campaignId);

    const { total } = (await countStmt.first()) as { total: number };

    const rankings: LeaderboardRankingResponse[] = leaderboard.results.map(r => ({
      userId: r.user_id as string,
      username: r.username as string,
      avatar: r.avatar as string | null,
      totalPoints: r.total_points as number,
      predictionPoints: r.prediction_points as number,
      questPoints: r.quest_points as number,
      rank: r.rank as number,
      lastUpdated: r.last_updated as string,
    }));

    const response: CampaignLeaderboardResponse = {
      campaign: {
        id: campaign.id as number,
        name: campaign.name as string,
        status: campaign.status as 'upcoming' | 'active' | 'completed',
      },
      rankings,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };

    return createSuccessResponse(response);
  } catch (error) {
    console.error("[Campaign Leaderboard Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch campaign leaderboard",
      500,
    );
  }
}
