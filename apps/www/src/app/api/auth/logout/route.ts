import { clearAuthToken } from "@/app/actions";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    clearAuthToken();
    return NextResponse.json({
      status: "success",
      redirect: "/",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
