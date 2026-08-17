import { NextRequest, NextResponse } from "next/server";
import { getShelterAdminContext } from "@/server/shelter-admin";
import { prisma } from "@/lib/db";

function slugify(text: string): string {
  const tr: Record<string, string> = {
    "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
    "Ç": "c", "Ğ": "g", "İ": "i", "Ö": "o", "Ş": "s", "Ü": "u",
  };
  return text
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => tr[c] ?? c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET(request: NextRequest) {
  const ctx = await getShelterAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { shelterId: ctx.shelterId };
  if (status) where.adoptionStatus = status;

  const animals = await prisma.animal.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const formatted = animals.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    species: a.species,
    breed: a.breed ?? undefined,
    age: a.age,
    ageGroup: a.ageGroup,
    gender: a.gender,
    size: a.size,
    color: a.color ?? undefined,
    city: a.city,
    district: a.district ?? undefined,
    description: a.description,
    character: a.character,
    energyLevel: a.energyLevel,
    adoptionStatus: a.adoptionStatus,
    imageUrls: JSON.parse(a.imageUrls ?? "[]"),
    traits: JSON.parse(a.traits ?? "[]"),
    vaccinated: a.vaccinated,
    neutered: a.neutered,
    microchipped: a.microchipped,
    healthChecked: a.healthChecked,
    goodWithChildren: a.goodWithChildren,
    goodWithDogs: a.goodWithDogs,
    goodWithCats: a.goodWithCats,
    createdAt: a.createdAt.toISOString(),
  }));

  return NextResponse.json({ animals: formatted });
}

export async function POST(request: NextRequest) {
  const ctx = await getShelterAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const species = typeof data.species === "string" ? data.species.trim() : "";
  const gender = typeof data.gender === "string" ? data.gender.trim() : "";
  const ageGroup = typeof data.ageGroup === "string" ? data.ageGroup.trim() : "";
  const size = typeof data.size === "string" ? data.size.trim() : "";
  const city = typeof data.city === "string" ? data.city.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const character = typeof data.character === "string" ? data.character.trim() : "";
  const energyLevel = typeof data.energyLevel === "string" ? data.energyLevel.trim() : "Orta";

  if (!name || !species || !gender || !ageGroup || !size || !city || !description) {
    return NextResponse.json(
      { error: "Ad, tür, cinsiyet, yaş grubu, boyut, şehir ve açıklama zorunludur." },
      { status: 400 }
    );
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.animal.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const animal = await prisma.animal.create({
    data: {
      slug,
      name,
      species,
      breed: typeof data.breed === "string" ? data.breed.trim() || null : null,
      gender,
      age: typeof data.age === "string" ? data.age.trim() || null : null,
      ageGroup,
      size,
      color: typeof data.color === "string" ? data.color.trim() || null : null,
      city,
      district: typeof data.district === "string" ? data.district.trim() || null : null,
      description,
      character,
      energyLevel,
      healthDescription: typeof data.healthDescription === "string" ? data.healthDescription.trim() || null : null,
      specialNeeds: typeof data.specialNeeds === "string" ? data.specialNeeds.trim() || null : null,
      microchipNumber: typeof data.microchipNumber === "string" ? data.microchipNumber.trim() || null : null,
      sourceType: "SHELTER",
      dataSourceType: "OFFICIAL",
      shelterId: ctx.shelterId,
      adoptionStatus: "AVAILABLE",
      imageUrls: JSON.stringify(Array.isArray(data.imageUrls) ? data.imageUrls.slice(0, 5) : []),
      traits: JSON.stringify(Array.isArray(data.traits) ? data.traits : []),
      vaccinated: data.vaccinated === true ? 1 : data.vaccinated === false ? 0 : null,
      neutered: data.neutered === true ? 1 : data.neutered === false ? 0 : null,
      microchipped: data.microchipped === true ? 1 : data.microchipped === false ? 0 : null,
      healthChecked: data.healthChecked === true ? 1 : data.healthChecked === false ? 0 : null,
      goodWithChildren: data.goodWithChildren === true ? 1 : data.goodWithChildren === false ? 0 : null,
      goodWithDogs: data.goodWithDogs === true ? 1 : data.goodWithDogs === false ? 0 : null,
      goodWithCats: data.goodWithCats === true ? 1 : data.goodWithCats === false ? 0 : null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: ctx.user.id,
      actorName: ctx.user.name,
      actorRole: ctx.user.role,
      targetType: "ANIMAL",
      targetId: animal.id,
      action: "ANIMAL_CREATED",
      detail: `${animal.name} hayvanı eklendi`,
    },
  });

  return NextResponse.json({ animal: { id: animal.id, slug: animal.slug, name: animal.name } }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const ctx = await getShelterAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const animalId = typeof data.id === "string" ? data.id : "";

  if (!animalId) {
    return NextResponse.json({ error: "Hayvan ID gerekli." }, { status: 400 });
  }

  const existing = await prisma.animal.findUnique({ where: { id: animalId }, select: { id: true, shelterId: true } });
  if (!existing) {
    return NextResponse.json({ error: "Hayvan bulunamadı." }, { status: 404 });
  }
  if (existing.shelterId !== ctx.shelterId) {
    return NextResponse.json({ error: "Bu hayvan size ait değil." }, { status: 403 });
  }

  const updateData: Record<string, unknown> = {};
  if (typeof data.name === "string") updateData.name = data.name.trim();
  if (typeof data.species === "string") updateData.species = data.species.trim();
  if (typeof data.gender === "string") updateData.gender = data.gender.trim();
  if (typeof data.ageGroup === "string") updateData.ageGroup = data.ageGroup.trim();
  if (typeof data.size === "string") updateData.size = data.size.trim();
  if (typeof data.city === "string") updateData.city = data.city.trim();
  if (typeof data.description === "string") updateData.description = data.description.trim();
  if (typeof data.character === "string") updateData.character = data.character.trim();
  if (typeof data.energyLevel === "string") updateData.energyLevel = data.energyLevel.trim();
  if (typeof data.breed === "string") updateData.breed = data.breed.trim() || null;
  if (typeof data.age === "string") updateData.age = data.age.trim() || null;
  if (typeof data.color === "string") updateData.color = data.color.trim() || null;
  if (typeof data.district === "string") updateData.district = data.district.trim() || null;
  if (typeof data.healthDescription === "string") updateData.healthDescription = data.healthDescription.trim() || null;
  if (typeof data.specialNeeds === "string") updateData.specialNeeds = data.specialNeeds.trim() || null;
  if (typeof data.microchipNumber === "string") updateData.microchipNumber = data.microchipNumber.trim() || null;
  if (typeof data.adoptionStatus === "string") updateData.adoptionStatus = data.adoptionStatus.trim();
  if (Array.isArray(data.imageUrls)) updateData.imageUrls = JSON.stringify(data.imageUrls.slice(0, 5));
  if (Array.isArray(data.traits)) updateData.traits = JSON.stringify(data.traits);
  if (data.vaccinated !== undefined) updateData.vaccinated = data.vaccinated === true ? 1 : data.vaccinated === false ? 0 : null;
  if (data.neutered !== undefined) updateData.neutered = data.neutered === true ? 1 : data.neutered === false ? 0 : null;
  if (data.microchipped !== undefined) updateData.microchipped = data.microchipped === true ? 1 : data.microchipped === false ? 0 : null;
  if (data.healthChecked !== undefined) updateData.healthChecked = data.healthChecked === true ? 1 : data.healthChecked === false ? 0 : null;
  if (data.goodWithChildren !== undefined) updateData.goodWithChildren = data.goodWithChildren === true ? 1 : data.goodWithChildren === false ? 0 : null;
  if (data.goodWithDogs !== undefined) updateData.goodWithDogs = data.goodWithDogs === true ? 1 : data.goodWithDogs === false ? 0 : null;
  if (data.goodWithCats !== undefined) updateData.goodWithCats = data.goodWithCats === true ? 1 : data.goodWithCats === false ? 0 : null;

  const updated = await prisma.animal.update({ where: { id: animalId }, data: updateData });

  await prisma.auditLog.create({
    data: {
      actorId: ctx.user.id,
      actorName: ctx.user.name,
      actorRole: ctx.user.role,
      targetType: "ANIMAL",
      targetId: animalId,
      action: "ANIMAL_UPDATED",
      detail: `${updated.name} hayvanı güncellendi`,
    },
  });

  return NextResponse.json({ animal: { id: updated.id, slug: updated.slug, name: updated.name } });
}

export async function DELETE(request: NextRequest) {
  const ctx = await getShelterAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const animalId = typeof data.animalId === "string" ? data.animalId : "";

  if (!animalId) {
    return NextResponse.json({ error: "Hayvan ID gerekli." }, { status: 400 });
  }

  const existing = await prisma.animal.findUnique({ where: { id: animalId }, select: { id: true, shelterId: true, name: true } });
  if (!existing) {
    return NextResponse.json({ error: "Hayvan bulunamadı." }, { status: 404 });
  }
  if (existing.shelterId !== ctx.shelterId) {
    return NextResponse.json({ error: "Bu hayvan size ait değil." }, { status: 403 });
  }

  await prisma.animal.delete({ where: { id: animalId } });

  await prisma.auditLog.create({
    data: {
      actorId: ctx.user.id,
      actorName: ctx.user.name,
      actorRole: ctx.user.role,
      targetType: "ANIMAL",
      targetId: animalId,
      action: "ANIMAL_DELETED",
      detail: `${existing.name} hayvanı silindi`,
    },
  });

  return NextResponse.json({ message: "Hayvan silindi." });
}
