import { Magic } from "@magic-sdk/admin";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Initialize Magic Admin SDK
const magic = new Magic(process.env.MAGIC_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    // Get the DID token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    const didToken = authHeader?.split("Bearer ")[1];

    if (!authHeader || !didToken) {
      return NextResponse.json({ error: "Missing DID token" }, { status: 401 });
    }

    // Validate the DID token
    magic.token.validate(didToken);

    // Get user metadata from Magic
    const userMetadata = await magic.users.getMetadataByToken(didToken);

    // Create a JWT with user info
    const jwt = await new SignJWT({
      sub: userMetadata.issuer!,
      email: userMetadata.email || undefined,
      publicAddress: userMetadata.publicAddress || undefined,
      isAdmin: false, // Will be checked against env whitelist in worker
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    // Set the JWT in a secure cookie
    const cookieStore = cookies();
    cookieStore.set("auth_token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Return success and redirect to onboarding
    return NextResponse.json({
      status: "success",
      redirect: "/quests",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Invalid DID token" }, { status: 401 });
  }
}
