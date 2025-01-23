import {
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignResponse,
  LeaderboardEntryResponse,
} from "@renegade-fanclub/types";
import { createSuccessResponse, createErrorResponse } from "../../types/api";
import { Env } from "../../types/env";
import { requireAuth } from "../../middleware/auth";

// GET /api/campaigns
export async function handleListCampaigns(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const offset = (page - 1) * limit;

    const stmt = env.DB.prepare(
      `
      SELECT * FROM campaigns 
      ORDER BY start_date DESC 
      LIMIT ? OFFSET ?
    `,
    ).bind(limit, offset);

    const campaigns = await stmt.all();

    const campaignResponses: CampaignResponse[] = campaigns.results.map(
      (c) => ({
        id: c.id as number,
        name: c.name as string,
        description: c.description as string | null,
        startDate: c.start_date as string,
        endDate: c.end_date as string,
        status: c.status as "upcoming" | "active" | "completed",
        rules: c.rules ? JSON.parse(c.rules as string) : {},
        createdAt: c.created_at as string,
      }),
    );

    return createSuccessResponse(campaignResponses, corsHeaders);
  } catch (error) {
    console.error("[List Campaigns Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch campaigns",
      500,
      corsHeaders,
    );
  }
}

// GET /api/campaigns/:id
export async function handleGetCampaign(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Campaign ID is required",
        400,
        corsHeaders,
      );
    }

    const stmt = env.DB.prepare("SELECT * FROM campaigns WHERE id = ?").bind(
      id,
    );
    const campaign = await stmt.first();

    if (!campaign) {
      return createErrorResponse(
        "NOT_FOUND",
        "Campaign not found",
        404,
        corsHeaders,
      );
    }

    const campaignResponse: CampaignResponse = {
      id: campaign.id as number,
      name: campaign.name as string,
      description: campaign.description as string | null,
      startDate: campaign.start_date as string,
      endDate: campaign.end_date as string,
      status: campaign.status as "upcoming" | "active" | "completed",
      rules: campaign.rules ? JSON.parse(campaign.rules as string) : {},
      createdAt: campaign.created_at as string,
    };

    return createSuccessResponse(campaignResponse, corsHeaders);
  } catch (error) {
    console.error("[Get Campaign Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch campaign",
      500,
      corsHeaders,
    );
  }
}

// GET /api/campaigns/:id/leaderboard
export async function handleGetCampaignLeaderboard(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[3]; // campaigns/:id/leaderboard
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (!id) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Campaign ID is required",
        400,
        corsHeaders,
      );
    }

    const offset = (page - 1) * limit;

    const stmt = env.DB.prepare(
      `
      SELECT 
        cl.*,
        u.username,
        u.avatar,
        ROW_NUMBER() OVER (ORDER BY cl.total_points DESC) as rank
      FROM campaign_leaderboard cl
      JOIN users u ON cl.user_id = u.id
      WHERE cl.campaign_id = ? 
      ORDER BY cl.total_points DESC 
      LIMIT ? OFFSET ?
    `,
    ).bind(id, limit, offset);

    const leaderboard = await stmt.all();

    const leaderboardResponses: LeaderboardEntryResponse[] =
      leaderboard.results.map((entry) => ({
        userId: entry.user_id as string,
        username: entry.username as string,
        avatar: entry.avatar as string | null,
        totalPoints: entry.total_points as number,
        predictionPoints: entry.prediction_points as number,
        questPoints: entry.quest_points as number,
        rank: entry.rank as number,
      }));

    return createSuccessResponse(leaderboardResponses, corsHeaders);
  } catch (error) {
    console.error("[Campaign Leaderboard Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch campaign leaderboard",
      500,
      corsHeaders,
    );
  }
}

// Admin Routes

// POST /api/admin/campaigns
export async function handleCreateCampaign(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(
      request,
      env,
      true,
      corsHeaders,
    );
    const campaign: CreateCampaignRequest = await request.json();

    // Validate required fields
    if (!campaign.name || !campaign.startDate || !campaign.endDate) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Missing required fields",
        400,
        corsHeaders,
      );
    }

    const stmt = env.DB.prepare(
      `
      INSERT INTO campaigns (name, description, start_date, end_date, status, rules)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    ).bind(
      campaign.name,
      campaign.description || null,
      campaign.startDate,
      campaign.endDate,
      campaign.status || "upcoming",
      JSON.stringify(campaign.rules || {}),
    );

    const result = await stmt.run();

    return createSuccessResponse({ id: result.meta.last_row_id }, corsHeaders);
  } catch (error) {
    console.error("[Create Campaign Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to create campaign",
      500,
      corsHeaders,
    );
  }
}

// PATCH /api/admin/campaigns/:id
export async function handleUpdateCampaign(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(
      request,
      env,
      true,
      corsHeaders,
    );
    const id = request.url.split("/").pop();
    const updates: UpdateCampaignRequest = await request.json();

    if (!id) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Campaign ID is required",
        400,
        corsHeaders,
      );
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && key !== "createdAt") {
        // Convert camelCase to snake_case for database
        const dbKey = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`,
        );
        updateFields.push(`${dbKey} = ?`);
        values.push(key === "rules" ? JSON.stringify(value) : value);
      }
    });

    if (updateFields.length === 0) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "No valid fields to update",
        400,
        corsHeaders,
      );
    }

    values.push(id); // Add id for WHERE clause

    const stmt = env.DB.prepare(
      `
      UPDATE campaigns 
      SET ${updateFields.join(", ")} 
      WHERE id = ?
    `,
    ).bind(...values);

    await stmt.run();

    return createSuccessResponse({ success: true }, corsHeaders);
  } catch (error) {
    console.error("[Update Campaign Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to update campaign",
      500,
      corsHeaders,
    );
  }
}

// DELETE /api/admin/campaigns/:id
export async function handleDeleteCampaign(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(
      request,
      env,
      true,
      corsHeaders,
    );
    const id = request.url.split("/").pop();

    if (!id) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Campaign ID is required",
        400,
        corsHeaders,
      );
    }

    const stmt = env.DB.prepare("DELETE FROM campaigns WHERE id = ?").bind(id);
    await stmt.run();

    return createSuccessResponse({ success: true }, corsHeaders);
  } catch (error) {
    console.error("[Delete Campaign Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to delete campaign",
      500,
      corsHeaders,
    );
  }
}
