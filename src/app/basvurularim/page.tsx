"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import type { AdoptionApplication, ApplicationStatus } from "@/types/adoption";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  REVIEWING: "bg-sky-100 text-sky-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-stone-200 text-stone-600",
  COMPLETED: "bg-stone-200 text-stone-700",
};

const statusLabels: Record<ApplicationStatus, string> = {
  PENDING: "Beklemede",
  REVIEWING: "İnceleniyor",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  CANCELLED: "İptal Edildi",
  COMPLETED: "Tamamlandı",
};

const withdrawableStatuses: ApplicationStatus[] = ["PENDING", "REVIEWING"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ApplicationsPage() {
  const { user, status: authStatus } = useAuth();
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
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
  }, [authStatus]);

  const handleWithdraw = useCallback(async (applicationId: string) => {
    setWithdrawingId(applicationId);
    try {
      const res = await fetch("/api/me/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === applicationId ? { ...a, status: "CANCELLED" as ApplicationStatus } : a
          )
        );
      }
    } finally {
      setWithdrawingId(null);
      setConfirmId(null);
    }
  }, []);

  if (authStatus === "loading") {
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
            applications.map((application) => {
              const canWithdraw = withdrawableStatuses.includes(
                application.status as ApplicationStatus
              );
              const isConfirming = confirmId === application.id;
              const isWithdrawing = withdrawingId === application.id;

              return (
                <div
                  key={application.id}
                  className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    {Array.isArray(application.animal?.imageUrls) && application.animal.imageUrls.length > 0 && (
                      <Link
                        href={`/hayvanlar/${application.animal.slug}`}
                        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl"
                      >
                        <Image
                          src={application.animal.imageUrls[0]}
                          alt={application.animal.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </Link>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold text-stone-950">
                            {application.animal?.name ?? application.animalName}
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
                          {statusLabels[application.status as ApplicationStatus] ?? application.status}
                        </span>
                      </div>
                    </div>
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
                    {application.availableTime ? (
                      <div className="sm:col-span-2">
                        <dt className="font-semibold text-stone-500">
                          İlgilenme Zamanı
                        </dt>
                        <dd className="mt-0.5 text-stone-800">
                          {application.availableTime}
                        </dd>
                      </div>
                    ) : null}
                    {application.note ? (
                      <div className="sm:col-span-2">
                        <dt className="font-semibold text-stone-500">Not</dt>
                        <dd className="mt-0.5 text-stone-800">{application.note}</dd>
                      </div>
                    ) : null}
                  </dl>

                  {canWithdraw && (
                    <div className="mt-5 border-t border-stone-100 pt-4">
                      {isConfirming ? (
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-stone-600">
                            Bu başvuruyu iptal etmek istediğine emin misin?
                          </p>
                          <button
                            type="button"
                            disabled={isWithdrawing}
                            onClick={() => handleWithdraw(application.id)}
                            className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                          >
                            {isWithdrawing ? "İptal ediliyor..." : "Evet, İptal Et"}
                          </button>
                          <button
                            type="button"
                            disabled={isWithdrawing}
                            onClick={() => setConfirmId(null)}
                            className="rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 disabled:opacity-50"
                          >
                            Vazgeç
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmId(application.id)}
                          className="rounded-full border border-red-200 bg-white px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Başvuruyu Geri Çek
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
