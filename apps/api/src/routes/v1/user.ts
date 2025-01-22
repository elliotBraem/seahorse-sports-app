import {
  UserProfile,
  createSuccessResponse,
  createErrorResponse,
} from "../../types/api";
import { Env } from "../../types/env";
import { requireAuth } from "../../middleware/auth";

// GET /api/user/profile
export async function handleGetUserProfile(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;

    const stmt = env.DB.prepare(
      `
      SELECT 
        u.*,
        json_group_array(DISTINCT t.id) as favorite_teams,
        json_group_array(DISTINCT s.id) as favorite_sports
      FROM users u
      LEFT JOIN user_favorite_teams uft ON u.id = uft.user_id
      LEFT JOIN teams t ON uft.team_id = t.id
      LEFT JOIN user_favorite_sports ufs ON u.id = ufs.user_id
      LEFT JOIN sports s ON ufs.sport_id = s.id
      WHERE u.id = ?
      GROUP BY u.id
    `,
    ).bind(userId);

    const profile = await stmt.first();

    if (!profile) {
      return createErrorResponse("NOT_FOUND", "User profile not found", 404);
    }

    return createSuccessResponse(profile);
  } catch (error) {
    console.error("[Get Profile Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch user profile",
      500,
    );
  }
}

// PATCH /api/user/profile
export async function handleUpdateUserProfile(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const updates: Partial<UserProfile> = await request.json();

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

    values.push(userId); // Add id for WHERE clause

    const stmt = env.DB.prepare(
      `
      UPDATE users 
      SET ${updateFields.join(", ")}, updated_at = datetime('now')
      WHERE id = ?
    `,
    ).bind(...values);

    await stmt.run();

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Update Profile Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to update user profile",
      500,
    );
  }
}

// POST /api/user/favorites/teams
export async function handleAddFavoriteTeam(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const { teamId } = (await request.json()) as { teamId: number };

    if (!teamId) {
      return createErrorResponse("INVALID_PARAMS", "Team ID is required");
    }

    const stmt = env.DB.prepare(
      `
      INSERT INTO user_favorite_teams (user_id, team_id)
      VALUES (?, ?)
    `,
    ).bind(userId, teamId);

    await stmt.run();

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Add Favorite Team Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to add favorite team",
      500,
    );
  }
}

// DELETE /api/user/favorites/teams/:teamId
export async function handleRemoveFavoriteTeam(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const teamId = request.url.split("/").pop();

    if (!teamId) {
      return createErrorResponse("INVALID_PARAMS", "Team ID is required");
    }

    const stmt = env.DB.prepare(
      `
      DELETE FROM user_favorite_teams 
      WHERE user_id = ? AND team_id = ?
    `,
    ).bind(userId, teamId);

    await stmt.run();

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Remove Favorite Team Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to remove favorite team",
      500,
    );
  }
}

// POST /api/predictions
export async function handleCreatePrediction(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const { gameId, predictedWinnerId } = (await request.json()) as {
      gameId: number;
      predictedWinnerId: number;
    };

    if (!gameId || !predictedWinnerId) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Game ID and predicted winner ID are required",
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
      return createErrorResponse("NOT_FOUND", "Game not found", 404);
    }

    if (game.status !== "upcoming") {
      return createErrorResponse(
        "INVALID_REQUEST",
        "Cannot predict on non-upcoming games",
      );
    }

    if (new Date(game.start_time as string) <= new Date()) {
      return createErrorResponse("INVALID_REQUEST", "Game has already started");
    }

    const stmt = env.DB.prepare(
      `
      INSERT INTO user_predictions (user_id, game_id, predicted_winner_id)
      VALUES (?, ?, ?)
    `,
    ).bind(userId, gameId, predictedWinnerId);

    await stmt.run();

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Create Prediction Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to create prediction",
      500,
    );
  }
}

// GET /api/predictions/mine
export async function handleGetUserPredictions(
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
      WHERE up.user_id = ?
      ORDER BY g.start_time DESC
      LIMIT ? OFFSET ?
    `,
    ).bind(userId, limit, offset);

    const predictions = await stmt.all();

    return createSuccessResponse(predictions.results);
  } catch (error) {
    console.error("[Get Predictions Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch predictions",
      500,
    );
  }
}

// GET /api/predictions/:gameId
export async function handleGetGamePrediction(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const gameId = request.url.split("/").pop();

    if (!gameId) {
      return createErrorResponse("INVALID_PARAMS", "Game ID is required");
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
      WHERE up.user_id = ? AND up.game_id = ?
    `,
    ).bind(userId, gameId);

    const prediction = await stmt.first();

    if (!prediction) {
      return createErrorResponse("NOT_FOUND", "Prediction not found", 404);
    }

    return createSuccessResponse(prediction);
  } catch (error) {
    console.error("[Get Game Prediction Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch game prediction",
      500,
    );
  }
}

// POST /api/user/social
export async function handleAddSocialAccount(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const { platform, platformUserId, username } = (await request.json()) as {
      platform: string;
      platformUserId: string;
      username?: string;
    };

    if (!platform || !platformUserId) {
      return createErrorResponse(
        "INVALID_PARAMS",
        "Platform and platform user ID are required",
      );
    }

    const stmt = env.DB.prepare(
      `
      INSERT INTO user_social_accounts (user_id, platform, platform_user_id, username)
      VALUES (?, ?, ?, ?)
    `,
    ).bind(userId, platform, platformUserId, username || null);

    await stmt.run();

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Add Social Account Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to add social account",
      500,
    );
  }
}

// DELETE /api/user/social/:platform
export async function handleRemoveSocialAccount(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;
    const platform = request.url.split("/").pop();

    if (!platform) {
      return createErrorResponse("INVALID_PARAMS", "Platform is required");
    }

    const stmt = env.DB.prepare(
      `
      DELETE FROM user_social_accounts 
      WHERE user_id = ? AND platform = ?
    `,
    ).bind(userId, platform);

    await stmt.run();

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("[Remove Social Account Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to remove social account",
      500,
    );
  }
}

// GET /api/user/social
export async function handleGetSocialAccounts(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const authenticatedRequest = await requireAuth(request, env);
    const userId = authenticatedRequest.user?.id;

    const stmt = env.DB.prepare(
      `
      SELECT platform, platform_user_id, username, verified, created_at
      FROM user_social_accounts
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
    ).bind(userId);

    const accounts = await stmt.all();

    return createSuccessResponse(accounts.results);
  } catch (error) {
    console.error("[Get Social Accounts Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch social accounts",
      500,
    );
  }
}
