"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setResetUrl(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bir hata oluştu.");
      setMessage(data.message);
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf4] px-4">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-stone-950">Şifremi Unuttum</h1>
          <p className="mt-2 text-sm text-stone-600">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
            <p>{message}</p>
            {resetUrl && (
              <div className="mt-3">
                <p className="text-xs text-emerald-600 mb-2">Geliştirme modunda — bağlantı:</p>
                <a href={resetUrl} className="break-all text-xs font-mono underline text-emerald-700">
                  {resetUrl}
                </a>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-stone-700">E-posta</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ornek@email.com"
                className="h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm outline-none focus:border-emerald-700"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/giris" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </main>
  );
}
