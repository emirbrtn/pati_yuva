"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Animal } from "@/types/animal";

type AdoptionFormProps = {
  animal: Animal;
};

export function AdoptionForm({ animal }: AdoptionFormProps) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      animalId: animal.id,
      phone: String(formData.get("phone") ?? ""),
      city: String(formData.get("city") ?? ""),
      houseType: String(formData.get("houseType") ?? ""),
      hasGarden: formData.get("hasGarden") === "yes",
      previousExperience: formData.get("previousExperience") === "yes",
      hasOtherPets: formData.get("hasOtherPets") === "yes",
      reason: String(formData.get("reason") ?? ""),
      availableTime: String(formData.get("availableTime") ?? ""),
      note: String(formData.get("note") ?? ""),
    };

    try {
      const response = await fetch("/api/me/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Başvuru gönderilemedi.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Başvuru gönderilemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-xl font-bold text-stone-950">
          Başvurun alındı
        </p>
        <p className="mt-2 text-sm leading-6 text-stone-700">
          {animal.name} için sahiplenme başvurun <strong>Beklemede</strong>{" "}
          durumundadır. Barınak başvurunu inceledikçe seninle iletişime
          geçecektir. Durumu{" "}
          <a href="/basvurularim" className="font-semibold text-emerald-800 hover:underline">
            Başvurularım
          </a>{" "}
          sayfasından takip edebilirsin.
        </p>
      </div>
    );
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-700 outline-none focus:border-emerald-700";
  const textareaClass =
    "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <p
          role="alert"
          className="rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}
      <p className="rounded-2xl bg-stone-100 p-3 text-sm text-stone-600">
        Başvuru <strong>{user?.name}</strong> ({user?.email}) adına
        oluşturulacak.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-semibold text-stone-800">
          <span>Telefon</span>
          <input name="phone" type="tel" required className={inputClass} />
        </label>
        <label className="space-y-1.5 text-sm font-semibold text-stone-800">
          <span>Yaşadığın şehir</span>
          <input name="city" required className={inputClass} />
        </label>
        <label className="space-y-1.5 text-sm font-semibold text-stone-800">
          <span>Ev tipi</span>
          <select name="houseType" required className={inputClass}>
            <option value="">Seç</option>
            <option>Apartman dairesi</option>
            <option>Müstakil ev</option>
            <option>Site içi daire</option>
            <option>Öğrenci / paylaşımlı</option>
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-semibold text-stone-800">
          <span>Bahçe var mı?</span>
          <select name="hasGarden" required className={inputClass}>
            <option value="no">Hayır</option>
            <option value="yes">Evet</option>
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-semibold text-stone-800">
          <span>Daha önce hayvan baktın mı?</span>
          <select name="previousExperience" required className={inputClass}>
            <option value="yes">Evet</option>
            <option value="no">Hayır</option>
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-semibold text-stone-800">
          <span>Evde başka hayvan var mı?</span>
          <select name="hasOtherPets" required className={inputClass}>
            <option value="no">Hayır</option>
            <option value="yes">Evet</option>
          </select>
        </label>
      </div>
      <label className="space-y-1.5 text-sm font-semibold text-stone-800">
        <span>Neden sahiplenmek istiyorsun?</span>
        <textarea name="reason" required rows={3} className={textareaClass} />
      </label>
      <label className="space-y-1.5 text-sm font-semibold text-stone-800">
        <span>Hayvana ayırabileceğin zaman</span>
        <input name="availableTime" required className={inputClass} />
      </label>
      <label className="space-y-1.5 text-sm font-semibold text-stone-800">
        <span>Ek açıklama (isteğe bağlı)</span>
        <textarea name="note" rows={2} className={textareaClass} />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
      >
        {submitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </button>
    </form>
  );
}