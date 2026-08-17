"use client";

import { useState, useEffect } from "react";

type ShelterFormData = {
  name: string;
  description: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  workingHours: string;
  imageUrl: string;
  capacity: string;
};

type ShelterFormProps = {
  initialData?: Partial<ShelterFormData> & { id?: string };
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  mode: "create" | "edit";
};

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

export function ShelterForm({ initialData, onSubmit, onCancel, loading, mode }: ShelterFormProps) {
  const [form, setForm] = useState<ShelterFormData>({
    name: "",
    description: "",
    city: "İstanbul",
    district: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    workingHours: "",
    imageUrl: "",
    capacity: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        city: initialData.city ?? "İstanbul",
        district: initialData.district ?? "",
        address: initialData.address ?? "",
        phone: initialData.phone ?? "",
        email: initialData.email ?? "",
        website: initialData.website ?? "",
        workingHours: initialData.workingHours ?? "",
        imageUrl: initialData.imageUrl ?? "",
        capacity: initialData.capacity != null ? String(initialData.capacity) : "",
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof ShelterFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...(initialData?.id ? { id: initialData.id } : {}),
      ...form,
      capacity: form.capacity ? parseInt(form.capacity, 10) : null,
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
          <span className="text-xs font-semibold text-stone-700">Barınak Adı *</span>
          <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required className={inputClass} />
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
          <span className="text-xs font-semibold text-stone-700">Kapasite</span>
          <input type="number" value={form.capacity} onChange={(e) => handleChange("capacity", e.target.value)} placeholder="ör: 50" min={0} className={inputClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Telefon</span>
          <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="0XX XXX XX XX" className={inputClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">E-posta</span>
          <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Web Sitesi</span>
          <input type="url" value={form.website} onChange={(e) => handleChange("website", e.target.value)} placeholder="https://..." className={inputClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-stone-700">Çalışma Saatleri</span>
          <input type="text" value={form.workingHours} onChange={(e) => handleChange("workingHours", e.target.value)} placeholder="ör: Her gün 09:00-18:00" className={inputClass} />
        </label>
      </div>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold text-stone-700">Adres</span>
        <input type="text" value={form.address} onChange={(e) => handleChange("address", e.target.value)} className={inputClass} />
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold text-stone-700">Açıklama</span>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold text-stone-700">Kapak Fotoğrafı URL&apos;si</span>
        <input type="url" value={form.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} placeholder="https://..." className={inputClass} />
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : mode === "create" ? "Barınak Ekle" : "Değişiklikleri Kaydet"}
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
