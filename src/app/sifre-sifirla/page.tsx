"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bir hata oluştu.");
      setMessage(data.message);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-700">Geçersiz bağlantı. Token bulunamadı.</p>
        <Link href="/sifremi-unuttum" className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-900">
          Şifre sıfırlama sayfasına dön
        </Link>
      </div>
    );
  }

  return (
    <>
      {message && (
        <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
          <p>{message}</p>
          {success && (
            <Link href="/giris" className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-900">
              Giriş sayfasına git →
            </Link>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-700">Yeni Şifre</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="En az 6 karakter"
              className="h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm outline-none focus:border-emerald-700"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-700">Şifre Tekrar</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              placeholder="Şifrenizi tekrar girin"
              className="h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm outline-none focus:border-emerald-700"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? "Sıfırlanıyor..." : "Şifremi Sıfırla"}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf4] px-4">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-stone-950">Yeni Şifre Belirle</h1>
          <p className="mt-2 text-sm text-stone-600">
            Yeni şifrenizi girin.
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-stone-500">Yükleniyor...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
