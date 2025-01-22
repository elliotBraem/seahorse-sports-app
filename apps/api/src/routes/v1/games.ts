import {
  Game,
  createSuccessResponse,
  createErrorResponse,
} from "../../types/api";
import { Env } from "../../types/env";
import { requireAuth } from "../../middleware/auth";

// GET /api/games
export async function handleListGames(
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

    return createSuccessResponse(games.results);
  } catch (error) {
    console.error("[List Games Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to fetch games", 500);
  }
}

// GET /api/games/:id
export async function handleGetGame(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Game ID is required");
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
      return createErrorResponse("NOT_FOUND", "Game not found", 404);
    }

    return createSuccessResponse(game);
  } catch (error) {
    console.error("[Get Game Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to fetch game", 500);
  }
}

// GET /api/games/current
export async function handleGetCurrentGames(
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

    return createSuccessResponse(games.results);
  } catch (error) {
    console.error("[Current Games Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch current games",
      500,
    );
  }
}

// Admin Routes

// POST /api/admin/games
export async function handleCreateGame(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const game: Omit<Game, "id" | "created_at"> = await request.json();

    // Validate required fields
    if (
      !game.campaign_id ||
      !game.sport_id ||
      !game.home_team_id ||
      !game.away_team_id ||
      !game.start_time ||
      !game.points_value
    ) {
      return createErrorResponse("INVALID_PARAMS", "Missing required fields");
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
      game.campaign_id,
      game.sport_id,
      game.home_team_id,
      game.away_team_id,
      game.start_time,
      game.end_time || null,
      game.game_type,
      game.points_value,
      game.status || "upcoming",
      game.external_id || null,
      game.api_metadata || "{}",
    );

    const result = await stmt.run();

    return createSuccessResponse({ id: result.meta.last_row_id });
  } catch (error) {
    console.error("[Create Game Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to create game", 500);
  }
}

// PATCH /api/admin/games/:id
export async function handleUpdateGame(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const id = request.url.split("/").pop();
    const updates: Partial<Game> = await request.json();

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Game ID is required");
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
      UPDATE games 
      SET ${updateFields.join(", ")} 
      WHERE id = ?
    `,
    ).bind(...values);

    await stmt.run();

    // If winner is set, update user predictions points
    if (updates.winner_team_id && updates.status === "completed") {
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
        .bind(updates.winner_team_id, id, id)
        .run();
    }

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Update Game Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to update game", 500);
  }
}

// DELETE /api/admin/games/:id
export async function handleDeleteGame(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env, true);
    const id = request.url.split("/").pop();

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Game ID is required");
    }

    // First delete related predictions
    await env.DB.prepare("DELETE FROM user_predictions WHERE game_id = ?")
      .bind(id)
      .run();

    // Then delete the game
    await env.DB.prepare("DELETE FROM games WHERE id = ?").bind(id).run();

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Delete Game Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to delete game", 500);
  }
}
