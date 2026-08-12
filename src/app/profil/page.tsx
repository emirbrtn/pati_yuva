"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const { user, status } = useAuth();

  if (status === "loading") {
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
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Profilini görüntülemek için giriş yapmalısın.
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
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-stone-950">Profilim</h1>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Ad Soyad
              </dt>
              <dd className="mt-1 text-base font-medium text-stone-800">
                {user.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                E-posta
              </dt>
              <dd className="mt-1 text-base font-medium text-stone-800">
                {user.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Üyelik Tarihi
              </dt>
              <dd className="mt-1 text-base font-medium text-stone-800">
                {formatDate(user.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Rol
              </dt>
              <dd className="mt-1 text-base font-medium text-stone-800">
                {user.role === "USER" ? "Kullanıcı" : user.role}
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-stone-100 pt-6">
            <Link
              href="/favoriler"
              className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Favorilerim
            </Link>
            <Link
              href="/basvurularim"
              className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800"
            >
              Başvurularım
            </Link>
            <Link
              href="/hesap-ayarlari"
              className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800"
            >
              Hesap Ayarları
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}