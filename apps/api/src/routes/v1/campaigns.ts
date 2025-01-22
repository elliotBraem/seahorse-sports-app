import {
  Campaign,
  createSuccessResponse,
  createErrorResponse,
} from "../../types/api";
import { Env } from "../../types/env";
import { requireAuth } from "../../middleware/auth";

// GET /api/campaigns
export async function handleListCampaigns(
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
      SELECT * FROM campaigns 
      ORDER BY start_date DESC 
      LIMIT ? OFFSET ?
    `,
    ).bind(limit, offset);

    const campaigns = await stmt.all();

    return createSuccessResponse(campaigns.results);
  } catch (error) {
    console.error("[List Campaigns Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch campaigns",
      500,
    );
  }
}

// GET /api/campaigns/:id
export async function handleGetCampaign(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Campaign ID is required");
    }

    const stmt = env.DB.prepare("SELECT * FROM campaigns WHERE id = ?").bind(
      id,
    );
    const campaign = await stmt.first();

    if (!campaign) {
      return createErrorResponse("NOT_FOUND", "Campaign not found", 404);
    }

    return createSuccessResponse(campaign);
  } catch (error) {
    console.error("[Get Campaign Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch campaign",
      500,
    );
  }
}

// GET /api/campaigns/:id/leaderboard
export async function handleGetCampaignLeaderboard(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[3]; // campaigns/:id/leaderboard
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Campaign ID is required");
    }

    const offset = (page - 1) * limit;

    const stmt = env.DB.prepare(
      `
      SELECT * FROM campaign_leaderboard 
      WHERE campaign_id = ? 
      ORDER BY total_points DESC 
      LIMIT ? OFFSET ?
    `,
    ).bind(id, limit, offset);

    const leaderboard = await stmt.all();

    return createSuccessResponse(leaderboard.results);
  } catch (error) {
    console.error("[Campaign Leaderboard Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch campaign leaderboard",
      500,
    );
  }
}

// Admin Routes

// POST /api/admin/campaigns
export async function handleCreateCampaign(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const campaign: Omit<Campaign, "id" | "created_at"> = await request.json();

    // Validate required fields
    if (!campaign.name || !campaign.start_date || !campaign.end_date) {
      return createErrorResponse("INVALID_PARAMS", "Missing required fields");
    }

    const stmt = env.DB.prepare(
      `
      INSERT INTO campaigns (name, description, start_date, end_date, status, rules)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    ).bind(
      campaign.name,
      campaign.description || null,
      campaign.start_date,
      campaign.end_date,
      campaign.status || "upcoming",
      campaign.rules || "{}",
    );

    const result = await stmt.run();

    return createSuccessResponse({ id: result.meta.last_row_id });
  } catch (error) {
    console.error("[Create Campaign Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to create campaign",
      500,
    );
  }
}

// PATCH /api/admin/campaigns/:id
export async function handleUpdateCampaign(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const id = request.url.split("/").pop();
    const updates: Partial<Campaign> = await request.json();

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Campaign ID is required");
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && key !== "created_at") {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length === 0) {
      return createErrorResponse("INVALID_PARAMS", "No valid fields to update");
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

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Update Campaign Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to update campaign",
      500,
    );
  }
}

// DELETE /api/admin/campaigns/:id
export async function handleDeleteCampaign(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const id = request.url.split("/").pop();

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Campaign ID is required");
    }

    const stmt = env.DB.prepare("DELETE FROM campaigns WHERE id = ?").bind(id);
    await stmt.run();

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Delete Campaign Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to delete campaign",
      500,
    );
  }
}
