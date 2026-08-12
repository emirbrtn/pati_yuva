"use client";

import Link from "next/link";
import { useState } from "react";
import { AdoptionForm } from "@/components/AdoptionForm";
import { useAuth } from "@/context/AuthContext";
import type { Animal } from "@/types/animal";

type AdoptSectionProps = {
  animal: Animal;
};

export function AdoptSection({ animal }: AdoptSectionProps) {
  const { status } = useAuth();
  const [formOpen, setFormOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-500">Yükleniyor...</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-xl font-bold text-stone-950">
          {animal.name} için sahiplenme başvurusu
        </h2>
        <p className="text-sm leading-6 text-stone-700">
          Giriş yaparak {animal.name} için sahiplenme başvurusu
          oluşturabilirsiniz. Başvurularınızı hesabınızdan takip
          edebilirsiniz.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/giris"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Giriş Yap
          </Link>
          <Link
            href="/nasil-calisir"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-900 transition hover:border-emerald-700 hover:text-emerald-800"
          >
            Nasıl Çalışır?
          </Link>
        </div>
      </div>
    );
  }

  if (!formOpen) {
    return (
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-xl font-bold text-stone-950">
          Bu Dostu Sahiplenmek İstiyorum
        </h2>
        <p className="text-sm leading-6 text-stone-700">
          Sahiplenme başvurunu oluştur; barınak başvurunu inceleyip seninle
          iletişime geçsin.
        </p>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Başvuru Oluştur
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-stone-950">
        {animal.name} için Sahiplenme Başvurusu
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        Başvurun barınağa iletilecek ve durumu hesabından takip edebileceksin.
      </p>
      <div className="mt-6">
        <AdoptionForm animal={animal} />
      </div>
    </div>
  );
}