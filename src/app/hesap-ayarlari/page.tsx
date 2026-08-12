"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AccountSettingsPage() {
  const { user, status, logout } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
  };

  const inputClass =
    "h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-700 outline-none focus:border-emerald-700";

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
            Hesap ayarlarına erişmek için giriş yapmalısın.
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
          <h1 className="text-2xl font-bold text-stone-950">Hesap Ayarları</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Kişisel bilgilerini ve hesap tercihlerini yönet.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {saved ? (
              <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                Ayarların kaydedildi.
              </p>
            ) : null}
            <label className="space-y-2 text-sm font-semibold text-stone-800">
              <span>Ad Soyad</span>
              <input
                type="text"
                defaultValue={user.name}
                className={inputClass}
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-800">
              <span>E-posta</span>
              <input
                type="email"
                defaultValue={user.email}
                disabled
                className={`${inputClass} cursor-not-allowed bg-stone-100 text-stone-500`}
              />
              <span className="block text-xs font-normal text-stone-500">
                E-posta adresi değiştirilemiyor.
              </span>
            </label>
            <div className="rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
              Şifre değişikliği bu sürümde devre dışıdır.{" "}
              <Link href="/sifremi-unuttum" className="font-semibold text-emerald-700 hover:underline">
                Şifremi Unuttum
              </Link>{" "}
              sayfasını kullanabilirsin.
            </div>
            <button
              type="submit"
              className="mt-2 min-h-12 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Değişiklikleri Kaydet
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-6">
            <Link
              href="/profil"
              className="text-sm font-semibold text-stone-600 hover:text-emerald-800"
            >
              Profilime Dön
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}