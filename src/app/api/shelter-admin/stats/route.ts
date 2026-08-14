import { NextResponse } from "next/server";
import { getShelterAdminContext } from "@/server/shelter-admin";
import { prisma } from "@/lib/db";

export async function GET() {
  const ctx = await getShelterAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const [
    totalAnimals,
    availableAnimals,
    adoptedAnimals,
    totalApplications,
    pendingApplications,
    approvedApplications,
    rejectedApplications,
    shelter,
  ] = await Promise.all([
    prisma.animal.count({ where: { shelterId: ctx.shelterId } }),
    prisma.animal.count({ where: { shelterId: ctx.shelterId, adoptionStatus: "AVAILABLE" } }),
    prisma.animal.count({ where: { shelterId: ctx.shelterId, adoptionStatus: "ADOPTED" } }),
    prisma.adoptionApplication.count({ where: { shelterId: ctx.shelterId } }),
    prisma.adoptionApplication.count({ where: { shelterId: ctx.shelterId, status: "PENDING" } }),
    prisma.adoptionApplication.count({ where: { shelterId: ctx.shelterId, status: "APPROVED" } }),
    prisma.adoptionApplication.count({ where: { shelterId: ctx.shelterId, status: "REJECTED" } }),
    prisma.shelter.findUnique({
      where: { id: ctx.shelterId },
      select: { name: true, city: true },
    }),
  ]);

  return NextResponse.json({
    shelter,
    stats: {
      totalAnimals,
      availableAnimals,
      adoptedAnimals,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
    },
  });
}
