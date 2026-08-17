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

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<string | null>(null);

  // E-posta doğrulama
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);

  // Hesap silme
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleAvatarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvatarLoading(true);
    setAvatarMsg(null);
    try {
      const res = await fetch("/api/me/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Güncelleme başarısız.");
      }
      setAvatarMsg("Profil fotoğrafı güncellendi.");
      setTimeout(() => setAvatarMsg(null), 3000);
    } catch (err) {
      setAvatarMsg(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setVerifyLoading(true);
    setVerifyMsg(null);
    try {
      const res = await fetch("/api/auth/send-verification", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bir hata oluştu.");
      setVerifyMsg(data.message ?? "Doğrulama bağlantısı gönderildi.");
    } catch (err) {
      setVerifyMsg(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/me/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: deleteConfirm }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Silme başarısız.");
      }
      await logout();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setDeleteLoading(false);
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

          {/* Profil Fotoğrafı */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-950">Profil Fotoğrafı</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Profil fotoğrafınızı bir URL ile güncelleyin.
            </p>

            <form onSubmit={handleAvatarSubmit} className="mt-6 space-y-4">
              {avatarMsg && (
                <p className={`rounded-2xl p-3 text-sm font-medium ${
                  avatarMsg.includes("hata") || avatarMsg.includes("başarısız")
                    ? "bg-red-50 text-red-700"
                    : "bg-emerald-50 text-emerald-800"
                }`}>
                  {avatarMsg}
                </p>
              )}
              <label className="space-y-2 text-sm font-semibold text-stone-800">
                <span>Fotoğraf URL&apos;i</span>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://ornek.com/foto.jpg"
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                disabled={avatarLoading}
                className="mt-2 min-h-12 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
              >
                {avatarLoading ? "Kaydediliyor..." : "Fotoğrafı Güncelle"}
              </button>
            </form>
          </div>

          {/* E-posta Doğrulama */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-950">E-posta Doğrulama</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Hesabınızın güvenliğini doğrulamak için e-postanızı doğrulayın.
            </p>

            <div className="mt-6">
              {verifyMsg && (
                <p className="mb-4 rounded-2xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                  {verifyMsg}
                </p>
              )}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-700">
                    E-posta: <span className="text-stone-950">{user.email}</span>
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {user.emailVerified ? "Doğrulanmış ✓" : "Doğrulanmamış"}
                  </p>
                </div>
                {!user.emailVerified && (
                  <button
                    type="button"
                    disabled={verifyLoading}
                    onClick={handleSendVerification}
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                  >
                    {verifyLoading ? "Gönderiliyor..." : "Doğrulama Bağlantısı Gönder"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Hesabı Sil */}
          <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-red-700">Hesabı Sil</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Hesabınızı silmek geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
            </p>

            <div className="mt-6 space-y-4">
              {deleteError && (
                <p className="rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-700">
                  {deleteError}
                </p>
              )}
              <label className="space-y-2 text-sm font-semibold text-stone-800">
                <span>
                  Onaylamak için <code className="bg-stone-100 px-1 py-0.5 rounded text-red-600">HESABIMI_SIL</code> yazın
                </span>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="HESABIMI_SIL"
                  className={`${inputClass} border-red-300 focus:border-red-600`}
                />
              </label>
              <button
                type="button"
                disabled={deleteLoading || deleteConfirm !== "HESABIMI_SIL"}
                onClick={handleDeleteAccount}
                className="mt-2 min-h-12 w-full rounded-full bg-red-700 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-50"
              >
                {deleteLoading ? "Siliniyor..." : "Hesabımı Sil"}
              </button>
            </div>
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
