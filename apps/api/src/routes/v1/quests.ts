import {
  Quest,
  createSuccessResponse,
  createErrorResponse,
} from "../../types/api";
import { Env } from "../../types/env";
import { requireAuth } from "../../middleware/auth";

// GET /api/quests
export async function handleListQuests(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const campaignId = url.searchParams.get("campaign_id");

    const offset = (page - 1) * limit;

    let query = `
      SELECT q.*,
        c.name as campaign_name,
        COUNT(DISTINCT uqc.user_id) as completion_count
      FROM quests q
      JOIN campaigns c ON q.campaign_id = c.id
      LEFT JOIN user_quest_completions uqc ON q.id = uqc.quest_id
    `;

    const params: any[] = [];

    if (campaignId) {
      query += " WHERE q.campaign_id = ?";
      params.push(campaignId);
    }

    query += `
      GROUP BY q.id
      ORDER BY q.start_date ASC 
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    const stmt = env.DB.prepare(query).bind(...params);
    const quests = await stmt.all();

    return createSuccessResponse(quests.results);
  } catch (error) {
    console.error("[List Quests Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to fetch quests", 500);
  }
}

// POST /api/quests/:questId/complete
export async function handleCompleteQuest(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const questId = request.url.split("/")[3]; // quests/:questId/complete
    const { verificationProof } = (await request.json()) as {
      verificationProof?: string;
    };

    if (!questId) {
      return createErrorResponse("INVALID_PARAMS", "Quest ID is required");
    }

    // Verify quest exists and is active
    const questStmt = env.DB.prepare(
      `
      SELECT q.*, c.status as campaign_status
      FROM quests q
      JOIN campaigns c ON q.campaign_id = c.id
      WHERE q.id = ?
    `,
    ).bind(questId);

    const quest = await questStmt.first();

    if (!quest) {
      return createErrorResponse("NOT_FOUND", "Quest not found", 404);
    }

    if (quest.campaign_status !== "active") {
      return createErrorResponse("INVALID_REQUEST", "Campaign is not active");
    }

    const now = new Date();
    const startDate = new Date(quest.start_date as string);
    const endDate = new Date(quest.end_date as string);

    if (now < startDate || now > endDate) {
      return createErrorResponse("INVALID_REQUEST", "Quest is not active");
    }

    // Start transaction
    await env.DB.prepare("BEGIN TRANSACTION").run();

    try {
      // Insert completion
      await env.DB.prepare(
        `
        INSERT INTO user_quest_completions (
          user_id, quest_id, points_earned, verification_proof
        )
        VALUES (?, ?, ?, ?)
      `,
      )
        .bind(userId, questId, quest.points_value, verificationProof || null)
        .run();

      // Update user points
      await env.DB.prepare(
        `
        INSERT INTO user_points (
          user_id, campaign_id, total_points, prediction_points, quest_points
        )
        VALUES (?, ?, ?, 0, ?)
        ON CONFLICT(user_id, campaign_id) DO UPDATE SET
          total_points = total_points + ?,
          quest_points = quest_points + ?,
          last_updated = datetime('now')
      `,
      )
        .bind(
          userId,
          quest.campaign_id,
          quest.points_value,
          quest.points_value,
          quest.points_value,
          quest.points_value,
        )
        .run();

      await env.DB.prepare("COMMIT").run();

      return createSuccessResponse({
        success: true,
        points_earned: quest.points_value,
      });
    } catch (error) {
      await env.DB.prepare("ROLLBACK").run();
      throw error;
    }
  } catch (error) {
    console.error("[Complete Quest Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to complete quest",
      500,
    );
  }
}

// GET /api/quests/mine
export async function handleGetUserQuests(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const offset = (page - 1) * limit;

    const stmt = env.DB.prepare(
      `
      SELECT 
        uqc.*,
        q.name as quest_name,
        q.description as quest_description,
        q.verification_type,
        c.name as campaign_name
      FROM user_quest_completions uqc
      JOIN quests q ON uqc.quest_id = q.id
      JOIN campaigns c ON q.campaign_id = c.id
      WHERE uqc.user_id = ?
      ORDER BY uqc.completed_at DESC
      LIMIT ? OFFSET ?
    `,
    ).bind(userId, limit, offset);

    const completions = await stmt.all();

    return createSuccessResponse(completions.results);
  } catch (error) {
    console.error("[User Quests Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch user quests",
      500,
    );
  }
}

// Admin Routes

// POST /api/admin/quests
export async function handleCreateQuest(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const quest: Omit<Quest, "id" | "created_at"> = await request.json();

    // Validate required fields
    if (
      !quest.campaign_id ||
      !quest.name ||
      !quest.points_value ||
      !quest.verification_type ||
      !quest.start_date ||
      !quest.end_date
    ) {
      return createErrorResponse("INVALID_PARAMS", "Missing required fields");
    }

    const stmt = env.DB.prepare(
      `
      INSERT INTO quests (
        campaign_id, name, description, points_value,
        verification_type, verification_data,
        start_date, end_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).bind(
      quest.campaign_id,
      quest.name,
      quest.description || null,
      quest.points_value,
      quest.verification_type,
      quest.verification_data || null,
      quest.start_date,
      quest.end_date,
    );

    const result = await stmt.run();

    return createSuccessResponse({ id: result.meta.last_row_id });
  } catch (error) {
    console.error("[Create Quest Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to create quest", 500);
  }
}

// PATCH /api/admin/quests/:id
export async function handleUpdateQuest(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const id = request.url.split("/").pop();
    const updates: Partial<Quest> = await request.json();

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Quest ID is required");
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
      UPDATE quests 
      SET ${updateFields.join(", ")} 
      WHERE id = ?
    `,
    ).bind(...values);

    await stmt.run();

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Update Quest Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to update quest", 500);
  }
}

// DELETE /api/admin/quests/:id
export async function handleDeleteQuest(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const id = request.url.split("/").pop();

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Quest ID is required");
    }

    // First delete related completions
    await env.DB.prepare(
      "DELETE FROM user_quest_completions WHERE quest_id = ?",
    )
      .bind(id)
      .run();

    // Then delete the quest
    await env.DB.prepare("DELETE FROM quests WHERE id = ?").bind(id).run();

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Delete Quest Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to delete quest", 500);
  }
}
