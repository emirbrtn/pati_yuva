import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { readDb, saveDb, withId } from "@/server/store";
import { animals } from "@/data/animals";

const ACTIVE_STATUSES = [
  "Beklemede",
  "İnceleniyor",
  "Görüşme Bekleniyor",
  "Onaylandı",
];

function isRequiredString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Bu işlem için giriş yapmanız gerekiyor." },
      { status: 401 }
    );
  }

  const db = await readDb();
  const applications = db.applications
    .filter((item) => item.userId === user.id)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return NextResponse.json({ applications });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Sahiplenme başvurusu için giriş yapmanız gerekiyor." },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek gövdesi." },
      { status: 400 }
    );
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const animalId = data.animalId;

  if (!isRequiredString(animalId)) {
    return NextResponse.json(
      { error: "Hayvan seçimi zorunludur." },
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

  if (!isRequiredString(data.phone)) {
    return NextResponse.json(
      { error: "Telefon numarası zorunludur." },
      { status: 400 }
    );
  }
  if (!isRequiredString(data.city)) {
    return NextResponse.json(
      { error: "Şehir zorunludur." },
      { status: 400 }
    );
  }
  if (!isRequiredString(data.houseType)) {
    return NextResponse.json(
      { error: "Ev tipi zorunludur." },
      { status: 400 }
    );
  }
  if (!isRequiredString(data.reason)) {
    return NextResponse.json(
      { error: "Sahiplenme nedeni zorunludur." },
      { status: 400 }
    );
  }
  if (!isRequiredString(data.availableTime)) {
    return NextResponse.json(
      { error: "İlgilenme zamanı zorunludur." },
      { status: 400 }
    );
  }

  const db = await readDb();
  const existing = db.applications.some(
    (item) =>
      item.userId === user.id &&
      item.animalId === animalId &&
      ACTIVE_STATUSES.includes(item.status)
  );
  if (existing) {
    return NextResponse.json(
      {
        error:
          "Bu hayvan için zaten aktif bir başvurunuz var. Sonucu 'Başvurularım' sayfasından takip edebilirsiniz.",
      },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();
  const application = {
    id: withId(),
    userId: user.id,
    animalId,
    animalName: animal.name,
    userName: user.name,
    phone: (data.phone as string).trim(),
    email: user.email,
    city: (data.city as string).trim(),
    houseType: (data.houseType as string).trim(),
    hasGarden: data.hasGarden === true,
    previousExperience: data.previousExperience === true,
    hasOtherPets: data.hasOtherPets === true,
    reason: (data.reason as string).trim(),
    availableTime: (data.availableTime as string).trim(),
    note:
      typeof data.note === "string" && data.note.trim()
        ? data.note.trim()
        : undefined,
    status: "Beklemede" as const,
    createdAt: now,
    updatedAt: now,
  };

  db.applications.push(application);
  await saveDb();

  return NextResponse.json(
    { application, message: "Başvurunuz alındı." },
    { status: 201 }
  );
}