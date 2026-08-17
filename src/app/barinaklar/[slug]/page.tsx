import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ShelterAnimals } from "@/components/ShelterAnimals";
import { getShelterBySlug, getShelterStats, getAnimalsByShelterId } from "@/lib/relations";

type ShelterPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ShelterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const shelter = await getShelterBySlug(slug);

  if (!shelter) {
    return { title: "Barınak bulunamadı | PatiYuva" };
  }

  return {
    title: `${shelter.name} | PatiYuva`,
    description: shelter.description,
  };
}

export default async function ShelterPage({ params }: ShelterPageProps) {
  const { slug } = await params;
  const shelter = await getShelterBySlug(slug);

  if (!shelter) {
    notFound();
  }

  const stats = await getShelterStats(shelter.id);
  const animals = await getAnimalsByShelterId(shelter.id);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${shelter.name} ${shelter.city} ${shelter.district}`
  )}`;

  const infoItems = [
    {
      label: "Adres",
      value: shelter.address ?? "Bilgi mevcut değil",
      href: undefined,
    },
    shelter.phone
      ? {
          label: "Telefon",
          value: shelter.phone,
          href: `tel:${shelter.phone.replace(/[^+\d]/g, "")}`,
        }
      : { label: "Telefon", value: "Bilgi mevcut değil", href: undefined },
    shelter.email
      ? {
          label: "E-posta",
          value: shelter.email,
          href: `mailto:${shelter.email}`,
        }
      : { label: "E-posta", value: "Bilgi mevcut değil", href: undefined },
    {
      label: "Çalışma saatleri",
      value: shelter.workingHours ?? "Bilgi mevcut değil",
      href: undefined,
    },
  ];

  return (
    <main className="bg-[#fffaf4]">
      <section className="border-b border-stone-200 bg-white">
        <div className="relative h-56 sm:h-72 lg:h-80">
          {shelter.imageUrl ? (
            <>
              <Image
                src={shelter.imageUrl}
                alt={`${shelter.name} kapak fotoğrafı`}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-20 w-20 text-emerald-700"
                aria-hidden="true"
              >
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 21v-6h6v6" />
              </svg>
            </div>
          )}
        </div>
      </section>

      <section className="relative">
        <Container className="relative -mt-16 pb-12">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-stone-950 sm:text-4xl">
                    {shelter.name}
                  </h1>
                  {shelter.isDemo ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                      Demo Profil
                    </span>
                  ) : shelter.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      Doğrulanmış Barınak
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm font-medium text-stone-700">
                  📍 {shelter.district}, {shelter.city}
                </p>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="m9 18 6-6m0 0-6-6" />
                </svg>
                Bu barınağa yol tarifi
              </a>
            </div>

            <p className="mt-6 max-w-3xl text-base leading-7 text-stone-700">
              {shelter.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                {stats.total} sahiplendirilebilir hayvan
              </span>
              {stats.cats > 0 ? (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700">
                  {stats.cats} kedi
                </span>
              ) : null}
              {stats.dogs > 0 ? (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700">
                  {stats.dogs} köpek
                </span>
              ) : null}
              {stats.others > 0 ? (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700">
                  {stats.others} diğer
                </span>
              ) : null}
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {infoItems.map((item) => (
                <div key={item.label} className="rounded-2xl bg-stone-100 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-stone-950">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-emerald-800 hover:text-emerald-950"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 mb-3 px-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-700" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-sm font-semibold text-stone-700">Konum</p>
            </div>
            <iframe
              title={`${shelter.name} konum`}
              width="100%"
              height="350"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${shelter.name} hayvan barınağı ${shelter.district ?? ""} ${shelter.city}`
              )}&z=15&output=embed`}
              className="w-full rounded-2xl"
            />
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Bu barınaktaki dostlar
                </p>
                <h2 className="mt-2 text-3xl font-bold text-stone-950 sm:text-4xl">
                  Yuva bekleyen hayvanlar
                </h2>
              </div>
              {shelter.officialSourceUrl ? (
                <a
                  href={shelter.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
                >
                  Resmi kaynağı görüntüle →
                </a>
              ) : (
                <span />
              )}
            </div>
            <ShelterAnimals animals={animals} />
          </div>
        </Container>
      </section>
    </main>
  );
}
