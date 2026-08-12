import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { readDb, saveDb, withId } from "@/server/store";
import { animals } from "@/data/animals";

async function unauthorized() {
  return NextResponse.json(
    { error: "Bu işlem için giriş yapmanız gerekiyor." },
    { status: 401 }
  );
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const db = await readDb();
  const favoriteIds = db.favorites
    .filter((item) => item.userId === user.id)
    .map((item) => item.animalId);

  return NextResponse.json({ favoriteIds });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek gövdesi." },
      { status: 400 }
    );
  }

  const { animalId } = (body ?? {}) as Record<string, unknown>;
  if (typeof animalId !== "string" || !animalId) {
    return NextResponse.json(
      { error: "animalId zorunludur." },
      { status: 400 }
    );
  }

  const animal = animals.find((item) => item.id === animalId);
  if (!animal) {
    return NextResponse.json(
      { error: "Hayvan bulunamadı." },
      { status: 404 }
    );
  }

  const db = await readDb();
  const exists = db.favorites.some(
    (item) => item.userId === user.id && item.animalId === animalId
  );
  if (exists) {
    return NextResponse.json(
      { error: "Bu hayvan zaten favorilerinizde." },
      { status: 409 }
    );
  }

  db.favorites.push({
    id: withId(),
    userId: user.id,
    animalId,
    createdAt: new Date().toISOString(),
  });
  await saveDb();

  const favoriteIds = db.favorites
    .filter((item) => item.userId === user.id)
    .map((item) => item.animalId);

  return NextResponse.json({ favoriteIds }, { status: 201 });
}