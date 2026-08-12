"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hayvanları Keşfet", href: "/hayvanlar" },
  { label: "Barınaklar", href: "/barinaklar" },
  { label: "Nasıl Çalışır?", href: "/nasil-calisir" },
];

const userLinks = [
  { label: "Favorilerim", href: "/favoriler" },
  { label: "Başvurularım", href: "/basvurularim" },
  { label: "Profilim", href: "/profil" },
];

export function Header() {
  const { user, status, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const isAuthed = status === "authenticated" && user !== null;

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  const desktopAuth = isAuthed ? (
    <>
      {userLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800"
        >
          {item.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
      >
        Çıkış Yap
      </button>
    </>
  ) : (
    <>
      <Link
        href="/kayit"
        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800"
      >
        Kayıt Ol
      </Link>
      <Link
        href="/giris"
        className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
      >
        Giriş Yap
      </Link>
    </>
  );

  const mobileUserLinks = isAuthed ? userLinks : [];

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#fffaf4]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-emerald-800">
          PatiYuva
        </Link>
        <nav
          aria-label="Ana navigasyon"
          className="hidden items-center gap-6 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-stone-700 transition hover:text-emerald-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">{desktopAuth}</div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-700 md:hidden"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {open ? (
        <nav aria-label="Mobil navigasyon" className="border-t border-stone-200 bg-white px-4 py-4 md:hidden">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-emerald-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {mobileUserLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-emerald-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex gap-3 border-t border-stone-100 pt-3">
              <Link
                href="/favoriler"
                onClick={() => setOpen(false)}
                className="flex flex-1 items-center justify-center rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800"
              >
                Favoriler
              </Link>
              {isAuthed ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex flex-1 items-center justify-center rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Çıkış Yap
                </button>
              ) : (
                <Link
                  href="/giris"
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Giriş Yap
                </Link>
              )}
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}