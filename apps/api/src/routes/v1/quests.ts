import {
  CreateQuestRequest,
  UpdateQuestRequest,
  CompleteQuestRequest,
  QuestResponse,
  QuestCompletionResponse,
} from "@renegade-fanclub/types";
import { createSuccessResponse, createErrorResponse } from "../../types/api";
import { Env } from "../../types/env";
import { requireAuth } from "../../middleware/auth";

// GET /api/quests
export async function handleListQuests(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
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

    const questResponses: QuestResponse[] = quests.results.map((q) => ({
      id: q.id as number,
      campaignId: q.campaign_id as number,
      name: q.name as string,
      description: q.description as string | null,
      pointsValue: q.points_value as number,
      verificationType: q.verification_type as string,
      verificationData: q.verification_data
        ? JSON.parse(q.verification_data as string)
        : null,
      startDate: q.start_date as string,
      endDate: q.end_date as string,
      createdAt: q.created_at as string,
      campaignName: q.campaign_name as string,
      completionCount: q.completion_count as number,
    }));

    return createSuccessResponse(questResponses, corsHeaders);
  } catch (error) {
    console.error("[List Quests Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch quests",
      500,
      corsHeaders,
    );
  }
}

// POST /api/quests/:questId/complete
export async function handleCompleteQuest(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const questId = request.url.split("/")[3]; // quests/:questId/complete
    const { verificationProof } =
      (await request.json()) as CompleteQuestRequest;

    if (!questId) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Quest ID is required",
        400,
        corsHeaders,
      );
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
      return createErrorResponse(
        "NOT_FOUND",
        "Quest not found",
        404,
        corsHeaders,
      );
    }

    if (quest.campaign_status !== "active") {
      return createErrorResponse(
        "INVALID_REQUEST",
        "Campaign is not active",
        400,
        corsHeaders,
      );
    }

    const now = new Date();
    const startDate = new Date(quest.start_date as string);
    const endDate = new Date(quest.end_date as string);

    if (now < startDate || now > endDate) {
      return createErrorResponse(
        "INVALID_REQUEST",
        "Quest is not active",
        400,
        corsHeaders,
      );
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
        .bind(
          userId,
          questId,
          quest.points_value,
          verificationProof ? JSON.stringify(verificationProof) : null,
        )
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

      return createSuccessResponse(
        {
          success: true,
          pointsEarned: quest.points_value,
        },
        corsHeaders,
      );
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
      corsHeaders,
    );
  }
}

// GET /api/quests/mine
export async function handleGetUserQuests(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
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

    const completionResponses: QuestCompletionResponse[] =
      completions.results.map((c) => ({
        id: c.id as number,
        userId: c.user_id as string,
        questId: c.quest_id as number,
        pointsEarned: c.points_earned as number,
        completedAt: c.completed_at as string,
        verificationProof: c.verification_proof
          ? JSON.parse(c.verification_proof as string)
          : null,
        questName: c.quest_name as string,
        questDescription: c.quest_description as string | null,
        verificationType: c.verification_type as string,
        campaignName: c.campaign_name as string,
      }));

    return createSuccessResponse(completionResponses, corsHeaders);
  } catch (error) {
    console.error("[User Quests Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch user quests",
      500,
      corsHeaders,
    );
  }
}

// Admin Routes

// POST /api/admin/quests
export async function handleCreateQuest(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const quest: CreateQuestRequest = await request.json();

    // Validate required fields
    if (
      !quest.campaignId ||
      !quest.name ||
      !quest.pointsValue ||
      !quest.verificationType ||
      !quest.startDate ||
      !quest.endDate
    ) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Missing required fields",
        400,
        corsHeaders,
      );
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
      quest.campaignId,
      quest.name,
      quest.description || null,
      quest.pointsValue,
      quest.verificationType,
      quest.verificationData ? JSON.stringify(quest.verificationData) : null,
      quest.startDate,
      quest.endDate,
    );

    const result = await stmt.run();

    return createSuccessResponse({ id: result.meta.last_row_id }, corsHeaders);
  } catch (error) {
    console.error("[Create Quest Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to create quest",
      500,
      corsHeaders,
    );
  }
}

// PATCH /api/admin/quests/:id
export async function handleUpdateQuest(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const id = request.url.split("/").pop();
    const updates: UpdateQuestRequest = await request.json();

    if (!id) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Quest ID is required",
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
        values.push(key === "verificationData" ? JSON.stringify(value) : value);
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
      UPDATE quests 
      SET ${updateFields.join(", ")} 
      WHERE id = ?
    `,
    ).bind(...values);

    await stmt.run();

    return createSuccessResponse({ success: true }, corsHeaders);
  } catch (error) {
    console.error("[Update Quest Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to update quest",
      500,
      corsHeaders,
    );
  }
}

// DELETE /api/admin/quests/:id
export async function handleDeleteQuest(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const id = request.url.split("/").pop();

    if (!id) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Quest ID is required",
        400,
        corsHeaders,
      );
    }

    // First delete related completions
    await env.DB.prepare(
      "DELETE FROM user_quest_completions WHERE quest_id = ?",
    )
      .bind(id)
      .run();

    // Then delete the quest
    await env.DB.prepare("DELETE FROM quests WHERE id = ?").bind(id).run();

    return createSuccessResponse({ success: true }, corsHeaders);
  } catch (error) {
    console.error("[Delete Quest Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to delete quest",
      500,
      corsHeaders,
    );
  }
}
