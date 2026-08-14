"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (!kvkk || !terms) {
      setError("KVKK ve kullanım koşullarını kabul etmelisiniz.");
      return;
    }

    setSubmitting(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      await register({ name, email, password, phone });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız.");
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
          <h1 className="text-2xl font-bold text-stone-950">Kayıt Ol</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Favorilerini kaydetmek, başvurularını takip etmek ve sahiplenme
            sürecine katılmak için hesap oluştur.
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
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-stone-800">
                <span>Ad</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                  autoComplete="given-name"
                  className={inputClass}
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-stone-800">
                <span>Soyad</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                  autoComplete="family-name"
                  className={inputClass}
                />
              </label>
            </div>
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
              <span>Telefon (isteğe bağlı)</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                placeholder="05XX XXX XX XX"
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
                minLength={6}
                autoComplete="new-password"
                className={inputClass}
              />
              <span className="block text-xs font-normal text-stone-500">
                En az 6 karakter olmalıdır.
              </span>
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-800">
              <span>Şifre tekrar</span>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className={inputClass}
              />
            </label>

            <div className="space-y-3 pt-2">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={kvkk}
                  onChange={(event) => setKvkk(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-emerald-700"
                />
                <span className="text-xs leading-5 text-stone-600">
                  Kişisel verilerimin{" "}
                  <Link href="/kvkk" className="font-semibold text-emerald-800 hover:underline">
                    Aydınlatma Metni
                  </Link>{" "}
                  kapsamında işlenmesini kabul ediyorum.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(event) => setTerms(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-emerald-700"
                />
                <span className="text-xs leading-5 text-stone-600">
                 {" "}
                  <Link href="/kullanim-kosullari" className="font-semibold text-emerald-800 hover:underline">
                    Kullanım Koşulları
                  </Link>{" "}
                  &apos;ni okudum ve kabul ediyorum.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 min-h-12 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Oluşturuluyor..." : "Hesap Oluştur"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-600">
            Zaten hesabın var mı?{" "}
            <Link href="/giris" className="font-semibold text-emerald-700 hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
