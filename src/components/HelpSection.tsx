const items = [
  {
    title: "Barınakları görünür kılar",
    text: "Yerel barınaklar ve hayvanları tek merkezden keşfedilir hale gelir.",
  },
  {
    title: "Şeffaf bilgi verir",
    text: "Sağlık durumu, karakter ve ihtiyaçlar her hayvan için net paylaşılır.",
  },
  {
    title: "Doğru eşleşmeyi hedefler",
    text: "Özellikler ve yaşam koşullarına göre uygun adayları eşleştirmeyi destekler.",
  },
];

export function HelpSection() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Nasıl yardımcı oluyoruz?
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-950 sm:text-4xl">
              Sahiplendirmeyi birlikte kolaylaştırıyoruz.
            </h2>
          </div>
          <ul className="space-y-5">
            {items.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div>
                  <h3 className="font-semibold text-stone-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}