import type { Shelter } from "@/types/shelter";

export const shelters: Shelter[] = [
  {
    id: "shelter-kadikoy",
    slug: "kadikoy-gecici-hayvan-bakimevi",
    name: "Kadıköy Belediyesi Geçici Hayvan Bakımevi",
    verified: true,
    isDemo: false,
    description:
      "Kadıköy Belediyesi Veteriner İşleri Müdürlüğü bünyesinde faaliyet gösteren geçici hayvan bakımevi; sahipsiz hayvanların bakımı, tedavisi ve sahiplendirilmesi çalışmalarını yürütmektedir.",
    city: "İstanbul",
    district: "Kadıköy",
    address: "Çamlık Mah. Parlak Sok., Ümraniye, İstanbul",
    phone: "0216 415 67 61 / 0216 499 83 90",
    officialSourceUrl:
      "https://kadikoy.bel.tr/kurumsal/birimler/veteriner-isleri",
  },
  {
    id: "shelter-bornova",
    slug: "bornova-pako-sokak-hayvanlari-merkezi",
    name: "İzmir Pako Sokak Hayvanları Sosyal Yaşam Kampüsü",
    verified: true,
    isDemo: false,
    description:
      "İzmir Büyükşehir Belediyesi tarafından sokak hayvanları için kurulan Pako Sokak Hayvanları Sosyal Yaşam Kampüsü; modern yaşam alanları, klinik ve sahiplendirme birimleriyle hizmet vermektedir.",
    city: "İzmir",
    district: "Bornova",
    address: "Gökdere Mevkii, Bornova, İzmir",
    officialSourceUrl:
      "https://www.izmir.bel.tr/tr/Haberler/pako-sokak-hayvanlari-sosyal-yasam-kampusu-46606/22322/4",
  },
  {
    id: "shelter-sincan",
    slug: "sincan-gecici-hayvan-bakimevi",
    name: "ABB Sincan Geçici Hayvan Bakımevi ve Rehabilitasyon Merkezi",
    verified: true,
    isDemo: false,
    description:
      "Ankara Büyükşehir Belediyesi Sağlık İşleri Daire Başkanlığı bünyesindeki Sincan Geçici Hayvan Bakımevi ve Rehabilitasyon Merkezi; sahipsiz hayvanların toplanması, tedavisi ve sahiplendirilmesi hizmetlerini sunmaktadır.",
    city: "Ankara",
    district: "Sincan",
    address: "Ahi Evran Mah. 225. Cad. No:96-98, Sincan, Ankara",
    phone: "0 312 507 42 32",
    email: "sokakhayvanlari@ankara.bel.tr",
    officialSourceUrl: "https://www.ankara.bel.tr",
  },
  {
    id: "shelter-sahinbey",
    slug: "sahinbey-can-dostlari-barinagi",
    name: "Gaziantep Büyükşehir Belediyesi Hayvan Barınağı ve Rehabilitasyon Merkezi",
    verified: true,
    isDemo: false,
    description:
      "Gaziantep Büyükşehir Belediyesi tarafından işletilen hayvan barınağı ve rehabilitasyon merkezi; sokak hayvanlarının bakımını üstlenmekte ve ziyaret saatlerinde sahiplendirme çalışmalarını sürdürmektedir.",
    city: "Gaziantep",
    district: "Şahinbey",
    address: "Burç Yazıbağ Mah., Şahinbey, Gaziantep",
    workingHours: "Ziyaret saatleri: 14.00 - 16.00",
    officialSourceUrl: "https://www.gaziantep.bel.tr/projeler",
  },
  {
    id: "shelter-cankaya",
    slug: "cankaya-hayvan-barinagi",
    name: "Çankaya Hayvan Barınağı",
    verified: false,
    isDemo: true,
    description:
      "Örnek amaçlı hazırlanmış demo barınak profili. Bu kayıt gerçek bir kurumu temsil etmez; yalnızca platform deneyimi için listelenmektedir.",
    city: "Ankara",
    district: "Çankaya",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "shelter-nilufer",
    slug: "nilufer-belediyesi-hayvan-bakimevi",
    name: "Nilüfer Belediyesi Hayvan Bakımevi",
    verified: false,
    isDemo: true,
    description:
      "Örnek amaçlı hazırlanmış demo bakımevi profili. Bu kayıt gerçek bir kurumu temsil etmez; yalnızca platform deneyimi için listelenmektedir.",
    city: "Bursa",
    district: "Nilüfer",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "shelter-kepez",
    slug: "kepez-sahipsiz-hayvan-bakimevi",
    name: "Kepez Sahipsiz Hayvan Bakımevi",
    verified: false,
    isDemo: true,
    description:
      "Örnek amaçlı hazırlanmış demo bakımevi profili. Bu kayıt gerçek bir kurumu temsil etmez; yalnızca platform deneyimi için listelenmektedir.",
    city: "Antalya",
    district: "Kepez",
    imageUrl:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "shelter-tepebasi",
    slug: "tepebasi-dogal-yasam-merkezi",
    name: "Tepebaşı Doğal Yaşam Merkezi",
    verified: false,
    isDemo: true,
    description:
      "Örnek amaçlı hazırlanmış demo yaşam merkezi profili. Bu kayıt gerçek bir kurumu temsil etmez; yalnızca platform deneyimi için listelenmektedir.",
    city: "Eskişehir",
    district: "Tepebaşı",
    imageUrl:
      "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=1200&q=80",
  },
];
