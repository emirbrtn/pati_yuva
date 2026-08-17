"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AccountSettingsPage() {
  const { user, status, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Şifre değiştirme
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const name = String(formData.get("name") ?? "");
    const phone = String(formData.get("phone") ?? "");

    try {
      const response = await fetch("/api/me/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Güncelleme başarısız.");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Güncelleme başarısız.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSaved(false);

    if (newPassword !== newPasswordConfirm) {
      setPasswordError("Yeni şifreler eşleşmiyor.");
      return;
    }

    setSavingPassword(true);

    try {
      const response = await fetch("/api/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Şifre güncellenemedi.");
      }

      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Şifre güncellenemedi.");
    } finally {
      setSavingPassword(false);
    }
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
        <div className="space-y-8">
          {/* Profil Bilgileri */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl font-bold text-stone-950">Hesap Ayarları</h1>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Kişisel bilgilerini ve hesap tercihlerini yönet.
            </p>

            <form onSubmit={handleProfileSubmit} className="mt-8 space-y-4">
              {error ? (
                <p className="rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              ) : null}
              {saved ? (
                <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                  Profil güncellendi.
                </p>
              ) : null}
              <label className="space-y-2 text-sm font-semibold text-stone-800">
                <span>Ad Soyad</span>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name}
                  required
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
              <label className="space-y-2 text-sm font-semibold text-stone-800">
                <span>Telefon</span>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={user.phone ?? ""}
                  placeholder="05XX XXX XX XX"
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="mt-2 min-h-12 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </button>
            </form>
          </div>

          {/* Şifre Değiştirme */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-950">Şifre Değiştir</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Hesap güvenliğiniz için düzenli olarak şifrenizi güncelleyin.
            </p>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
              {passwordError ? (
                <p className="rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-700">
                  {passwordError}
                </p>
              ) : null}
              {passwordSaved ? (
                <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                  Şifreniz güncellendi.
                </p>
              ) : null}
              <label className="space-y-2 text-sm font-semibold text-stone-800">
                <span>Mevcut Şifre</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={inputClass}
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-stone-800">
                <span>Yeni Şifre</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-stone-800">
                <span>Yeni Şifre Tekrar</span>
                <input
                  type="password"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                disabled={savingPassword}
                className="mt-2 min-h-12 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
              >
                {savingPassword ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
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
