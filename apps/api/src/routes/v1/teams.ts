import {
  Team,
  createSuccessResponse,
  createErrorResponse,
} from "../../types/api";
import { Env } from "../../types/env";
import { requireAuth } from "../../middleware/auth";

// GET /api/teams
export async function handleListTeams(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const sportId = url.searchParams.get("sport_id");

    const offset = (page - 1) * limit;

    let query = `
      SELECT t.*, 
        s.name as sport_name,
        COUNT(DISTINCT uft.user_id) as fan_count
      FROM teams t
      JOIN sports s ON t.sport_id = s.id
      LEFT JOIN user_favorite_teams uft ON t.id = uft.team_id
    `;

    const params: any[] = [];

    if (sportId) {
      query += " WHERE t.sport_id = ?";
      params.push(sportId);
    }

    query += `
      GROUP BY t.id
      ORDER BY t.name ASC 
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    const stmt = env.DB.prepare(query).bind(...params);
    const teams = await stmt.all();

    return createSuccessResponse(teams.results);
  } catch (error) {
    console.error("[List Teams Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to fetch teams", 500);
  }
}

// GET /api/teams/:id
export async function handleGetTeam(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Team ID is required");
    }

    const stmt = env.DB.prepare(
      `
      SELECT t.*, 
        s.name as sport_name,
        COUNT(DISTINCT uft.user_id) as fan_count,
        GROUP_CONCAT(DISTINCT tsa.platform || ':' || tsa.username) as social_accounts
      FROM teams t
      JOIN sports s ON t.sport_id = s.id
      LEFT JOIN user_favorite_teams uft ON t.id = uft.team_id
      LEFT JOIN team_social_accounts tsa ON t.id = tsa.team_id
      WHERE t.id = ?
      GROUP BY t.id
    `,
    ).bind(id);

    const team = await stmt.first();

    if (!team) {
      return createErrorResponse("NOT_FOUND", "Team not found", 404);
    }

    // Parse social accounts
    const socialAccounts =
      typeof team.social_accounts === "string"
        ? team.social_accounts
            .split(",")
            .reduce((acc: Record<string, string>, curr: string) => {
              const [platform, username] = curr.split(":");
              acc[platform] = username;
              return acc;
            }, {})
        : {};

    return createSuccessResponse({
      ...team,
      social_accounts: socialAccounts,
    });
  } catch (error) {
    console.error("[Get Team Error]", error);
    return createErrorResponse("INTERNAL_ERROR", "Failed to fetch team", 500);
  }
}

// GET /api/teams/:id/fans
export async function handleGetTeamFans(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[3]; // teams/:id/fans
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (!id) {
      return createErrorResponse("INVALID_PARAMS", "Team ID is required");
    }

    const offset = (page - 1) * limit;

    const stmt = env.DB.prepare(
      `
      SELECT 
        u.id,
        u.username,
        u.avatar,
        uft.created_at as fan_since,
        (
          SELECT COUNT(*) 
          FROM user_predictions up
          JOIN games g ON up.game_id = g.id
          WHERE up.user_id = u.id 
          AND (g.home_team_id = ? OR g.away_team_id = ?)
        ) as predictions_count
      FROM users u
      JOIN user_favorite_teams uft ON u.id = uft.user_id
      WHERE uft.team_id = ?
      ORDER BY uft.created_at DESC
      LIMIT ? OFFSET ?
    `,
    ).bind(id, id, id, limit, offset);

    const fans = await stmt.all();

    // Get total fan count
    const countStmt = env.DB.prepare(
      `
      SELECT COUNT(*) as total
      FROM user_favorite_teams
      WHERE team_id = ?
    `,
    ).bind(id);

    const { total } = (await countStmt.first()) as { total: number };

    return createSuccessResponse({
      fans: fans.results,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[Team Fans Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch team fans",
      500,
    );
  }
}
