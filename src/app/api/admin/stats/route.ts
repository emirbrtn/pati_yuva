import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "MODERATOR"].includes(user.role)) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const totalUsers = await prisma.user.count({ where: { deletedAt: null } });
  const totalAnimals = await prisma.animal.count();
  const totalShelters = await prisma.shelter.count();
  const totalApplications = await prisma.adoptionApplication.count();

  const availableAnimals = await prisma.animal.count({
    where: { adoptionStatus: "AVAILABLE" },
  });
  const pendingApplications = await prisma.adoptionApplication.count({
    where: { status: "PENDING" },
  });
  const adoptedThisMonth = await prisma.animal.count({
    where: {
      adoptionStatus: "ADOPTED",
      updatedAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });

  // Şehir bazlı dağılım
  const animalsByCity = await prisma.animal.groupBy({
    by: ["city"],
    _count: true,
    orderBy: { _count: { city: "desc" } },
  });

  // Tür bazlı dağılım
  const animalsBySpecies = await prisma.animal.groupBy({
    by: ["species"],
    _count: true,
  });

  // Başvuru durumları
  const applicationsByStatus = await prisma.adoptionApplication.groupBy({
    by: ["status"],
    _count: true,
  });

  return NextResponse.json({
    stats: {
      totalUsers,
      totalAnimals,
      totalShelters,
      totalApplications,
      availableAnimals,
      pendingApplications,
      adoptedThisMonth,
    },
    animalsByCity: animalsByCity.map((item) => ({
      city: item.city,
      count: item._count,
    })),
    animalsBySpecies: animalsBySpecies.map((item) => ({
      species: item.species,
      count: item._count,
    })),
    applicationsByStatus: applicationsByStatus.map((item) => ({
      status: item.status,
      count: item._count,
    })),
  });
}
