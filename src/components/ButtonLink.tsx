import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:outline-emerald-700"
      : "border border-stone-300 bg-white text-stone-900 hover:border-emerald-700 hover:text-emerald-800 focus-visible:outline-emerald-700";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition ${styles} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
    >
      {children}
    </Link>
  );
}
