import { type Sport } from "@renegade-fanclub/types";
import { type ApiOptions, apiRequest } from "./types";

export async function listSports(options?: ApiOptions): Promise<Sport[]> {
  return apiRequest("/sports", { options });
}

export async function getSport(
  sportId: number,
  options?: ApiOptions,
): Promise<Sport> {
  return apiRequest(`/sports/${sportId}`, { options });
}
