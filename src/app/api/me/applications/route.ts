import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";
import { activeApplicationStatuses } from "@/types/adoption";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
  }

  const applications = await prisma.adoptionApplication.findMany({
    where: { userId: user.id },
    include: {
      animal: {
        select: {
          id: true,
          name: true,
          species: true,
          imageUrls: true,
          slug: true,
          city: true,
          district: true,
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
  });

  const formatted = applications.map((a) => ({
    ...a,
    animal: a.animal
      ? { ...a.animal, imageUrls: JSON.parse(a.animal.imageUrls ?? "[]") }
      : a.animal,
  }));

  return NextResponse.json({ applications: formatted });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
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

  // Hayvanı bul
  const animal = await prisma.animal.findUnique({ where: { id: animalId } });
  if (!animal) {
    return NextResponse.json({ error: "Hayvan bulunamadı." }, { status: 404 });
  }

  // Daha önce başvuru yapılmış mı
  const existingApp = await prisma.adoptionApplication.findFirst({
    where: {
      userId: user.id,
      animalId,
      status: { in: ["PENDING", "REVIEWING", "APPROVED"] },
    },
  });

  if (existingApp) {
    return NextResponse.json(
      { error: "Bu hayvan için zaten bir başvurunuz bulunuyor." },
      { status: 409 }
    );
  }

  const application = await prisma.adoptionApplication.create({
    data: {
      animalId,
      userId: user.id,
      shelterId: animal.shelterId || undefined,
      userName: user.name,
      userEmail: user.email,
      phone: typeof data.phone === "string" ? data.phone : "",
      city: typeof data.city === "string" ? data.city : "",
      houseType: typeof data.houseType === "string" ? data.houseType : undefined,
      hasGarden: data.hasGarden === true || data.hasGarden === "yes",
      previousExperience: data.previousExperience === true || data.previousExperience === "yes",
      hasOtherPets: data.hasOtherPets === true || data.hasOtherPets === "yes",
      reason: typeof data.reason === "string" ? data.reason : "",
      availableTime: typeof data.availableTime === "string" ? data.availableTime : undefined,
      note: typeof data.note === "string" ? data.note : undefined,
      status: "PENDING",
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "APPLICATION",
      targetId: application.id,
      action: "APPLICATION_CREATED",
      detail: `${user.name} -> ${animal.name} sahiplendirme başvurusu`,
    },
  });

  return NextResponse.json({
    application,
    message: "Başvurunuz alındı.",
  }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const applicationId = typeof data.applicationId === "string" ? data.applicationId : "";

  if (!applicationId) {
    return NextResponse.json({ error: "Başvuru ID gerekli." }, { status: 400 });
  }

  const application = await prisma.adoptionApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    return NextResponse.json({ error: "Başvuru bulunamadı." }, { status: 404 });
  }

  if (application.userId !== user.id) {
    return NextResponse.json({ error: "Bu başvuru size ait değil." }, { status: 403 });
  }

  if (!activeApplicationStatuses.includes(application.status as typeof activeApplicationStatuses[number])) {
    return NextResponse.json(
      { error: "Bu başvuru artık iptal edilemez." },
      { status: 409 }
    );
  }

  const updated = await prisma.adoptionApplication.update({
    where: { id: applicationId },
    data: { status: "CANCELLED" },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "APPLICATION",
      targetId: applicationId,
      action: "APPLICATION_CANCELLED",
      detail: `${user.name} başvurusunu iptal etti`,
    },
  });

  return NextResponse.json({
    application: updated,
    message: "Başvurunuz iptal edildi.",
  });
}
