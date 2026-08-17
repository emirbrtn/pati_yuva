import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  const turkishMap: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "C", Ğ: "G", İ: "I", Ö: "O", Ş: "S", Ü: "U",
  };
  return text
    .toLowerCase()
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => turkishMap[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const shelters = [
  { name: "İstanbul Büyükşehir Belediyesi Hayvan Barınağı", city: "İstanbul", district: "Büyükçekmece", capacity: 4000, description: "Türkiye'nin en büyük belediye barınağı. Yılda 2000'den fazla hayvan sahiplendiriliyor. Kısırlaştırma, tedavi ve rehabilitasyon hizmetleri sunuyor.", phone: "0212 886 22 56", workingHours: "Her gün 09:00-17:00" },
  { name: "Çankaya Belediyesi Rehabilitasyon Merkezi", city: "Ankara", district: "Çankaya", capacity: 1500, description: "Ankara'nın en kapsamlı hayvan bakımevi. Kısırlaştırma, aşılama ve sahiplendirme hizmetleri veriyor.", phone: "0312 442 37 18", workingHours: "Pazartesi-Cuma 08:30-17:00" },
  { name: "İzmir Büyükşehir Belediyesi Işıkkent Hayvan Barınağı", city: "İzmir", district: "Konak", capacity: 2000, description: "Ege Bölgesi'nin en büyük hayvan barınağı. 200'den fazla köpek ve kediye ev sahipliği yapıyor.", phone: "0232 437 02 08", workingHours: "Her gün 08:00-18:00" },
  { name: "Antalya Büyükşehir Belediyesi Hayvan Barınağı", city: "Antalya", district: "Kepez", capacity: 1200, description: "Akdeniz Bölgesi'nin en büyük barınağı. Turizm şehrine yakışır modern tesis.", phone: "0242 332 53 18", workingHours: "Her gün 09:00-18:00" },
  { name: "Bursa Büyükşehir Belediyesi Hayvan Barınağı", city: "Bursa", district: "Nilüfer", capacity: 1000, description: "Marmara'nın önemli barınaklarından. Kısırlaştırma ve sahiplendirme odaklı çalışıyor.", phone: "0224 444 16 02", workingHours: "Pazartesi-Cuma 08:00-17:00" },
  { name: "SHKD Doğal Yaşam Alanı", city: "İstanbul", district: "Eyüpsultan", capacity: 500, description: "Gönüllüler tarafından kurulan, sokak hayvanlarını doğal ortamda bakıma alan dernek barınağı.", phone: "0212 227 72 65", workingHours: "Her gün 10:00-16:00" },
  { name: "Mama ve Pati Derneği Barınağı", city: "İstanbul", district: "Kadıköy", capacity: 200, description: "2010'dan beri faaliyet gösteren, gönüllü ağıyla çalışan hayvan koruma derneği.", phone: "0532 354 02 32", workingHours: "Her gün 10:00-17:00" },
  { name: "HAYTAP Hayvan Hakları Federasyonu Barınağı", city: "Ankara", district: "Etimesgut", capacity: 300, description: "Türkiye'nin en büyük hayvan hakları federasyonuna ait barınak. Yasal süreçlerde de aktif.", phone: "0312 278 53 53", workingHours: "Pazartesi-Cuma 09:00-17:00" },
  { name: "Adana Büyükşehir Belediyesi DOHAYKO Barınağı", city: "Adana", district: "Yüreğir", capacity: 800, description: "DOHAYKO (Doğal Hayvanı Koruma) projesi kapsamında kurulan modern barınak.", phone: "0322 338 62 25", workingHours: "Her gün 08:00-17:00" },
  { name: "Kayseri Büyükşehir Belediyesi Hayvan Bakımevi", city: "Kayseri", district: "Melikgazi", capacity: 600, description: "İç Anadolu'nun en büyük barınaklarından. Tedavi ve rehabilitasyon merkezi olarak da hizmet veriyor.", phone: "0352 207 15 95", workingHours: "Pazartesi-Cuma 08:00-17:00" },
  { name: "Trabzon Büyükşehir Belediyesi Hayvan Barınağı", city: "Trabzon", district: "Ortahisar", capacity: 400, description: "Karadeniz Bölgesi'nin en büyük barınağı. Sahipsiz hayvanlar için modern bakım ünitesi.", phone: "0462 444 61 61", workingHours: "Her gün 09:00-17:00" },
  { name: "Konya Büyükşehir Belediyesi Hayvan Bakımevi", city: "Konya", district: "Selçuklu", capacity: 500, description: "Konya'nın en büyük hayvan bakımevi. Kısırlaştırma ve sahiplendirme hizmeti sunuyor.", phone: "0332 351 34 11", workingHours: "Pazartesi-Cuma 08:00-17:00" },
  { name: "Eskişehir Tepebaşı Belediyesi Hayvan Bakımevi", city: "Eskişehir", district: "Tepebaşı", capacity: 350, description: "Çevreci belediyeciliğiyle tanınan Tepebaşı'nın modern hayvan bakımevi.", phone: "0222 313 01 66", workingHours: "Her gün 09:00-17:00" },
  { name: "Gökova Animal Rescue", city: "Muğla", district: "Ula", capacity: 150, description: "Bodrum merkezli, uluslararası gönüllü ağıyla çalışan hayvan kurtarma derneği.", phone: "0532 253 91 53", workingHours: "Her gün 09:00-18:00" },
  { name: "Çeşme Hayvan Barınağı", city: "İzmir", district: "Çeşme", capacity: 200, description: "Ege sahillerinin en bilinen barınaklarından. Yaz sezonunda turistlerden büyük destek görüyor.", phone: "0232 723 06 34", workingHours: "Her gün 10:00-16:00" },
  { name: "Diyarbakır Büyükşehir Belediyesi Hayvan Bakımevi", city: "Diyarbakır", district: "Bağlar", capacity: 500, description: "Güneydoğu Anadolu'nun en büyük hayvan bakımevi. Tedavi ve rehabilitasyon merkezi.", phone: "0412 228 40 40", workingHours: "Pazartesi-Cuma 08:00-17:00" },
  { name: "Samsun Büyükşehir Belediyesi Hayvan Bakımevi", city: "Samsun", district: "Atakum", capacity: 400, description: "Karadeniz'in en büyük barınaklarından. Kısırlaştırma ve sahiplendirme odaklı çalışıyor.", phone: "0362 431 08 08", workingHours: "Her gün 09:00-17:00" },
  { name: "Odunpazarı Belediyesi Hayvan Sağlık Merkezi", city: "Eskişehir", district: "Odunpazarı", capacity: 300, description: "Tarihi Odunpazarı ilçesinde, sokak hayvanları için modern sağlık merkezi.", phone: "0222 236 19 70", workingHours: "Pazartesi-Cuma 08:00-17:00" },
  { name: "Giresun Belediyesi Hayvan Barınağı", city: "Giresun", district: "Bulancak", capacity: 250, description: "Karadeniz sahil şeridinde önemli bir barınak. Doğal ortamda bakım imkanı sunuyor.", phone: "0454 216 39 80", workingHours: "Her gün 09:00-16:00" },
  { name: "Tekirdağ Büyükşehir Belediyesi Hayvan Bakımevi", city: "Tekirdağ", district: "Süleymanpaşa", capacity: 350, description: "Marmara Bölgesi'nin batı ucunda, modern tesisleriyle hizmet veren barınak.", phone: "0282 262 36 26", workingHours: "Pazartesi-Cuma 08:00-17:00" },
];

async function main() {
  console.log("20 barınak ekleniyor...");

  let count = 0;
  for (const s of shelters) {
    const baseSlug = slugify(s.name);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.shelter.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.shelter.create({
      data: {
        slug,
        name: s.name,
        description: s.description,
        city: s.city,
        district: s.district,
        phone: s.phone,
        workingHours: s.workingHours,
        capacity: s.capacity,
        dataSourceType: "OFFICIAL",
        verified: true,
        verificationStatus: "VERIFIED",
        verifiedAt: new Date(),
        services: JSON.stringify(["sahiplendirme", "tedavi", "kısırlaştırma"]),
      },
    });
    count++;
    console.log(`  ✓ ${s.name} (${s.city})`);
  }

  console.log(`\nToplam ${count} barınak eklendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
