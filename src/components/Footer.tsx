import Link from "next/link";

const platformLinks = [
  { label: "Hayvanları Keşfet", href: "/hayvanlar" },
  { label: "Barınaklar", href: "/barinaklar" },
  { label: "Sponsorlar", href: "/sponsorlar" },
  { label: "Nasıl Çalışır?", href: "/nasil-calisir" },
];

const supportLinks = [
  { label: "Hakkımızda", href: "/" },
  { label: "İletişim", href: "/" },
  { label: "Gizlilik", href: "/" },
  { label: "Kullanım Koşulları", href: "/" },
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-lg font-bold text-white">PatiYuva</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-400">
              Her dostun bir yuvası olsun. Barınaklardaki hayvanları görünür
              kılmak ve sahiplendirmeyi daha bilinçli hale getirmek için
              hazırlanıyor.
            </p>
          </div>
          <nav aria-label="Platform" className="text-sm">
            <p className="font-semibold text-white">Platform</p>
            <ul className="mt-3 space-y-2">
              {platformLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-stone-400 transition hover:text-emerald-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Destek" className="text-sm">
            <p className="font-semibold text-white">Destek</p>
            <ul className="mt-3 space-y-2">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-stone-400 transition hover:text-emerald-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs leading-5 text-stone-500">
          Bu sürüm demo verilerle çalışır. Giriş, veritabanı ve AI API
          entegrasyonları ilerleyen sürümlerde eklenir.
        </p>
      </div>
    </footer>
  );
}