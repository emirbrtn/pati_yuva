"use client";

import { useState, useEffect } from "react";

type AnimalFormData = {
  name: string;
  species: string;
  breed: string;
  gender: string;
  age: string;
  ageGroup: string;
  size: string;
  color: string;
  city: string;
  district: string;
  description: string;
  character: string;
  energyLevel: string;
  healthDescription: string;
  imageUrls: string;
};

type AnimalFormProps = {
  initialData?: Partial<AnimalFormData> & { id?: string };
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  mode: "create" | "edit";
};

const speciesList = ["Kedi", "Köpek", "Diğer"];
const genderList = ["Dişi", "Erkek"];
const ageGroupList = ["Yavru", "Genç", "Yetişkin", "Yaşlı"];
const sizeList = ["Küçük", "Orta", "Büyük"];
const energyList = ["Düşük", "Orta", "Yüksek"];
const cityList = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara",
  "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman",
  "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
  "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne",
  "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
  "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir",
  "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri",
  "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya",
  "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde",
  "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt",
  "Sinop", "Sivas", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli",
  "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
];

export function AnimalForm({ initialData, onSubmit, onCancel, loading, mode }: AnimalFormProps) {
  const [form, setForm] = useState<AnimalFormData>({
    name: "",
    species: "Kedi",
    breed: "",
    gender: "Dişi",
    age: "",
    ageGroup: "Genç",
    size: "Orta",
    color: "",
    city: "İstanbul",
    district: "",
    description: "",
    character: "",
    energyLevel: "Orta",
    healthDescription: "",
    imageUrls: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        species: initialData.species ?? "Kedi",
        breed: initialData.breed ?? "",
        gender: initialData.gender ?? "Dişi",
        age: initialData.age ?? "",
        ageGroup: initialData.ageGroup ?? "Genç",
        size: initialData.size ?? "Orta",
        color: initialData.color ?? "",
        city: initialData.city ?? "İstanbul",
        district: initialData.district ?? "",
        description: initialData.description ?? "",
        character: initialData.character ?? "",
        energyLevel: initialData.energyLevel ?? "Orta",
        healthDescription: initialData.healthDescription ?? "",
        imageUrls: Array.isArray(initialData.imageUrls)
          ? (initialData.imageUrls as string[]).join("\n")
          : typeof initialData.imageUrls === "string"
            ? initialData.imageUrls
            : "",
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof AnimalFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrls = form.imageUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    await onSubmit({
      ...(initialData?.id ? { id: initialData.id } : {}),
      ...form,
      imageUrls,
    });
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-700 outline-none focus:border-emerald-700";
  const selectClass =
    "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-700 outline-none focus:border-emerald-700 appearance-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Ad *</span>
          <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required className={inputClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Tür *</span>
          <select value={form.species} onChange={(e) => handleChange("species", e.target.value)} className={selectClass}>
            {speciesList.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Irk</span>
          <input type="text" value={form.breed} onChange={(e) => handleChange("breed", e.target.value)} placeholder="ör: Golden Retriever" className={inputClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Cinsiyet *</span>
          <select value={form.gender} onChange={(e) => handleChange("gender", e.target.value)} className={selectClass}>
            {genderList.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Yaş</span>
          <input type="text" value={form.age} onChange={(e) => handleChange("age", e.target.value)} placeholder="ör: 2 yaş" className={inputClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Yaş Grubu *</span>
          <select value={form.ageGroup} onChange={(e) => handleChange("ageGroup", e.target.value)} className={selectClass}>
            {ageGroupList.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Boyut *</span>
          <select value={form.size} onChange={(e) => handleChange("size", e.target.value)} className={selectClass}>
            {sizeList.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Renk</span>
          <input type="text" value={form.color} onChange={(e) => handleChange("color", e.target.value)} placeholder="ör: Sarı" className={inputClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Şehir *</span>
          <select value={form.city} onChange={(e) => handleChange("city", e.target.value)} className={selectClass}>
            {cityList.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">İlçe</span>
          <input type="text" value={form.district} onChange={(e) => handleChange("district", e.target.value)} className={inputClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Enerji Seviyesi</span>
          <select value={form.energyLevel} onChange={(e) => handleChange("energyLevel", e.target.value)} className={selectClass}>
            {energyList.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </label>
      </div>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold text-stone-700">Açıklama *</span>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold text-stone-700">Karakter</span>
        <textarea
          value={form.character}
          onChange={(e) => handleChange("character", e.target.value)}
          rows={2}
          placeholder="ör: Sakin, sevecen, çocuklarla iyi anlaşır"
          className={`${inputClass} resize-none`}
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold text-stone-700">Sağlık Bilgisi</span>
        <textarea
          value={form.healthDescription}
          onChange={(e) => handleChange("healthDescription", e.target.value)}
          rows={2}
          placeholder="ör: Aşıları tam, kısırlaştırılmış"
          className={`${inputClass} resize-none`}
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold text-stone-700">Fotoğraf URL&apos;leri (satır satır, en fazla 5)</span>
        <textarea
          value={form.imageUrls}
          onChange={(e) => handleChange("imageUrls", e.target.value)}
          rows={3}
          placeholder="https://example.com/foto1.jpg&#10;https://example.com/foto2.jpg"
          className={`${inputClass} resize-none`}
        />
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : mode === "create" ? "Hayvanı Ekle" : "Değişiklikleri Kaydet"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
