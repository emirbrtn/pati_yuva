import { ButtonLink } from "@/components/ButtonLink";
import { prisma } from "@/lib/db";

export async function Hero() {
  const totalAnimals = await prisma.animal.count({
    where: { adoptionStatus: { not: "ADOPTED" } },
  });

  const cityResults = await prisma.animal.findMany({
    select: { city: true },
    distinct: ["city"],
  });
  const cities = cityResults.length;

  return (
    <section className="bg-[#fffaf4]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:grid-cols-[1.05fr_0.95fr] sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800">
            AI destekli sahiplendirme platformu
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Bir yuva arayan dostunu bul.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            Türkiye&apos;deki barınaklarda sahiplendirilmeyi bekleyen hayvanları
            keşfet, yaşam koşullarına uygun dostunu seç ve ona sıcak bir yuva
            sun. PatiYuva, doğru hayvanın doğru insanla buluşmasını
            kolaylaştırır.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/hayvanlar">Hayvanları Keşfet</ButtonLink>
            <ButtonLink href="/barinaklar" variant="secondary">
              Barınakları Keşfet
            </ButtonLink>
          </div>
        </div>
        <div className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-emerald-800 p-6 text-white">
              <p className="text-4xl font-bold">{totalAnimals}</p>
              <p className="mt-3 text-sm leading-6 text-emerald-50">
                Yuva arayan sahiplendirme adayı listeleniyor.
              </p>
            </div>
            <div className="rounded-3xl bg-amber-100 p-6 text-stone-950">
              <p className="text-4xl font-bold">{cities}</p>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Farklı şehirdeki barınak ve ilanlar tek çatı altında.
              </p>
            </div>
            <div className="rounded-3xl bg-stone-100 p-6 text-stone-950 sm:col-span-2">
              <p className="text-lg font-bold">
                Barınaktan yuvaya daha bilinçli bir yol.
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Her hayvanın sağlık ve karakter bilgisi şeffaf şekilde
                paylaşılır; sahiplenme kararını güvenle verirsin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
