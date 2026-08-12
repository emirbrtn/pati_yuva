const TURKISH_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
  İ: "i",
};

export function normalizeTurkish(input: string): string {
  return input
    .split("")
    .map((char) => TURKISH_MAP[char] ?? char)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("tr-TR");
}

export function includesNormalized(haystack: string, term: string): boolean {
  return normalizeTurkish(haystack).includes(normalizeTurkish(term));
}