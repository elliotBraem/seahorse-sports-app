import {
  CreateGameRequest,
  CreatePredictionRequest,
  GameResponse,
  GameStatus,
  PredictionResponse,
  UpdateGameRequest,
} from "@renegade-fanclub/types";
import { requireAuth } from "../../middleware/auth";
import { createErrorResponse, createSuccessResponse } from "../../types/api";
import { Env } from "../../types/env";

// GET /api/v1/games/:id/current-user-prediction
export async function handleGetCurrentUserGamePrediction(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const gameId = pathParts[pathParts.length - 2]; // Get the second to last segment

    if (!gameId || isNaN(Number(gameId))) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Game ID is required",
        400,
        corsHeaders,
      );
    }

    // Use the optimized view we created
    const stmt = env.DB.prepare(
      `SELECT * FROM user_predictions_with_game_details WHERE user_id = ? AND game_id = ?`,
    ).bind(userId, gameId);

    const prediction = await stmt.first();

    if (!prediction) {
      return createSuccessResponse(null, corsHeaders);
    }

    const predictionResponse: PredictionResponse = {
      id: prediction.id as number,
      userId: prediction.user_id as string,
      gameId: prediction.game_id as number,
      predictedWinnerId: prediction.predicted_winner_id as number,
      pointsEarned: prediction.points_earned as number | null,
      createdAt: prediction.created_at as string,
      gameStartTime: prediction.start_time as string,
      gameStatus: prediction.game_status as GameStatus,
      pointsValue: prediction.points_value as number,
      homeTeamName: prediction.home_team_name as string,
      awayTeamName: prediction.away_team_name as string,
      predictedWinnerName: prediction.predicted_winner_name as string,
    };

    return createSuccessResponse(predictionResponse, corsHeaders);
  } catch (error) {
    console.error("[Get Current User Game Prediction Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch current user's game prediction",
      500,
      corsHeaders,
    );
  }
}

// GET /api/v1/games
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
        ht.api_metadata as home_team_metadata,
        at.name as away_team_name,
        at.api_metadata as away_team_metadata,
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

    const gameResponses: GameResponse[] = games.results.map((g) => {
      try {
        return {
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
          apiMetadata: JSON.parse((g.api_metadata as string) || "{}"),
          createdAt: g.created_at as string,
          homeTeamName: g.home_team_name as string,
          homeTeamMetadata: JSON.parse(
            (g.home_team_metadata as string) || "{}",
          ),
          awayTeamName: g.away_team_name as string,
          awayTeamMetadata: JSON.parse(
            (g.away_team_metadata as string) || "{}",
          ),
          sportName: g.sport_name as string,
        };
      } catch (error) {
        console.error("[Game Metadata Parse Error]", error, g);
        // Return with empty objects for metadata if parsing fails
        return {
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
          apiMetadata: {},
          createdAt: g.created_at as string,
          homeTeamName: g.home_team_name as string,
          homeTeamMetadata: {},
          awayTeamName: g.away_team_name as string,
          awayTeamMetadata: {},
          sportName: g.sport_name as string,
        };
      }
    });

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

// GET /api/v1/games/:id
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
        ht.api_metadata as home_team_metadata,
        at.name as away_team_name,
        at.api_metadata as away_team_metadata,
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

    let gameResponse: GameResponse;
    try {
      gameResponse = {
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
        apiMetadata: JSON.parse((game.api_metadata as string) || "{}"),
        createdAt: game.created_at as string,
        homeTeamName: game.home_team_name as string,
        homeTeamMetadata: JSON.parse(
          (game.home_team_metadata as string) || "{}",
        ),
        awayTeamName: game.away_team_name as string,
        awayTeamMetadata: JSON.parse(
          (game.away_team_metadata as string) || "{}",
        ),
        sportName: game.sport_name as string,
      };
    } catch (error) {
      console.error("[Game Metadata Parse Error]", error, game);
      // Return with empty objects for metadata if parsing fails
      gameResponse = {
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
        apiMetadata: {},
        createdAt: game.created_at as string,
        homeTeamName: game.home_team_name as string,
        homeTeamMetadata: {},
        awayTeamName: game.away_team_name as string,
        awayTeamMetadata: {},
        sportName: game.sport_name as string,
      };
    }

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

// GET /api/v1/games/current
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
        ht.api_metadata as home_team_metadata,
        at.name as away_team_name,
        at.api_metadata as away_team_metadata,
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

    const gameResponses: GameResponse[] = games.results.map((g) => {
      try {
        return {
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
          apiMetadata: JSON.parse((g.api_metadata as string) || "{}"),
          createdAt: g.created_at as string,
          homeTeamName: g.home_team_name as string,
          homeTeamMetadata: JSON.parse(
            (g.home_team_metadata as string) || "{}",
          ),
          awayTeamName: g.away_team_name as string,
          awayTeamMetadata: JSON.parse(
            (g.away_team_metadata as string) || "{}",
          ),
          sportName: g.sport_name as string,
        };
      } catch (error) {
        console.error("[Game Metadata Parse Error]", error, g);
        // Return with empty objects for metadata if parsing fails
        return {
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
          apiMetadata: {},
          createdAt: g.created_at as string,
          homeTeamName: g.home_team_name as string,
          homeTeamMetadata: {},
          awayTeamName: g.away_team_name as string,
          awayTeamMetadata: {},
          sportName: g.sport_name as string,
        };
      }
    });

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

// POST /api/v1/games/predict
export async function handleCreatePrediction(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const { gameId, predictedWinnerId } =
      (await request.json()) as CreatePredictionRequest;

    if (!gameId || !predictedWinnerId) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Game ID and predicted winner ID are required",
        400,
        corsHeaders,
      );
    }

    // Verify game is still upcoming
    const gameStmt = env.DB.prepare(
      `
      SELECT status, start_time 
      FROM games 
      WHERE id = ?
    `,
    ).bind(gameId);

    const game = await gameStmt.first();

    if (!game) {
      return createErrorResponse(
        "NOT_FOUND",
        "Game not found",
        404,
        corsHeaders,
      );
    }

    if (game.status !== "upcoming") {
      return createErrorResponse(
        "INVALID_REQUEST",
        "Cannot predict on non-upcoming games",
        400,
        corsHeaders,
      );
    }

    if (new Date(game.start_time as string) <= new Date()) {
      return createErrorResponse(
        "INVALID_REQUEST",
        "Game has already started",
        400,
        corsHeaders,
      );
    }

    // Check if a prediction already exists for this user and game
    const existingPredictionStmt = env.DB.prepare(
      `
      SELECT id FROM user_predictions
      WHERE user_id = ? AND game_id = ?
    `,
    ).bind(userId, gameId);

    const existingPrediction = await existingPredictionStmt.first();

    if (existingPrediction) {
      // Update existing prediction
      const updateStmt = env.DB.prepare(
        `
        UPDATE user_predictions
        SET predicted_winner_id = ?
        WHERE id = ?
      `,
      ).bind(predictedWinnerId, existingPrediction.id);

      await updateStmt.run();
    } else {
      // Create new prediction
      const insertStmt = env.DB.prepare(
        `
        INSERT INTO user_predictions (user_id, game_id, predicted_winner_id)
        VALUES (?, ?, ?)
      `,
      ).bind(userId, gameId, predictedWinnerId);

      await insertStmt.run();
    }

    return createSuccessResponse(
      { success: true, predictedWinnerId },
      corsHeaders,
    );
  } catch (error) {
    console.error("[Create/Update Prediction Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to create/update prediction",
      500,
      corsHeaders,
    );
  }
}

// GET /api/v1/games/:id/predictions
export async function handleGetGamePredictions(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const gameId = pathParts[pathParts.length - 2]; // Get the second to last segment

    if (!gameId || isNaN(Number(gameId))) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Game ID is required",
        400,
        corsHeaders,
      );
    }

    const stmt = env.DB.prepare(
      `
      SELECT 
        up.*,
        g.start_time,
        g.status as game_status,
        g.points_value,
        ht.name as home_team_name,
        at.name as away_team_name,
        wt.name as predicted_winner_name
      FROM user_predictions up
      JOIN games g ON up.game_id = g.id
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      JOIN teams wt ON up.predicted_winner_id = wt.id
      WHERE up.game_id = ?
      ORDER BY up.created_at DESC
    `,
    ).bind(gameId);

    const predictions = await stmt.all();

    // Transform database results to match PredictionResponse type
    const predictionResponses: PredictionResponse[] = predictions.results.map(
      (p) => ({
        id: p.id as number,
        userId: p.user_id as string,
        gameId: p.game_id as number,
        predictedWinnerId: p.predicted_winner_id as number,
        pointsEarned: p.points_earned as number | null,
        createdAt: p.created_at as string,
        gameStartTime: p.start_time as string,
        gameStatus: p.game_status as GameStatus,
        pointsValue: p.points_value as number,
        homeTeamName: p.home_team_name as string,
        awayTeamName: p.away_team_name as string,
        predictedWinnerName: p.predicted_winner_name as string,
      }),
    );
    return createSuccessResponse(predictionResponses, corsHeaders);
  } catch (error) {
    console.error("[Get Game Predictions Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch game predictions",
      500,
      corsHeaders,
    );
  }
}

// POST /api/v1/admin/games
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

// PATCH /api/v1/admin/games/:id
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
      // Begin transaction to ensure data consistency
      await env.DB.prepare("BEGIN TRANSACTION").run();
      try {
        // Update points for predictions
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

        // Refresh materialized views to update leaderboards
        await env.DB.prepare(
          "REFRESH MATERIALIZED VIEW all_time_leaderboard",
        ).run();
        await env.DB.prepare(
          "REFRESH MATERIALIZED VIEW campaign_leaderboard",
        ).run();

        await env.DB.prepare("COMMIT").run();
      } catch (error) {
        await env.DB.prepare("ROLLBACK").run();
        throw error;
      }
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

// DELETE /api/v1/admin/games/:id
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
