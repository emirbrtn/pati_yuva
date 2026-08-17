"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { AnimalForm } from "@/components/AnimalForm";

type Animal = {
  id: string;
  slug: string;
  name: string;
  species: string;
  breed?: string;
  age: string;
  ageGroup: string;
  gender: string;
  status: string;
  city: string;
  district?: string;
  imageUrls: string[];
  createdAt: string;
};

type Application = {
  id: string;
  status: string;
  userName: string;
  userEmail: string;
  phone: string;
  city: string;
  houseType: string;
  hasGarden: boolean;
  previousExperience: boolean;
  hasOtherPets: boolean;
  reason: string;
  availableTime?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  animal: Animal | null;
};

type Stats = {
  shelter: { name: string; city: string } | null;
  stats: {
    totalAnimals: number;
    availableAnimals: number;
    adoptedAnimals: number;
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
  };
};

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  REVIEWING: "İnceleniyor",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  CANCELLED: "İptal Edildi",
  COMPLETED: "Tamamlandı",
  AVAILABLE: "Müsait",
  ADOPTED: "Sahiplendirildi",
  UNDER_TREATMENT: "Tedavide",
  NOT_AVAILABLE: "Müsait Değil",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  REVIEWING: "bg-sky-100 text-sky-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-stone-200 text-stone-600",
  COMPLETED: "bg-stone-200 text-stone-700",
  AVAILABLE: "bg-emerald-50 text-emerald-800",
  ADOPTED: "bg-stone-200 text-stone-700",
  UNDER_TREATMENT: "bg-blue-100 text-blue-800",
  NOT_AVAILABLE: "bg-stone-200 text-stone-600",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ShelterAdminPage() {
  const { user, status: authStatus } = useAuth();
  const [tab, setTab] = useState<"applications" | "animals">("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [animalMode, setAnimalMode] = useState<"list" | "create" | "edit">("list");
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [animalSaving, setAnimalSaving] = useState(false);
  const [animalError, setAnimalError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appRes, animalRes, statsRes] = await Promise.all([
        fetch(`/api/shelter-admin/applications${statusFilter ? `?status=${statusFilter}` : ""}`),
        fetch("/api/shelter-admin/animals"),
        fetch("/api/shelter-admin/stats"),
      ]);

      const appData = await appRes.json();
      const animalData = await animalRes.json();
      const statsData = await statsRes.json();

      setApplications(appData.applications ?? []);
      setAnimals(animalData.animals ?? []);
      setStats(statsData.stats ? statsData : null);
    } catch {
      // sessiz
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (authStatus === "authenticated" && user) fetchData();
  }, [authStatus, user, fetchData]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setActionLoading(applicationId);
    try {
      const res = await fetch("/api/shelter-admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === applicationId ? { ...a, status: newStatus } : a
          )
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleAnimalSubmit = async (data: Record<string, unknown>) => {
    setAnimalSaving(true);
    setAnimalError(null);
    try {
      const isEdit = animalMode === "edit" && editingAnimal;
      const res = await fetch("/api/shelter-admin/animals", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "İşlem başarısız.");
      }
      setAnimalMode("list");
      setEditingAnimal(null);
      fetchData();
    } catch (err) {
      setAnimalError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setAnimalSaving(false);
    }
  };

  const handleAnimalDelete = async (animalId: string) => {
    setActionLoading(animalId);
    try {
      const res = await fetch("/api/shelter-admin/animals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animalId }),
      });
      if (res.ok) {
        setAnimals((prev) => prev.filter((a) => a.id !== animalId));
        setDeleteConfirm(null);
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-sm text-stone-500">Yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (!user || (user.role !== "SHELTER_ADMIN" && user.role !== "SUPER_ADMIN")) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-stone-950">Erişim Engellendi</h1>
          <p className="mt-2 text-sm text-stone-600">
            Bu sayfaya erişim yetkiniz bulunmuyor.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Barınak Yönetim Paneli
          </p>
          <h1 className="mt-1 text-2xl font-bold text-stone-950">
            {stats?.shelter?.name ?? "Barınak"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {stats?.shelter?.city}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard label="Toplam Hayvan" value={stats.stats.totalAnimals} />
            <StatCard label="Müsait Hayvan" value={stats.stats.availableAnimals} accent />
            <StatCard label="Bekleyen Başvuru" value={stats.stats.pendingApplications} warn />
            <StatCard label="Onaylanan Başvuru" value={stats.stats.approvedApplications} />
          </div>
        )}

        <div className="flex gap-1 rounded-xl border border-stone-200 bg-white p-1 mb-6 w-fit">
          <button
            type="button"
            onClick={() => setTab("applications")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === "applications"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Başvurular ({applications.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("animals")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === "animals"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Hayvanlar ({animals.length})
          </button>
        </div>

        {tab === "applications" && (
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {["", "PENDING", "REVIEWING", "APPROVED", "REJECTED"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    statusFilter === s
                      ? "bg-stone-900 text-white"
                      : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"
                  }`}
                >
                  {s ? statusLabels[s] : "Tümü"}
                </button>
              ))}
            </div>

            {applications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
                <p className="text-sm text-stone-500">Başvuru bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      {app.animal?.imageUrls?.[0] && (
                        <Image
                          src={app.animal.imageUrls[0]}
                          alt={app.animal.name}
                          width={64}
                          height={64}
                          className="rounded-xl object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-stone-950">
                              {app.animal?.name ?? "Hayvan"} — {app.userName}
                            </p>
                            <p className="text-xs text-stone-500">
                              {formatDate(app.createdAt)} · {app.city} · {app.phone}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              statusStyles[app.status] ?? "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {statusLabels[app.status] ?? app.status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                          {app.reason}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-500">
                          <span>Ev: {app.houseType}</span>
                          <span>·</span>
                          <span>Bahçe: {app.hasGarden ? "Evet" : "Hayır"}</span>
                          <span>·</span>
                          <span>Deneyim: {app.previousExperience ? "Evet" : "Hayır"}</span>
                          <span>·</span>
                          <span>Diğer evcil: {app.hasOtherPets ? "Evet" : "Hayır"}</span>
                        </div>

                        {app.status === "PENDING" || app.status === "REVIEWING" ? (
                          <div className="mt-4 flex gap-2">
                            {app.status === "PENDING" && (
                              <button
                                type="button"
                                disabled={actionLoading === app.id}
                                onClick={() => handleStatusChange(app.id, "REVIEWING")}
                                className="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                              >
                                İncelemeye Al
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={actionLoading === app.id}
                              onClick={() => handleStatusChange(app.id, "APPROVED")}
                              className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Onayla
                            </button>
                            <button
                              type="button"
                              disabled={actionLoading === app.id}
                              onClick={() => handleStatusChange(app.id, "REJECTED")}
                              className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              Reddet
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "animals" && (
          <div>
            {animalMode === "list" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-stone-500">{animals.length} hayvan</p>
                  <button
                    type="button"
                    onClick={() => { setAnimalMode("create"); setEditingAnimal(null); setAnimalError(null); }}
                    className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    + Hayvan Ekle
                  </button>
                </div>

                {animals.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
                    <p className="text-sm text-stone-500">Henüz hayvan eklenmemiş.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {animals.map((animal) => (
                      <div
                        key={animal.id}
                        className="group rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
                      >
                        <Link href={`/hayvanlar/${animal.slug}`} className="block">
                          {animal.imageUrls?.[0] && (
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <Image
                                src={animal.imageUrls[0]}
                                alt={animal.name}
                                fill
                                className="object-cover transition group-hover:scale-[1.03]"
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-stone-950">{animal.name}</h3>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                  statusStyles[animal.status] ?? "bg-stone-100 text-stone-700"
                                }`}
                              >
                                {statusLabels[animal.status] ?? animal.status}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-stone-500">
                              {animal.species} · {animal.breed ?? "Irk bilinmiyor"} · {animal.age}
                            </p>
                          </div>
                        </Link>
                        <div className="flex border-t border-stone-100">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAnimal(animal);
                              setAnimalMode("edit");
                              setAnimalError(null);
                            }}
                            className="flex-1 py-2.5 text-center text-xs font-semibold text-stone-600 hover:bg-stone-50 transition"
                          >
                            Düzenle
                          </button>
                          {deleteConfirm === animal.id ? (
                            <>
                              <button
                                type="button"
                                disabled={actionLoading === animal.id}
                                onClick={() => handleAnimalDelete(animal.id)}
                                className="flex-1 py-2.5 text-center text-xs font-semibold text-red-600 hover:bg-red-50 transition border-l border-stone-100 disabled:opacity-50"
                              >
                                {actionLoading === animal.id ? "Siliniyor..." : "Evet, Sil"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2.5 text-center text-xs font-semibold text-stone-600 hover:bg-stone-50 transition border-l border-stone-100"
                              >
                                Vazgeç
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(animal.id)}
                              className="flex-1 py-2.5 text-center text-xs font-semibold text-red-600 hover:bg-red-50 transition border-l border-stone-100"
                            >
                              Sil
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {(animalMode === "create" || animalMode === "edit") && (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-stone-950 mb-4">
                  {animalMode === "create" ? "Yeni Hayvan Ekle" : "Hayvanı Düzenle"}
                </h3>
                {animalError && (
                  <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{animalError}</p>
                )}
                <AnimalForm
                  mode={animalMode}
                  initialData={editingAnimal ? { ...editingAnimal, imageUrls: editingAnimal.imageUrls.join("\n") } : undefined}
                  onSubmit={handleAnimalSubmit}
                  onCancel={() => { setAnimalMode("list"); setEditingAnimal(null); setAnimalError(null); }}
                  loading={animalSaving}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  accent,
  warn,
}: {
  label: string;
  value: number;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-emerald-200 bg-emerald-50"
          : warn
            ? "border-amber-200 bg-amber-50"
            : "border-stone-200 bg-white"
      }`}
    >
      <p className="text-2xl font-bold text-stone-950">{value}</p>
      <p className="mt-1 text-xs font-medium text-stone-500">{label}</p>
    </div>
  );
}
