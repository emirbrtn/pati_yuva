import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const where: Record<string, unknown> = { isActive: true };
  if (city) where.city = city;
  if (category) where.category = category;
  if (featured === "true") where.isFeatured = true;

  const sponsors = await prisma.sponsor.findMany({
    where,
    include: { deals: { where: { isActive: true } } },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  const formatted = sponsors.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    description: s.description,
    logoUrl: s.logoUrl ?? undefined,
    website: s.website ?? undefined,
    phone: s.phone ?? undefined,
    email: s.email ?? undefined,
    city: s.city,
    district: s.district ?? undefined,
    category: s.category,
    isFeatured: s.isFeatured,
    deals: s.deals.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      discountPercent: d.discountPercent ?? undefined,
      discountAmount: d.discountAmount ?? undefined,
      requiredPoints: d.requiredPoints,
      validUntil: d.validUntil?.toISOString() ?? undefined,
    })),
  }));

  return NextResponse.json({ sponsors: formatted });
}
