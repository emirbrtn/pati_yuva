import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
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
  const targetId = typeof data.id === "string" ? data.id : "";
  const newRole = typeof data.role === "string" ? data.role : "";

  if (!targetId || !newRole) {
    return NextResponse.json({ error: "ID ve rol gerekli." }, { status: 400 });
  }

  const validRoles = ["USER", "SHELTER_ADMIN", "MUNICIPALITY_ADMIN", "MODERATOR", "SUPER_ADMIN"];
  if (!validRoles.includes(newRole)) {
    return NextResponse.json({ error: "Geçersiz rol." }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({ where: { id: targetId } });
  if (!targetUser) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const oldRole = targetUser.role;

  await prisma.user.update({
    where: { id: targetId },
    data: { role: newRole },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "USER",
      targetId,
      action: "USER_ROLE_CHANGED",
      detail: `${targetUser.name} rolü ${oldRole} -> ${newRole}`,
      before: oldRole,
      after: newRole,
    },
  });

  return NextResponse.json({ message: "Kullanıcı rolü güncellendi." });
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
  const targetId = typeof data.id === "string" ? data.id : "";

  if (!targetId) {
    return NextResponse.json({ error: "ID gerekli." }, { status: 400 });
  }

  if (targetId === user.id) {
    return NextResponse.json({ error: "Kendinizi silemezsiniz." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: targetId },
    data: { deletedAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetType: "USER",
      targetId,
      action: "USER_DELETED",
      detail: `${targetId} silindi`,
    },
  });

  return NextResponse.json({ message: "Kullanıcı silindi." });
}
