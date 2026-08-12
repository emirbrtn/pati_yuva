"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-700 outline-none focus:border-emerald-700";

  return (
    <main className="bg-[#fffaf4]">
      <section className="mx-auto max-w-md px-4 py-16 sm:py-20 sm:px-6">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-stone-950">Şifremi Unuttum</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            E-posta adresini gir; şifre sıfırlama adımlarını sana iletelim.
          </p>

          {submitted ? (
            <div className="mt-8 space-y-4">
              <p className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                Talebin alındı. <strong>{email}</strong> adresine şifre
                sıfırlama bağlantısı gönderilir. Bu özellik şu an için demo
                akıştır; yakında e-posta entegrasyonuyla aktifleşecek.
              </p>
              <Link
                href="/giris"
                className="inline-flex rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Giriş Yap
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              <button
                type="submit"
                className="mt-2 min-h-12 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Sıfırlama Bağlantısı Gönder
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-stone-600">
            Aklına şifren geldi mi?{" "}
            <Link href="/giris" className="font-semibold text-emerald-700 hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}