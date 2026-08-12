import { SectionHeader } from "@/components/SectionHeader";

const steps = [
  {
    title: "Dostunu keşfet",
    text: "Barınaklardaki hayvanları şehir, tür, yaş ve özelliklere göre filtrele.",
  },
  {
    title: "Hikayesini incele",
    text: "Karakter, sağlık ve ihtiyaç bilgilerini detay sayfasından oku.",
  },
  {
    title: "Sahiplenme başvurusu oluştur",
    text: "Yaşam koşullarına uygun olduğunu başvuru formuyla belirt.",
  },
  {
    title: "Yeni dostuna kavuş",
    text: "Barınakla iletişime geç, görüşme planla ve yeni yuvana birlikte başla.",
  },
];

const shelterSteps = [
  {
    title: "Barınağını tanıt",
    text: "Profil oluşturarak hayvanlarını ve çalışma bilgilerini paylaş.",
  },
  {
    title: "Hayvanlarını listele",
    text: "Güncel fotoğraf, sağlık ve karakter bilgileriyle ilanlarını yönet.",
  },
  {
    title: "Başvuruları değerlendir",
    text: "Gelen sahiplenme başvurularını tek panelden takip et.",
  },
];

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Nasıl çalışır?"
          title="Sahiplenme yolculuğu sade ve anlaşılır."
          description="Dört adımda, barınaktaki bir dostun evine giden yolu planla."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-3xl border border-stone-200 bg-[#fffaf4] p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl font-bold text-stone-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{step.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-emerald-900 p-8 text-white sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
                Barınaklar için
              </p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Platforma nasıl dahil olabilirsiniz?
              </h2>
              <p className="mt-4 text-sm leading-7 text-emerald-50">
                Barınağınızı PatiYuva’ya ekleyerek hayvanlarınızı daha geniş bir
                kitleye ulaştırabilir, gelen başvuruları yönetebilirsiniz. Bu
                alan ilerleyen sürümlerde barınak yönetimi ile büyüyecek.
              </p>
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
      </div>
    </section>
  );
}