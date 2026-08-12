import { SectionHeader } from "@/components/SectionHeader";

const benefits = [
  "Sahiplenme kararı için şeffaf sağlık ve karakter bilgisi",
  "Barınakla doğrudan iletişim kurma imkanı",
  "Ev yaşamına uygun eşleşme önerileri",
  "Sahiplenme sonrası rehberlik ve bilgilendirme",
];

export function Benefits() {
  return (
    <section className="bg-emerald-900 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Sahiplenmeyi destekler"
          title="Yeni yuvaya geçişi kolaylaştıran değerler."
          description="PatiYuva, bilinçli sahiplenme kararları almana ve dostunun ihtiyaçlarını net görmene yardımcı olur."
          tone="dark"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-3xl border border-white/15 bg-white/10 p-5 text-sm font-semibold leading-6 text-emerald-50"
            >
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}