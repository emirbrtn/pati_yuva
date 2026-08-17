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

async function main() {
  console.log("Tüm slug'lar yeniden oluşturuluyor...\n");

  const shelters = await prisma.shelter.findMany({
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  const slugCounts: Record<string, number> = {};

  for (const s of shelters) {
    const base = slugify(s.name);
    slugCounts[base] = (slugCounts[base] ?? 0) + 1;
    const slug = slugCounts[base] > 1 ? `${base}-${slugCounts[base]}` : base;

    await prisma.shelter.update({ where: { id: s.id }, data: { slug } });
    console.log(`  ${s.name} → /barinaklar/${slug}`);
  }

  console.log("\nTamamlandı!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
