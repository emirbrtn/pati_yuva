import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const shelterId = searchParams.get("shelterId");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (shelterId) where.shelterId = shelterId;

  const applications = await prisma.adoptionApplication.findMany({
    where,
    include: {
      animal: {
        select: {
          id: true,
          name: true,
          species: true,
          imageUrls: true,
          slug: true,
        },
      },
      shelter: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const formatted = applications.map((a) => ({
    id: a.id,
    status: a.status,
    userName: a.userName,
    userEmail: a.userEmail,
    phone: a.phone,
    city: a.city,
    reason: a.reason,
    createdAt: a.createdAt.toISOString(),
    animal: a.animal
      ? { ...a.animal, imageUrls: JSON.parse(a.animal.imageUrls ?? "[]") }
      : null,
    shelter: a.shelter,
  }));

  return NextResponse.json({ applications: formatted });
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
  const applicationId = typeof data.applicationId === "string" ? data.applicationId : "";
  const newStatus = typeof data.status === "string" ? data.status : "";

  if (!applicationId || !newStatus) {
    return NextResponse.json({ error: "applicationId ve status gerekli." }, { status: 400 });
  }

  const allowedStatuses = ["APPROVED", "REJECTED", "COMPLETED"];
  if (!allowedStatuses.includes(newStatus)) {
    return NextResponse.json(
      { error: "Geçersiz durum. İzin verilen: APPROVED, REJECTED, COMPLETED" },
      { status: 400 }
    );
  }

  const application = await prisma.adoptionApplication.findUnique({
    where: { id: applicationId },
    select: { id: true, status: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Başvuru bulunamadı." }, { status: 404 });
  }

  const updated = await prisma.adoptionApplication.update({
    where: { id: applicationId },
    data: { status: newStatus },
  });

  if (newStatus === "APPROVED") {
    const app = await prisma.adoptionApplication.findUnique({
      where: { id: applicationId },
      select: { animalId: true },
    });
    if (app) {
      await prisma.animal.update({
        where: { id: app.animalId },
        data: { adoptionStatus: "ADOPTED" },
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "APPLICATION",
      targetId: applicationId,
      action: `APPLICATION_${newStatus}`,
      detail: `Süper admin başvuruyu ${newStatus} olarak güncelledi`,
    },
  });

  return NextResponse.json({
    application: {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    },
  });
}
