"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Deal = {
  id: string;
  title: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  requiredPoints: number;
  validUntil?: string;
};

type Sponsor = {
  id: string;
  slug: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  phone?: string;
  city: string;
  district?: string;
  category: string;
  isFeatured: boolean;
  deals: Deal[];
};

const categoryLabels: Record<string, string> = {
  PET_SHOP: "Evcil Hayvan Mağazası",
  VETERINARY: "Veteriner Kliniği",
  PET_FOOD: "Mama Üreticisi",
  PET_ACCESSORIES: "Aksesuar Mağazası",
  GROOMING: "Kuaför",
  BOARDING: "Oteller / Pansiyonlar",
};

const categoryIcons: Record<string, string> = {
  PET_SHOP: "🏪",
  VETERINARY: "🏥",
  PET_FOOD: "🍖",
  PET_ACCESSORIES: "🎀",
  GROOMING: "✂️",
  BOARDING: "🏨",
};

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (cityFilter) params.set("city", cityFilter);
    if (categoryFilter) params.set("category", categoryFilter);

    setLoading(true);
    fetch(`/api/sponsors?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setSponsors(d.sponsors ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cityFilter, categoryFilter]);

  const cities = [...new Set(sponsors.map((s) => s.city))].sort();
  const categories = [...new Set(sponsors.map((s) => s.category))].sort();

  return (
    <main className="bg-[#fffaf4]">
      <section className="border-b border-stone-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Anlaşmalı Sponsorlar
            </p>
            <h1 className="mt-3 text-4xl font-bold text-stone-950 sm:text-5xl">
              Puanlarınla indirim kazan.
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Hayvan sahiplen veya yardımda bulun, puan kazan. Anlaşmalı mağazalarda puanlarını indirime çevir.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/puanlarim"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition"
            >
              ⭐ Puanlarımı Gör
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-950 mb-4">Nasıl Çalışır?</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">🐾</div>
                <h3 className="font-bold text-stone-950">1. Hayvan Sahiplen</h3>
                <p className="mt-1 text-sm text-stone-600">Siteden bir hayvan sahiplen, <strong>500 puan</strong> kazan.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">⭐</div>
                <h3 className="font-bold text-stone-950">2. Puan Kazan</h3>
                <p className="mt-1 text-sm text-stone-600">Her yardımda puan kazan. Bağış, gönüllülük, paylaşım.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-2xl">🎉</div>
                <h3 className="font-bold text-stone-950">3. İndirim Kullan</h3>
                <p className="mt-1 text-sm text-stone-600">Anlaşmalı mağazalarda puanlarını indirime çevir.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 outline-none focus:border-emerald-700"
            >
              <option value="">Tüm Şehirler</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 outline-none focus:border-emerald-700"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((c) => <option key={c} value={c}>{categoryLabels[c] ?? c}</option>)}
            </select>
          </div>

          {loading ? (
            <p className="text-sm text-stone-500">Yükleniyor...</p>
          ) : sponsors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <p className="text-sm text-stone-500">Henüz sponsor bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sponsors.map((s) => (
                <div key={s.id} className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{categoryIcons[s.category] ?? "🏪"}</span>
                        <h3 className="font-bold text-stone-950 text-lg">{s.name}</h3>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        {categoryLabels[s.category] ?? s.category} · {s.district ? `${s.district}, ` : ""}{s.city}
                      </p>
                    </div>
                    {s.isFeatured && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">ÖNE ÇIKAN</span>
                    )}
                  </div>

                  <p className="text-sm text-stone-600 mb-4 line-clamp-2">{s.description}</p>

                  <div className="space-y-2 mb-4">
                    {s.deals.slice(0, 2).map((d) => (
                      <div key={d.id} className="rounded-xl bg-emerald-50 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-emerald-900">{d.title}</p>
                          <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                            {d.requiredPoints} ⭐
                          </span>
                        </div>
                        {d.discountPercent && (
                          <p className="text-xs text-emerald-700 mt-1">%{d.discountPercent} indirim</p>
                        )}
                        {d.discountAmount && (
                          <p className="text-xs text-emerald-700 mt-1">{d.discountAmount}₺ indirim</p>
                        )}
                      </div>
                    ))}
                    {s.deals.length > 2 && (
                      <p className="text-xs text-stone-500 text-center">+{s.deals.length - 2} anlaşma daha</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {s.website && (
                      <a
                        href={s.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-full border border-stone-300 py-2 text-center text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                      >
                        Web Sitesi
                      </a>
                    )}
                    {s.phone && (
                      <a
                        href={`tel:${s.phone.replace(/[^+\d]/g, "")}`}
                        className="flex-1 rounded-full bg-emerald-700 py-2 text-center text-xs font-semibold text-white hover:bg-emerald-800 transition"
                      >
                        Ara
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
