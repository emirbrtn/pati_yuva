import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  const tr: Record<string, string> = {
    "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
    "Ç": "c", "Ğ": "g", "İ": "i", "Ö": "o", "Ş": "s", "Ü": "u",
  };
  return text
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => tr[c] ?? c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const sponsors = [
  {
    name: "PatiPaw Petshop",
    description: "Türkiye genelinde 50+ şubesiyle evcil hayvan产品的 lider mağaza zinciri. Mama, aksesuar, oyuncak ve sağlık ürünleri.",
    city: "İstanbul",
    district: "Kadıköy",
    category: "PET_SHOP",
    phone: "0216 555 0001",
    email: "info@patipaw.com",
    website: "https://patipaw.com",
    isFeatured: true,
    deals: [
      { title: "%20 İndirim - Mama Alışverişlerinde", description: "100 puan ve üzeri alışverişlerde tüm mama ürünlerinde %20 indirim.", discountPercent: 20, requiredPoints: 100 },
      { title: "Ücretsiz Veteriner Kontrolü", description: "200 puanla anlaşmalı veteriner kliniklerinde ücretsiz kontrol.", requiredPoints: 200 },
      { title: "%15 İndirim - Aksesuarlarda", description: "Tüm aksesuar ve oyuncaklarda %15 indirim.", discountPercent: 15, requiredPoints: 75 },
    ],
  },
  {
    name: "MamaDostu Market",
    description: "Organik ve doğal evcil hayvan mamaları uzmanı. Sağlıklı beslenme için güvenilir adres.",
    city: "Ankara",
    district: "Çankaya",
    category: "PET_SHOP",
    phone: "0312 555 0002",
    email: "info@mamadostu.com",
    website: "https://mamadostu.com",
    isFeatured: true,
    deals: [
      { title: "İlk Alışverişe %25 İndirim", description: "İlk kez puan kullanan üyelere %25 indirim.", discountPercent: 25, requiredPoints: 50 },
      { title: "50₺ İndirim - 300 Puan Karşılığında", description: "300 puanı 50₺ indirime çevir.", discountAmount: 50, requiredPoints: 300 },
      { title: "Ücretsiz Mama Numunesi", description: "50 puanla premium mama deneme paketi.", requiredPoints: 50 },
    ],
  },
  {
    name: "VetHayat Kliniği",
    description: "7/24 acil veteriner hizmeti. Cerrahi, diş, aşı ve rehabilitasyon.",
    city: "İzmir",
    district: "Bornova",
    category: "VETERINARY",
    phone: "0232 555 0003",
    email: "info@vethayat.com",
    website: "https://vethayat.com",
    isFeatured: true,
    deals: [
      { title: "Ücretsiz Aşı - 150 Puan", description: "150 puanla tek doz aşı hizmeti.", requiredPoints: 150 },
      { title: "%30 İndirim - Cerrahi İşlemlerde", description: "Cerrahi müdahalelerde %30 indirim.", discountPercent: 30, requiredPoints: 500 },
      { title: "Ücretsiz Diş Temizliği", description: "200 puanla profesyonel diş temizliği.", requiredPoints: 200 },
    ],
  },
  {
    name: "Patili Oyuncak Dünyası",
    description: "Evcil hayvanlar için el yapımı ve premium oyuncaklar. Tüm ırklara uygun ürünler.",
    city: "Bursa",
    district: "Nilüfer",
    category: "PET_SHOP",
    phone: "0224 555 0004",
    email: "info@patilioyuncak.com",
    isFeatured: false,
    deals: [
      { title: "Al 1 Öde 1 Kampanyası", description: "100 puanla herhangi bir oyuncakta 2. ürüne %100 indirim.", requiredPoints: 100 },
      { title: "%10 İndirim - Tüm Ürünlerde", description: "Tüm ürünlerde %10 indirim.", discountPercent: 10, requiredPoints: 50 },
    ],
  },
  {
    name: "Bonkör Pati Gıda",
    description: "Kedi ve köpek maması, konserve, ödül ve takviye gıdaları üreticisi.",
    city: "İstanbul",
    district: "Küçükçekmece",
    category: "PET_FOOD",
    phone: "0212 555 0005",
    email: "info@bonkorp.com",
    isFeatured: true,
    deals: [
      { title: "%20 İndirim - Premium Mama Serisi", description: "Premium mama serisinde %20 indirim.", discountPercent: 20, requiredPoints: 100 },
      { title: "Ücretsiz Kargo - 500₺ Üzeri", description: "500₺ ve üzeri alışverişlerde ücretsiz kargo. 75 puan gerekli.", requiredPoints: 75 },
    ],
  },
  {
    name: "Patili Giyim Atölyesi",
    description: "Evcil hayvanlar için tasarım giyim, aksesuar ve tasmalar. Özel üretim seçenekleri.",
    city: "Antalya",
    district: "Muratpaşa",
    category: "PET_ACCESSORIES",
    phone: "0242 555 0006",
    email: "info@patiligiyim.com",
    isFeatured: false,
    deals: [
      { title: "%15 İndirim - Tasarım Ürünlerde", description: "Özel tasarım ürünlerde %15 indirim.", discountPercent: 15, requiredPoints: 100 },
      { title: "Kişiye Özel Tasma - 250 Puan", description: "250 puanla isim yazılı özel tasma.", requiredPoints: 250 },
    ],
  },
];

async function main() {
  console.log("Sponsorlar ve anlaşmalar ekleniyor...\n");

  for (const s of sponsors) {
    const slug = slugify(s.name);
    const existing = await prisma.sponsor.findUnique({ where: { slug } });
    if (existing) {
      console.log(`  ⏭ ${s.name} zaten mevcut.`);
      continue;
    }

    const sponsor = await prisma.sponsor.create({
      data: {
        slug,
        name: s.name,
        description: s.description,
        city: s.city,
        district: s.district,
        category: s.category,
        phone: s.phone,
        email: s.email,
        website: s.website ?? null,
        isFeatured: s.isFeatured,
      },
    });

    for (const d of s.deals) {
      await prisma.sponsorDeal.create({
        data: {
          sponsorId: sponsor.id,
          title: d.title,
          description: d.description,
          discountPercent: "discountPercent" in d ? d.discountPercent ?? null : null,
          discountAmount: "discountAmount" in d ? d.discountAmount ?? null : null,
          requiredPoints: d.requiredPoints,
        },
      });
    }

    console.log(`  ✓ ${s.name} (${s.city}) — ${s.deals.length} anlaşma`);
  }

  console.log("\nTamamlandı!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
