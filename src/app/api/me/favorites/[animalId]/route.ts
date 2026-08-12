import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { readDb, saveDb, withId } from "@/server/store";
import { animals } from "@/data/animals";

async function unauthorized() {
  return NextResponse.json(
    { error: "Bu işlem için giriş yapmanız gerekiyor." },
    { status: 401 }
  );
}

async function favoriteIdsFor(userId: string) {
  const db = await readDb();
  return db.favorites
    .filter((item) => item.userId === userId)
    .map((item) => item.animalId);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ animalId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { animalId } = await params;

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

  return NextResponse.json(
    { favoriteIds: await favoriteIdsFor(user.id) },
    { status: 201 }
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ animalId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { animalId } = await params;

  const db = await readDb();
  db.favorites = db.favorites.filter(
    (item) => item.userId !== user.id || item.animalId !== animalId
  );
  await saveDb();

  return NextResponse.json({ favoriteIds: await favoriteIdsFor(user.id) });
}