"use server";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function getAuthToken() {
  return cookies().get("auth_token")?.value;
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return verified.payload;
  } catch {
    return null;
  }
};