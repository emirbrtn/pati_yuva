import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Nasıl Çalışır? | PatiYuva",
  description:
    "PatiYuva ile sahiplendirme nasıl işler? Dört adımda dostunu keşfet, incele, başvur ve yeni yuvana kavuş.",
};

const steps = [
  {
    title: "Dostunu keşfet",
    text: "Barınaklardaki hayvanları şehir, tür, yaş ve özelliklere göre filtrele. Sana uygun adayları karşılaştır.",
  },
  {
    title: "Hayvanın hikayesini ve ihtiyaçlarını incele",
    text: "Karakter, sağlık durumu, barınak bilgisi ve yaşam ihtiyaçlarını detay sayfasından oku.",
  },
  {
    title: "Sahiplenme başvurusu oluştur",
    text: "Yaşam koşullarını anlatan başvuru formunu doldur ve barınağa ilet.",
  },
  {
    title: "Barınakla iletişime geç ve yeni dostuna kavuş",
    text: "Barınak başvurunu değerlendirir, görüşme planlanır ve yeni dostun evine yolculuğa başlar.",
  },
];

const shelterSteps = [
  {
    title: "Barınağını profil oluşturarak tanıt",
    text: "Konum, iletişim ve çalışma saatlerini paylaş; doğrulanmış bir profil edin.",
  },
  {
    title: "Hayvanlarını güncel ilanlarla listele",
    text: "Fotoğraf, sağlık ve karakter bilgilerini ekle, durumu güncelle.",
  },
  {
    title: "Gelen başvuruları tek panelden yönet",
    text: "Sahiplenme başvurularını incele, süreci planla ve sonuçlandır.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="bg-[#fffaf4]">
      <section className="border-b border-stone-200 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Nasıl çalışır?"
            title="Sahiplenme yolculuğu sade ve anlaşılır."
            description="PatiYuva; barınak, hayvan ve sahiplenen kişiyi güvenli ve şeffaf bir akışta buluşturur."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-stone-200 bg-[#fffaf4] p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h2 className="mt-5 text-lg font-bold text-stone-950">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{step.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/hayvanlar"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Hayvanları Keşfet
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="rounded-3xl bg-emerald-900 p-8 text-white sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
                  Barınaklar için
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  Barınağınızı platforma nasıl dahil edersiniz?
                </h2>
                <p className="mt-4 text-sm leading-7 text-emerald-50">
                  Hayvanlarınızı daha geniş bir kitleyle buluşturun, gelen
                  başvuruları merkezi olarak yönetin. Barınak yönetimi altyapısı
                  ilerleyen sürümlerde genişletilecektir.
                </p>
                <Link
                  href="/barinaklar"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-amber-200 px-6 text-sm font-semibold text-stone-900 transition hover:bg-amber-100"
                >
                  Barınakları Keşfet
                </Link>
              </div>
              <ol className="space-y-4">
                {shelterSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4 rounded-2xl border border-white/15 bg-white/10 p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-200 text-sm font-bold text-stone-900">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-emerald-50">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}