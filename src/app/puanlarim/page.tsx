"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Points = {
  total: number;
  spent: number;
  available: number;
};

type Transaction = {
  id: string;
  amount: number;
  type: string;
  description: string;
  sponsorName?: string;
  createdAt: string;
};

const typeLabels: Record<string, string> = {
  EARNED: "Kazanıldı",
  REDEEMED: "Kullanıldı",
  EXPIRED: "Süresi Doldu",
  ADJUSTED: "Düzenlendi",
};

const typeStyles: Record<string, string> = {
  EARNED: "bg-emerald-100 text-emerald-800",
  REDEEMED: "bg-amber-100 text-amber-800",
  EXPIRED: "bg-red-100 text-red-700",
  ADJUSTED: "bg-stone-200 text-stone-700",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PointsPage() {
  const { user, status: authStatus } = useAuth();
  const [points, setPoints] = useState<Points | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus !== "authenticated" || !user) return;
    setLoading(true);
    fetch("/api/me/points")
      .then((r) => r.json())
      .then((d) => {
        setPoints(d.points);
        setTransactions(d.transactions ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authStatus, user]);

  if (authStatus === "loading" || loading) {
    return (
      <main className="bg-[#fffaf4]">
        <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
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
          <p className="mt-2 text-sm text-stone-600">Puanlarınızı görmek için giriş yapmalısınız.</p>
          <Link href="/giris" className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            Giriş Yap
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#fffaf4]">
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="space-y-8">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl font-bold text-stone-950">⭐ Puanlarım</h1>
            <p className="mt-2 text-sm text-stone-600">
              Puanlarını anlaşmalı sponsorlarda indirim olarak kullan.
            </p>

            {points && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-800">{points.available}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">Kullanılabilir Puan</p>
                </div>
                <div className="rounded-2xl bg-stone-100 p-4 text-center">
                  <p className="text-3xl font-bold text-stone-800">{points.total}</p>
                  <p className="mt-1 text-xs font-semibold text-stone-600">Toplam Kazanılan</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4 text-center">
                  <p className="text-3xl font-bold text-amber-800">{points.spent}</p>
                  <p className="mt-1 text-xs font-semibold text-amber-700">Kullanılan</p>
                </div>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-sm font-semibold text-emerald-900">Puan Nasıl Kazanılır?</p>
              <ul className="mt-2 space-y-1 text-sm text-emerald-800">
                <li>🐾 <strong>Hayvan sahiplen:</strong> +500 puan</li>
                <li>💰 <strong>Bağış yap:</strong> Her 10₺ için +10 puan</li>
                <li>📝 <strong>Başvuru yap:</strong> +25 puan</li>
                <li>⭐ <strong>Doğrulanmış hesap:</strong> +50 puan</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-950 mb-4">İşlem Geçmişi</h2>

            {transactions.length === 0 ? (
              <p className="text-sm text-stone-500">Henüz işlem yapılmamış.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-xl border border-stone-200 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-stone-950 truncate">{t.description}</p>
                      <p className="text-xs text-stone-500">{formatDate(t.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typeStyles[t.type] ?? "bg-stone-100 text-stone-700"}`}>
                        {typeLabels[t.type] ?? t.type}
                      </span>
                      <span className={`text-sm font-bold ${t.amount > 0 ? "text-emerald-700" : "text-red-600"}`}>
                        {t.amount > 0 ? "+" : ""}{t.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Link href="/sponsorlar" className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
              Anlaşmalı Mağazaları Keşfet →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
