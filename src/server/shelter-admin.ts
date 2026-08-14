import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/server/auth";
import type { User } from "@/types/user";

export type ShelterAdminContext = {
  user: User;
  shelterId: string;
};

export async function getShelterAdminContext(): Promise<ShelterAdminContext | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  if (user.role !== "SHELTER_ADMIN" && user.role !== "SUPER_ADMIN") {
    return null;
  }

  if (user.role === "SUPER_ADMIN") {
    const firstAdmin = await prisma.shelterAdmin.findFirst({
      where: { user: { deletedAt: null } },
      select: { shelterId: true },
    });
    if (!firstAdmin) return null;
    return { user, shelterId: firstAdmin.shelterId };
  }

  const shelterAdmin = await prisma.shelterAdmin.findFirst({
    where: { userId: user.id },
    select: { shelterId: true },
  });

  if (!shelterAdmin) return null;

  return { user, shelterId: shelterAdmin.shelterId };
}
