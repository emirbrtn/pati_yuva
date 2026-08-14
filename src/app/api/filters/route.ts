import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  // Tüm şehirler
  const cityResults = await prisma.animal.findMany({
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  const cities = cityResults.map((r) => r.city);

  // Şehir ilçeleri
  let districts: string[] = [];
  if (city) {
    const districtResults = await prisma.animal.findMany({
      where: { city },
      select: { district: true },
      distinct: ["district"],
    });
    districts = districtResults
      .map((r) => r.district)
      .filter((d): d is string => Boolean(d))
      .sort();
  }

  // Barınak seçenekleri
  const shelterResults = await prisma.shelter.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    cities,
    districts,
    shelterOptions: shelterResults,
  });
}
