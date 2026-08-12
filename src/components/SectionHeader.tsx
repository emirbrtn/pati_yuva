type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  tone = "light",
}: SectionHeaderProps) {
  const isDark = tone === "dark";

  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p
          className={`text-sm font-semibold uppercase tracking-wide ${
            isDark ? "text-emerald-100" : "text-emerald-700"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-3 text-3xl font-bold sm:text-4xl ${
          isDark ? "text-white" : "text-stone-950"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-7 ${
            isDark ? "text-emerald-50" : "text-stone-600"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
