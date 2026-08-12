import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  destroySession,
  getSessionToken,
} from "@/server/auth";
import { saveDb } from "@/server/store";

export async function POST() {
  const token = await getSessionToken();
  if (token) {
    await destroySession(token);
    await saveDb();
  }

  const response = NextResponse.json({ message: "Çıkış yapıldı." });
  return clearSessionCookie(response);
}