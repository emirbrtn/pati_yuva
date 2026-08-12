"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-700 outline-none focus:border-emerald-700";

  return (
    <main className="bg-[#fffaf4]">
      <section className="mx-auto max-w-md px-4 py-16 sm:py-20 sm:px-6">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-stone-950">Giriş Yap</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Favorilerini görüntülemek ve sahiplenme başvurusu oluşturmak için
            giriş yap.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error ? (
              <p
                role="alert"
                className="rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-700"
              >
                {error}
              </p>
            ) : null}
            <label className="space-y-2 text-sm font-semibold text-stone-800">
              <span>E-posta</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className={inputClass}
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-800">
              <span>Şifre</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 min-h-12 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-600">
            Hesabın yok mu?{" "}
            <Link href="/kayit" className="font-semibold text-emerald-700 hover:underline">
              Kayıt Ol
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-stone-600">
            Şifreni mi unuttun?{" "}
            <Link href="/sifremi-unuttum" className="font-semibold text-emerald-700 hover:underline">
              Sıfırla
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}