import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

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
    city: s.city,
    district: s.district,
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

export async function PATCH(request: NextRequest) {
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
  const verified = typeof data.verified === "boolean" ? data.verified : undefined;

  if (!shelterId) {
    return NextResponse.json({ error: "shelterId gerekli." }, { status: 400 });
  }

  const shelter = await prisma.shelter.findUnique({ where: { id: shelterId } });
  if (!shelter) {
    return NextResponse.json({ error: "Barınak bulunamadı." }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (verified !== undefined) {
    updateData.verified = verified;
    updateData.verificationStatus = verified ? "VERIFIED" : "UNVERIFIED";
    if (verified) updateData.verifiedAt = new Date();
  }

  const updated = await prisma.shelter.update({
    where: { id: shelterId },
    data: updateData,
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "SHELTER",
      targetId: shelterId,
      action: verified ? "SHELTER_VERIFIED" : "SHELTER_UNVERIFIED",
      detail: `${shelter.name} doğrulama durumu güncellendi`,
    },
  });

  return NextResponse.json({
    shelter: {
      id: updated.id,
      name: updated.name,
      verified: updated.verified,
      verificationStatus: updated.verificationStatus,
    },
  });
}
