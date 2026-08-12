"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { AdoptionApplication } from "@/types/adoption";

const statusStyles: Record<string, string> = {
  Beklemede: "bg-amber-100 text-amber-800",
  "İnceleniyor": "bg-sky-100 text-sky-800",
  "Görüşme Bekleniyor": "bg-violet-100 text-violet-800",
  Onaylandı: "bg-emerald-100 text-emerald-800",
  Reddedildi: "bg-red-100 text-red-700",
  Tamamlandı: "bg-stone-200 text-stone-700",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ApplicationsPage() {
  const { user, status } = useAuth();
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    fetch("/api/me/applications")
      .then((response) => response.json())
      .then((data: { applications?: AdoptionApplication[] }) => {
        if (active) setApplications(data.applications ?? []);
      })
      .catch(() => {
        if (active) setApplications([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [status]);

  if (status === "loading") {
    return (
      <main className="bg-[#fffaf4]">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-sm text-stone-500">Yükleniyor...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-[#fffaf4]">
        <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <h1 className="text-2xl font-bold text-stone-950">Giriş Gerekli</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Başvurularını görmek için giriş yapmalısın.
          </p>
          <Link
            href="/giris"
            className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Giriş Yap
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#fffaf4]">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold text-stone-950">Başvurularım</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Yaptığın sahiplenme başvurularının durumunu buradan takip edebilirsin.
        </p>

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-sm text-stone-500">Başvurular yükleniyor...</p>
          ) : applications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <p className="text-sm font-medium text-stone-600">
                Henüz başvurun bulunmuyor.
              </p>
              <Link
                href="/hayvanlar"
                className="mt-4 inline-flex rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Hayvanları Keşfet
              </Link>
            </div>
          ) : (
            applications.map((application) => (
              <div
                key={application.id}
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-950">
                      {application.animalName}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">
                      {formatDate(application.createdAt)} · {application.phone}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[application.status] ?? "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-stone-500">Şehir</dt>
                    <dd className="mt-0.5 text-stone-800">{application.city}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-stone-500">Ev Tipi</dt>
                    <dd className="mt-0.5 text-stone-800">
                      {application.houseType}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-stone-500">Bahçe</dt>
                    <dd className="mt-0.5 text-stone-800">
                      {application.hasGarden ? "Evet" : "Hayır"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-stone-500">Deneyim</dt>
                    <dd className="mt-0.5 text-stone-800">
                      {application.previousExperience ? "Evet" : "Hayır"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-stone-500">
                      Sahiplenme Nedeni
                    </dt>
                    <dd className="mt-0.5 text-stone-800">
                      {application.reason}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-stone-500">
                      İlgilenme Zamanı
                    </dt>
                    <dd className="mt-0.5 text-stone-800">
                      {application.availableTime}
                    </dd>
                  </div>
                  {application.note ? (
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-stone-500">Not</dt>
                      <dd className="mt-0.5 text-stone-800">{application.note}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}