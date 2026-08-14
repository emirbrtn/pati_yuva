import { NextResponse } from "next/server";
import { getSessionToken, destroySession, clearSessionCookie } from "@/server/auth";

export async function POST() {
  const token = await getSessionToken();

  if (token) {
    await destroySession(token);
  }

  const response = NextResponse.json({ message: "Çıkış yapıldı." });
  return clearSessionCookie(response);
}
