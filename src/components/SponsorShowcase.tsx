import Link from "next/link";
import { prisma } from "@/lib/db";

const categoryIcons: Record<string, string> = {
  PET_SHOP: "🏪",
  VETERINARY: "🏥",
  PET_FOOD: "🍖",
  PET_ACCESSORIES: "🎀",
  GROOMING: "✂️",
  BOARDING: "🏨",
};

export async function SponsorShowcase() {
  const sponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
    include: { deals: { where: { isActive: true }, take: 1 } },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: 6,
  });

  if (sponsors.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Anlaşmalı Sponsorlar
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-950 sm:text-4xl">
              Puanlarınla indirim kazan.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              Hayvan sahiplen veya yardımda bulun, puan kazan. Anlaşmalı mağazalarda puanlarını indirime çevir.
            </p>
          </div>
          <Link
            href="/sponsorlar"
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          >
            Tümünü Gör →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((s) => {
            const deal = s.deals[0];
            return (
              <Link
                key={s.id}
                href="/sponsorlar"
                className="group rounded-2xl border border-stone-200 bg-stone-50 p-5 hover:bg-white hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{categoryIcons[s.category] ?? "🏪"}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-stone-950 group-hover:text-emerald-800 transition">
                      {s.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {s.city}{s.district ? ` · ${s.district}` : ""}
                    </p>
                  </div>
                  {s.isFeatured && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 shrink-0">
                      ÖNE ÇIKAN
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-stone-600 line-clamp-2">
                  {s.description}
                </p>

                {deal && (
                  <div className="mt-3 rounded-xl bg-emerald-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-emerald-900 truncate">{deal.title}</p>
                      <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-900 shrink-0">
                        {deal.requiredPoints} ⭐
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/sponsorlar"
            className="inline-flex rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition"
          >
            Tüm Sponsorları Keşfet
          </Link>
        </div>
      </div>
    </section>
  );
}
