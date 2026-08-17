import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const admins = await prisma.shelterAdmin.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      shelter: { select: { id: true, name: true, city: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    admins: admins.map((a) => ({
      id: a.id,
      userId: a.user.id,
      userName: a.user.name,
      userEmail: a.user.email,
      userPhone: a.user.phone ?? undefined,
      shelterId: a.shelter.id,
      shelterName: a.shelter.name,
      shelterCity: a.shelter.city,
      createdAt: a.createdAt.toISOString(),
    })),
  });
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
  const userId = typeof data.userId === "string" ? data.userId.trim() : "";
  const shelterId = typeof data.shelterId === "string" ? data.shelterId.trim() : "";

  if (!userId || !shelterId) {
    return NextResponse.json(
      { error: "Kullanıcı ID ve Barınak ID zorunludur." },
      { status: 400 }
    );
  }

  const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, role: true } });
  if (!targetUser) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const shelter = await prisma.shelter.findUnique({ where: { id: shelterId }, select: { id: true, name: true } });
  if (!shelter) {
    return NextResponse.json({ error: "Barınak bulunamadı." }, { status: 404 });
  }

  const existing = await prisma.shelterAdmin.findUnique({
    where: { userId_shelterId: { userId, shelterId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Bu kullanıcı zaten bu barınağın yetkilisi." }, { status: 409 });
  }

  const shelterAdmin = await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { role: "SHELTER_ADMIN" } });
    return tx.shelterAdmin.create({ data: { userId, shelterId } });
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "SHELTER_ADMIN",
      targetId: shelterAdmin.id,
      action: "SHELTER_ADMIN_ASSIGNED",
      detail: `${targetUser.name} kullanıcısı ${shelter.name} barınağı yetkilisi olarak atandı`,
    },
  });

  return NextResponse.json({
    admin: {
      id: shelterAdmin.id,
      userId: targetUser.id,
      userName: targetUser.name,
      shelterId: shelter.id,
      shelterName: shelter.name,
    },
  }, { status: 201 });
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
  const adminId = typeof data.adminId === "string" ? data.adminId : "";

  if (!adminId) {
    return NextResponse.json({ error: "Admin ID gerekli." }, { status: 400 });
  }

  const existing = await prisma.shelterAdmin.findUnique({
    where: { id: adminId },
    include: {
      user: { select: { id: true, name: true } },
      shelter: { select: { id: true, name: true } },
    },
  });
  if (!existing) {
    return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
  }

  const otherAdminCount = await prisma.shelterAdmin.count({
    where: { userId: existing.userId, id: { not: adminId } },
  });

  await prisma.$transaction(async (tx) => {
    await tx.shelterAdmin.delete({ where: { id: adminId } });
    if (otherAdminCount === 0) {
      await tx.user.update({ where: { id: existing.userId }, data: { role: "USER" } });
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "SHELTER_ADMIN",
      targetId: adminId,
      action: "SHELTER_ADMIN_REMOVED",
      detail: `${existing.user.name} kullanıcısı ${existing.shelter.name} barınak yetkililiğinden kaldırıldı`,
    },
  });

  return NextResponse.json({ message: "Yetkili kaldırıldı." });
}
