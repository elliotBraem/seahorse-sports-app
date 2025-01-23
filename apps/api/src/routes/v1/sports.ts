import { SportResponse } from "@renegade-fanclub/types";
import { createSuccessResponse, createErrorResponse } from "../../types/api";
import { Env } from "../../types/env";

// GET /api/v1/sports
export async function handleListSports(
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
      SELECT s.*,
        COUNT(DISTINCT t.id) as team_count,
        COUNT(DISTINCT ufs.user_id) as fan_count
      FROM sports s
      LEFT JOIN teams t ON s.id = t.sport_id
      LEFT JOIN user_favorite_sports ufs ON s.id = ufs.sport_id
      GROUP BY s.id
      ORDER BY s.name ASC
      LIMIT ? OFFSET ?
    `,
    ).bind(limit, offset);

    const sports = await stmt.all();

    const sportResponses: SportResponse[] = sports.results.map((s) => ({
      id: s.id as number,
      name: s.name as string,
      description: s.description as string | null,
      abbreviation: s.abbreviation as string | null,
      externalId: s.external_id as string | null,
      apiMetadata: s.api_metadata ? JSON.parse(s.api_metadata as string) : {},
      createdAt: s.created_at as string,
      teamCount: s.team_count as number,
      fanCount: s.fan_count as number,
    }));

    return createSuccessResponse(sportResponses, corsHeaders);
  } catch (error) {
    console.error("[List Sports Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch sports",
      500,
      corsHeaders,
    );
  }
}

// GET /api/v1/sports/:id
export async function handleGetSport(
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
        "Sport ID is required",
        400,
        corsHeaders,
      );
    }

    const stmt = env.DB.prepare(
      `
      SELECT s.*,
        COUNT(DISTINCT t.id) as team_count,
        COUNT(DISTINCT ufs.user_id) as fan_count
      FROM sports s
      LEFT JOIN teams t ON s.id = t.sport_id
      LEFT JOIN user_favorite_sports ufs ON s.id = ufs.sport_id
      WHERE s.id = ?
      GROUP BY s.id
    `,
    ).bind(id);

    const sport = await stmt.first();

    if (!sport) {
      return createErrorResponse(
        "NOT_FOUND",
        "Sport not found",
        404,
        corsHeaders,
      );
    }

    const sportResponse: SportResponse = {
      id: sport.id as number,
      name: sport.name as string,
      description: sport.description as string | null,
      abbreviation: sport.abbreviation as string | null,
      externalId: sport.external_id as string | null,
      apiMetadata: sport.api_metadata
        ? JSON.parse(sport.api_metadata as string)
        : {},
      createdAt: sport.created_at as string,
      teamCount: sport.team_count as number,
      fanCount: sport.fan_count as number,
    };

    return createSuccessResponse(sportResponse, corsHeaders);
  } catch (error) {
    console.error("[Get Sport Error]", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch sport",
      500,
      corsHeaders,
    );
  }
}
