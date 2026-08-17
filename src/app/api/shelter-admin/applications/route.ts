import { NextRequest, NextResponse } from "next/server";
import { getShelterAdminContext } from "@/server/shelter-admin";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const ctx = await getShelterAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { shelterId: ctx.shelterId };
  if (status) where.status = status;

  const applications = await prisma.adoptionApplication.findMany({
    where,
    include: {
      animal: {
        select: {
          id: true,
          name: true,
          species: true,
          breed: true,
          imageUrls: true,
          slug: true,
          age: true,
          gender: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = applications.map((a) => ({
    id: a.id,
    status: a.status,
    userName: a.userName,
    userEmail: a.userEmail,
    phone: a.phone,
    city: a.city,
    houseType: a.houseType,
    hasGarden: a.hasGarden,
    previousExperience: a.previousExperience,
    hasOtherPets: a.hasOtherPets,
    reason: a.reason,
    availableTime: a.availableTime,
    note: a.note,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    animal: a.animal
      ? {
          ...a.animal,
          imageUrls: JSON.parse(a.animal.imageUrls ?? "[]"),
        }
      : null,
  }));

  return NextResponse.json({ applications: formatted });
}

export async function PATCH(request: NextRequest) {
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
  const applicationId = typeof data.applicationId === "string" ? data.applicationId : "";
  const newStatus = typeof data.status === "string" ? data.status : "";

  if (!applicationId || !newStatus) {
    return NextResponse.json(
      { error: "applicationId ve status gerekli." },
      { status: 400 }
    );
  }

  const allowedStatuses = ["REVIEWING", "APPROVED", "REJECTED"];
  if (!allowedStatuses.includes(newStatus)) {
    return NextResponse.json(
      { error: "Geçersiz durum. İzin verilen: REVIEWING, APPROVED, REJECTED" },
      { status: 400 }
    );
  }

  const application = await prisma.adoptionApplication.findUnique({
    where: { id: applicationId },
    select: { id: true, shelterId: true, status: true, userId: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Başvuru bulunamadı." }, { status: 404 });
  }

  if (application.shelterId !== ctx.shelterId) {
    return NextResponse.json({ error: "Bu başvuru size ait değil." }, { status: 403 });
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
      actorId: ctx.user.id,
      actorName: ctx.user.name,
      actorRole: ctx.user.role,
      targetType: "APPLICATION",
      targetId: applicationId,
      action: `APPLICATION_${newStatus}`,
      detail: `Başvuru durumu ${newStatus} olarak güncellendi`,
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
