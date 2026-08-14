import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ user: fullUser });
}

export async function PUT(request: NextRequest) {
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

  const updateData: Record<string, unknown> = {};

  if (typeof data.name === "string" && data.name.trim().length >= 2) {
    updateData.name = data.name.trim();
  }
  if (typeof data.firstName === "string") {
    updateData.firstName = data.firstName.trim() || null;
  }
  if (typeof data.lastName === "string") {
    updateData.lastName = data.lastName.trim() || null;
  }
  if (typeof data.phone === "string") {
    updateData.phone = data.phone.trim() || null;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: updateData,
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      name: updated.name,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      createdAt: updated.createdAt.toISOString(),
    },
    message: "Profil güncellendi.",
  });
}
