import {
  CreateGameRequest,
  UpdateGameRequest,
  GameResponse,
  GameStatus,
} from "@renegade-fanclub/types";
import { createSuccessResponse, createErrorResponse } from "../../types/api";
import { Env } from "../../types/env";
import { requireAuth } from "../../middleware/auth";

// GET /api/games
export async function handleListGames(
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
      SELECT g.*, 
        ht.name as home_team_name,
        at.name as away_team_name,
        s.name as sport_name
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      JOIN sports s ON g.sport_id = s.id
      ORDER BY g.start_time DESC 
      LIMIT ? OFFSET ?
    `,
    ).bind(limit, offset);

    const games = await stmt.all();

    const gameResponses: GameResponse[] = games.results.map((g) => ({
      id: g.id as number,
      campaignId: g.campaign_id as number,
      sportId: g.sport_id as number,
      homeTeamId: g.home_team_id as number,
      awayTeamId: g.away_team_id as number,
      startTime: g.start_time as string,
      endTime: g.end_time as string | null,
      winnerTeamId: g.winner_team_id as number | null,
      gameType: g.game_type as string | null,
      pointsValue: g.points_value as number,
      status: g.status as GameStatus,
      externalId: g.external_id as string | null,
      apiMetadata: g.api_metadata as Record<string, unknown>,
      createdAt: g.created_at as string,
      homeTeamName: g.home_team_name as string,
      awayTeamName: g.away_team_name as string,
      sportName: g.sport_name as string,
    }));

    return createSuccessResponse(gameResponses, corsHeaders);
  } catch (error) {
    console.error("[List Games Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch games",
      500,
      corsHeaders,
    );
  }
}

// GET /api/games/:id
export async function handleGetGame(
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
        "Game ID is required",
        400,
        corsHeaders,
      );
    }

    const stmt = env.DB.prepare(
      `
      SELECT g.*, 
        ht.name as home_team_name,
        at.name as away_team_name,
        s.name as sport_name
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      JOIN sports s ON g.sport_id = s.id
      WHERE g.id = ?
    `,
    ).bind(id);

    const game = await stmt.first();

    if (!game) {
      return createErrorResponse(
        "NOT_FOUND",
        "Game not found",
        404,
        corsHeaders,
      );
    }

    const gameResponse: GameResponse = {
      id: game.id as number,
      campaignId: game.campaign_id as number,
      sportId: game.sport_id as number,
      homeTeamId: game.home_team_id as number,
      awayTeamId: game.away_team_id as number,
      startTime: game.start_time as string,
      endTime: game.end_time as string | null,
      winnerTeamId: game.winner_team_id as number | null,
      gameType: game.game_type as string | null,
      pointsValue: game.points_value as number,
      status: game.status as GameStatus,
      externalId: game.external_id as string | null,
      apiMetadata: game.api_metadata as Record<string, unknown>,
      createdAt: game.created_at as string,
      homeTeamName: game.home_team_name as string,
      awayTeamName: game.away_team_name as string,
      sportName: game.sport_name as string,
    };

    return createSuccessResponse(gameResponse, corsHeaders);
  } catch (error) {
    console.error("[Get Game Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch game",
      500,
      corsHeaders,
    );
  }
}

// GET /api/games/current
export async function handleGetCurrentGames(
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
      SELECT g.*, 
        ht.name as home_team_name,
        at.name as away_team_name,
        s.name as sport_name
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      JOIN sports s ON g.sport_id = s.id
      WHERE g.status = 'active'
      ORDER BY g.start_time ASC
      LIMIT ? OFFSET ?
    `,
    ).bind(limit, offset);

    const games = await stmt.all();

    const gameResponses: GameResponse[] = games.results.map((g) => ({
      id: g.id as number,
      campaignId: g.campaign_id as number,
      sportId: g.sport_id as number,
      homeTeamId: g.home_team_id as number,
      awayTeamId: g.away_team_id as number,
      startTime: g.start_time as string,
      endTime: g.end_time as string | null,
      winnerTeamId: g.winner_team_id as number | null,
      gameType: g.game_type as string | null,
      pointsValue: g.points_value as number,
      status: g.status as GameStatus,
      externalId: g.external_id as string | null,
      apiMetadata: g.api_metadata as Record<string, unknown>,
      createdAt: g.created_at as string,
      homeTeamName: g.home_team_name as string,
      awayTeamName: g.away_team_name as string,
      sportName: g.sport_name as string,
    }));

    return createSuccessResponse(gameResponses, corsHeaders);
  } catch (error) {
    console.error("[Current Games Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch current games",
      500,
      corsHeaders,
    );
  }
}

// Admin Routes

// POST /api/admin/games
export async function handleCreateGame(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const game: CreateGameRequest = await request.json();

    // Validate required fields
    if (
      !game.campaignId ||
      !game.sportId ||
      !game.homeTeamId ||
      !game.awayTeamId ||
      !game.startTime ||
      !game.pointsValue
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
      INSERT INTO games (
        campaign_id, sport_id, home_team_id, away_team_id, 
        start_time, end_time, game_type, points_value, 
        status, external_id, api_metadata
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).bind(
      game.campaignId,
      game.sportId,
      game.homeTeamId,
      game.awayTeamId,
      game.startTime,
      game.endTime || null,
      game.gameType,
      game.pointsValue,
      game.status || "upcoming",
      game.externalId || null,
      game.apiMetadata || "{}",
    );

    const result = await stmt.run();

    return createSuccessResponse({ id: result.meta.last_row_id }, corsHeaders);
  } catch (error) {
    console.error("[Create Game Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to create game",
      500,
      corsHeaders,
    );
  }
}

// PATCH /api/admin/games/:id
export async function handleUpdateGame(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const id = request.url.split("/").pop();
    const updates: UpdateGameRequest = await request.json();

    if (!id) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Game ID is required",
        400,
        corsHeaders,
      );
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && key !== "created_at") {
        // Convert camelCase to snake_case for database
        const dbKey = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`,
        );
        updateFields.push(`${dbKey} = ?`);
        values.push(value);
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
      UPDATE games 
      SET ${updateFields.join(", ")} 
      WHERE id = ?
    `,
    ).bind(...values);

    await stmt.run();

    // If winner is set, update user predictions points
    if (updates.winnerTeamId && updates.status === "completed") {
      await env.DB.prepare(
        `
        UPDATE user_predictions
        SET points_earned = CASE 
          WHEN predicted_winner_id = ? THEN (
            SELECT points_value 
            FROM games 
            WHERE id = ?
          )
          ELSE 0
        END
        WHERE game_id = ?
      `,
      )
        .bind(updates.winnerTeamId, id, id)
        .run();
    }

    return createSuccessResponse({ success: true }, corsHeaders);
  } catch (error) {
    console.error("[Update Game Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to update game",
      500,
      corsHeaders,
    );
  }
}

// DELETE /api/admin/games/:id
export async function handleDeleteGame(
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
        "Game ID is required",
        400,
        corsHeaders,
      );
    }

    // First delete related predictions
    await env.DB.prepare("DELETE FROM user_predictions WHERE game_id = ?")
      .bind(id)
      .run();

    // Then delete the game
    await env.DB.prepare("DELETE FROM games WHERE id = ?").bind(id).run();

    return createSuccessResponse({ success: true }, corsHeaders);
  } catch (error) {
    console.error("[Delete Game Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to delete game",
      500,
      corsHeaders,
    );
  }
}
