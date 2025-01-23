"use server";

import { cookies } from "next/headers";

// 7 days in seconds
const SESSION_DURATION = 7 * 24 * 60 * 60;

export async function setAuthCookie(userId: string) {
  cookies().set("auth", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION,
  });
}

export async function removeAuthCookie() {
  cookies().delete("auth");
}

export async function getAuthCookie() {
  return cookies().get("auth")?.value;
}
