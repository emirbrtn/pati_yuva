import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
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

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const shelters = await prisma.shelter.findMany({
    include: {
      _count: {
        select: {
          animals: true,
          applications: true,
          admins: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = shelters.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    description: s.description ?? undefined,
    city: s.city,
    district: s.district ?? undefined,
    address: s.address ?? undefined,
    phone: s.phone ?? undefined,
    email: s.email ?? undefined,
    website: s.website ?? undefined,
    workingHours: s.workingHours ?? undefined,
    imageUrl: s.imageUrl ?? undefined,
    capacity: s.capacity ?? undefined,
    verified: s.verified,
    verificationStatus: s.verificationStatus,
    isDemo: s.isDemo,
    dataSourceType: s.dataSourceType,
    animalCount: s._count.animals,
    applicationCount: s._count.applications,
    adminCount: s._count.admins,
    createdAt: s.createdAt.toISOString(),
  }));

  return NextResponse.json({ shelters: formatted });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const city = typeof data.city === "string" ? data.city.trim() : "";

  if (!name || !city) {
    return NextResponse.json(
      { error: "Barınak adı ve şehir zorunludur." },
      { status: 400 }
    );
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.shelter.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const shelter = await prisma.shelter.create({
    data: {
      slug,
      name,
      description: typeof data.description === "string" ? data.description.trim() || null : null,
      city,
      district: typeof data.district === "string" ? data.district.trim() || null : null,
      address: typeof data.address === "string" ? data.address.trim() || null : null,
      phone: typeof data.phone === "string" ? data.phone.trim() || null : null,
      email: typeof data.email === "string" ? data.email.trim() || null : null,
      website: typeof data.website === "string" ? data.website.trim() || null : null,
      workingHours: typeof data.workingHours === "string" ? data.workingHours.trim() || null : null,
      imageUrl: typeof data.imageUrl === "string" ? data.imageUrl.trim() || null : null,
      capacity: typeof data.capacity === "number" ? data.capacity : null,
      dataSourceType: "OFFICIAL",
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "SHELTER",
      targetId: shelter.id,
      action: "SHELTER_CREATED",
      detail: `${shelter.name} barınağı oluşturuldu`,
    },
  });

  return NextResponse.json({ shelter: { id: shelter.id, slug: shelter.slug, name: shelter.name } }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const shelterId = typeof data.id === "string" ? data.id : "";

  if (!shelterId) {
    return NextResponse.json({ error: "Barınak ID gerekli." }, { status: 400 });
  }

  const existing = await prisma.shelter.findUnique({ where: { id: shelterId } });
  if (!existing) {
    return NextResponse.json({ error: "Barınak bulunamadı." }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (typeof data.name === "string") updateData.name = data.name.trim();
  if (typeof data.description === "string") updateData.description = data.description.trim() || null;
  if (typeof data.city === "string") updateData.city = data.city.trim();
  if (typeof data.district === "string") updateData.district = data.district.trim() || null;
  if (typeof data.address === "string") updateData.address = data.address.trim() || null;
  if (typeof data.phone === "string") updateData.phone = data.phone.trim() || null;
  if (typeof data.email === "string") updateData.email = data.email.trim() || null;
  if (typeof data.website === "string") updateData.website = data.website.trim() || null;
  if (typeof data.workingHours === "string") updateData.workingHours = data.workingHours.trim() || null;
  if (typeof data.imageUrl === "string") updateData.imageUrl = data.imageUrl.trim() || null;
  if (data.capacity === null || typeof data.capacity === "number") updateData.capacity = data.capacity;

  const updated = await prisma.shelter.update({ where: { id: shelterId }, data: updateData });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "SHELTER",
      targetId: shelterId,
      action: "SHELTER_UPDATED",
      detail: `${updated.name} barınağı güncellendi`,
    },
  });

  return NextResponse.json({ shelter: { id: updated.id, slug: updated.slug, name: updated.name } });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const shelterId = typeof data.shelterId === "string" ? data.shelterId : "";

  if (!shelterId) {
    return NextResponse.json({ error: "Barınak ID gerekli." }, { status: 400 });
  }

  const existing = await prisma.shelter.findUnique({ where: { id: shelterId }, select: { id: true, name: true } });
  if (!existing) {
    return NextResponse.json({ error: "Barınak bulunamadı." }, { status: 404 });
  }

  await prisma.shelter.delete({ where: { id: shelterId } });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "SHELTER",
      targetId: shelterId,
      action: "SHELTER_DELETED",
      detail: `${existing.name} barınağı silindi`,
    },
  });

  return NextResponse.json({ message: "Barınak silindi." });
}
