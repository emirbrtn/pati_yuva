"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShelterForm } from "@/components/ShelterForm";

type Overview = {
  stats: {
    totalUsers: number;
    totalAnimals: number;
    totalShelters: number;
    totalApplications: number;
    availableAnimals: number;
    pendingApplications: number;
    adoptedThisMonth: number;
  };
  animalsByCity: { city: string; count: number }[];
  animalsBySpecies: { species: string; count: number }[];
  applicationsByStatus: { status: string; count: number }[];
};

type Application = {
  id: string;
  status: string;
  userName: string;
  userEmail: string;
  phone: string;
  city: string;
  reason: string;
  createdAt: string;
  animal: { id: string; name: string; species: string; imageUrls: string[]; slug: string } | null;
  shelter: { id: string; name: string; city: string } | null;
};

type Shelter = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  city: string;
  district?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  workingHours?: string;
  imageUrl?: string;
  capacity?: number;
  verified: boolean;
  verificationStatus: string;
  isDemo: boolean;
  dataSourceType: string;
  animalCount: number;
  applicationCount: number;
  adminCount: number;
  createdAt: string;
};

type ShelterUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
};

type AuditLog = {
  id: string;
  actorName: string;
  actorRole: string;
  targetType: string;
  targetId: string;
  action: string;
  detail: string;
  createdAt: string;
};

type Tab = "overview" | "applications" | "shelters" | "users" | "audit";

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  REVIEWING: "İnceleniyor",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  CANCELLED: "İptal Edildi",
  COMPLETED: "Tamamlandı",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  REVIEWING: "bg-sky-100 text-sky-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-stone-200 text-stone-600",
  COMPLETED: "bg-stone-200 text-stone-700",
};

const roleLabels: Record<string, string> = {
  USER: "Kullanıcı",
  SHELTER_ADMIN: "Barınak Yetkilisi",
  MUNICIPALITY_ADMIN: "Belediye Yöneticisi",
  MODERATOR: "Moderatör",
  SUPER_ADMIN: "Süper Yönetici",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const { user, status: authStatus } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [users, setUsers] = useState<ShelterUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [appFilter, setAppFilter] = useState("");
  const [shelterMode, setShelterMode] = useState<"list" | "create" | "edit">("list");
  const [editingShelter, setEditingShelter] = useState<Shelter | null>(null);
  const [shelterSaving, setShelterSaving] = useState(false);
  const [shelterError, setShelterError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchTab = useCallback(async (t: Tab) => {
    setLoading(true);
    try {
      if (t === "overview") {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setOverview(data);
      } else if (t === "applications") {
        const url = appFilter ? `/api/admin/applications?status=${appFilter}` : "/api/admin/applications";
        const res = await fetch(url);
        const data = await res.json();
        setApplications(data.applications ?? []);
      } else if (t === "shelters") {
        const res = await fetch("/api/admin/shelters");
        const data = await res.json();
        setShelters(data.shelters ?? []);
      } else if (t === "users") {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.users ?? []);
      } else if (t === "audit") {
        const res = await fetch("/api/admin/audit");
        const data = await res.json();
        setAuditLogs(data.logs ?? []);
      }
    } catch {
      // sessiz
    } finally {
      setLoading(false);
    }
  }, [appFilter]);

  useEffect(() => {
    if (authStatus === "authenticated" && user) fetchTab(tab);
  }, [authStatus, user, tab, fetchTab]);

  const handleApplicationStatus = async (applicationId: string, newStatus: string) => {
    setActionLoading(applicationId);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleShelterSubmit = async (data: Record<string, unknown>) => {
    setShelterSaving(true);
    setShelterError(null);
    try {
      const isEdit = shelterMode === "edit" && editingShelter;
      const res = await fetch("/api/admin/shelters", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "İşlem başarısız.");
      }
      setShelterMode("list");
      setEditingShelter(null);
      fetchTab("shelters");
    } catch (err) {
      setShelterError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setShelterSaving(false);
    }
  };

  const handleShelterDelete = async (shelterId: string) => {
    setActionLoading(shelterId);
    try {
      const res = await fetch("/api/admin/shelters", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shelterId }),
      });
      if (res.ok) {
        setShelters((prev) => prev.filter((s) => s.id !== shelterId));
        setDeleteConfirm(null);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleShelterVerify = async (shelterId: string, verified: boolean) => {
    setActionLoading(shelterId);
    try {
      const res = await fetch("/api/admin/shelters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shelterId, verified }),
      });
      if (res.ok) {
        setShelters((prev) =>
          prev.map((s) =>
            s.id === shelterId ? { ...s, verified, verificationStatus: verified ? "VERIFIED" : "UNVERIFIED" } : s
          )
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-sm text-stone-500">Yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "SUPER_ADMIN") {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-stone-950">Erişim Engellendi</h1>
          <p className="mt-2 text-sm text-stone-600">Bu sayfaya yalnızca süper yöneticiler erişebilir.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            Ana Sayfaya Dön
          </Link>
        </div>
      </main>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Genel Bakış" },
    { key: "applications", label: "Başvurular" },
    { key: "shelters", label: "Barınaklar" },
    { key: "users", label: "Kullanıcılar" },
    { key: "audit", label: "İşlem Geçmişi" },
  ];

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Süper Admin Paneli</p>
              <h1 className="mt-1 text-2xl font-bold text-stone-950">PatiYuva Yönetim Merkezi</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                {user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
              </span>
              <span className="text-sm font-medium text-stone-700">{user.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex gap-1 rounded-xl border border-stone-200 bg-white p-1 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
                tab === t.key ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && overview && (
          <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card label="Toplam Kullanıcı" value={overview.stats.totalUsers} />
              <Card label="Toplam Hayvan" value={overview.stats.totalAnimals} accent />
              <Card label="Toplam Barınak" value={overview.stats.totalShelters} />
              <Card label="Toplam Başvuru" value={overview.stats.totalApplications} />
              <Card label="Müsait Hayvan" value={overview.stats.availableAnimals} accent />
              <Card label="Bekleyen Başvuru" value={overview.stats.pendingApplications} warn />
              <Card label="Bu Ay Sahiplendirilen" value={overview.stats.adoptedThisMonth} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <h3 className="font-bold text-stone-950 mb-3">Tür Dağılımı</h3>
                {overview.animalsBySpecies.map((item) => (
                  <div key={item.species} className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0">
                    <span className="text-sm text-stone-700">{item.species}</span>
                    <span className="text-sm font-bold text-stone-950">{item.count}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <h3 className="font-bold text-stone-950 mb-3">Başvuru Durumları</h3>
                {overview.applicationsByStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[item.status] ?? "bg-stone-100 text-stone-700"}`}>
                      {statusLabels[item.status] ?? item.status}
                    </span>
                    <span className="text-sm font-bold text-stone-950">{item.count}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <h3 className="font-bold text-stone-950 mb-3">Şehir Dağılımı</h3>
                {overview.animalsByCity.slice(0, 8).map((item) => (
                  <div key={item.city} className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0">
                    <span className="text-sm text-stone-700">{item.city}</span>
                    <span className="text-sm font-bold text-stone-950">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "applications" && (
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {["", "PENDING", "REVIEWING", "APPROVED", "REJECTED", "CANCELLED"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setAppFilter(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    appFilter === s ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"
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
                  <div key={app.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      {app.animal?.imageUrls?.[0] && (
                        <Image src={app.animal.imageUrls[0]} alt={app.animal.name} width={56} height={56} className="rounded-xl object-cover" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-stone-950">
                              {app.animal?.name ?? "Hayvan"} — {app.userName}
                            </p>
                            <p className="text-xs text-stone-500">
                              {app.shelter?.name ?? "Barınak"} · {formatDate(app.createdAt)} · {app.city}
                            </p>
                          </div>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[app.status] ?? "bg-stone-100 text-stone-700"}`}>
                            {statusLabels[app.status] ?? app.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-stone-600 line-clamp-1">{app.reason}</p>
                        {(app.status === "PENDING" || app.status === "REVIEWING") && (
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              disabled={actionLoading === app.id}
                              onClick={() => handleApplicationStatus(app.id, "APPROVED")}
                              className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Onayla
                            </button>
                            <button
                              type="button"
                              disabled={actionLoading === app.id}
                              onClick={() => handleApplicationStatus(app.id, "REJECTED")}
                              className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              Reddet
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "shelters" && (
          <div>
            {shelterMode === "list" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-stone-500">{shelters.length} barınak</p>
                  <button
                    type="button"
                    onClick={() => { setShelterMode("create"); setEditingShelter(null); setShelterError(null); }}
                    className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    + Barınak Ekle
                  </button>
                </div>

                {shelters.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
                    <p className="text-sm text-stone-500">Barınak bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shelters.map((s) => (
                      <div key={s.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-stone-950">{s.name}</h3>
                              {s.verified && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">DOĞRULANMIŞ</span>
                              )}
                              {s.isDemo && (
                                <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-600">DEMO</span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500">{s.city} · {s.district}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-stone-500">
                            <span>{s.animalCount} hayvan</span>
                            <span>{s.applicationCount} başvuru</span>
                            <span>{s.adminCount} admin</span>
                            <button
                              type="button"
                              disabled={actionLoading === s.id}
                              onClick={() => handleShelterVerify(s.id, !s.verified)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                                s.verified
                                  ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                              } disabled:opacity-50`}
                            >
                              {s.verified ? "Doğrulamayı Kaldır" : "Doğrula"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingShelter(s);
                                setShelterMode("edit");
                                setShelterError(null);
                              }}
                              className="rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                            >
                              Düzenle
                            </button>
                            {deleteConfirm === s.id ? (
                              <>
                                <button
                                  type="button"
                                  disabled={actionLoading === s.id}
                                  onClick={() => handleShelterDelete(s.id)}
                                  className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                  {actionLoading === s.id ? "Siliniyor..." : "Evet, Sil"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirm(null)}
                                  className="rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                                >
                                  Vazgeç
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirm(s.id)}
                                className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                              >
                                Sil
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {(shelterMode === "create" || shelterMode === "edit") && (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-stone-950 mb-4">
                  {shelterMode === "create" ? "Yeni Barınak Ekle" : "Barınağı Düzenle"}
                </h3>
                {shelterError && (
                  <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{shelterError}</p>
                )}
                <ShelterForm
                  mode={shelterMode}
                  initialData={editingShelter ? { ...editingShelter, capacity: editingShelter.capacity != null ? String(editingShelter.capacity) : undefined } : undefined}
                  onSubmit={handleShelterSubmit}
                  onCancel={() => { setShelterMode("list"); setEditingShelter(null); setShelterError(null); }}
                  loading={shelterSaving}
                />
              </div>
            )}
          </div>
        )}

        {tab === "users" && (
          <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-stone-200 bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-stone-700">Kullanıcı</th>
                    <th className="px-4 py-3 font-semibold text-stone-700">E-posta</th>
                    <th className="px-4 py-3 font-semibold text-stone-700">Rol</th>
                    <th className="px-4 py-3 font-semibold text-stone-700">Kayıt</th>
                    <th className="px-4 py-3 font-semibold text-stone-700">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-stone-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-stone-950">{u.name}</td>
                      <td className="px-4 py-3 text-stone-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-700">
                          {roleLabels[u.role] ?? u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-500">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          disabled={actionLoading === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs font-semibold text-stone-700 disabled:opacity-50"
                        >
                          <option value="USER">Kullanıcı</option>
                          <option value="SHELTER_ADMIN">Barınak Yetkilisi</option>
                          <option value="MUNICIPALITY_ADMIN">Belediye Yöneticisi</option>
                          <option value="MODERATOR">Moderatör</option>
                          <option value="SUPER_ADMIN">Süper Yönetici</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "audit" && (
          <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-stone-200 bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-stone-700">Tarih</th>
                    <th className="px-4 py-3 font-semibold text-stone-700">Kullanıcı</th>
                    <th className="px-4 py-3 font-semibold text-stone-700">İşlem</th>
                    <th className="px-4 py-3 font-semibold text-stone-700">Detay</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-stone-100 last:border-0">
                      <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                      <td className="px-4 py-3 font-medium text-stone-950">{log.actorName}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-600 max-w-xs truncate">{log.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Card({ label, value, accent, warn }: { label: string; value: number; accent?: boolean; warn?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-emerald-200 bg-emerald-50" : warn ? "border-amber-200 bg-amber-50" : "border-stone-200 bg-white"}`}>
      <p className="text-2xl font-bold text-stone-950">{value}</p>
      <p className="mt-1 text-xs font-medium text-stone-500">{label}</p>
    </div>
  );
}
