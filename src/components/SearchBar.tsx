"use client";

import { useRef } from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Hayvan, şehir veya barınak ara...",
}: SearchBarProps) {
  const debounceRef = useRef<number | null>(null);

  const handleChange = (next: string) => {
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      onChange(next);
    }, 250);
  };

  return (
    <div className="relative">
      <label htmlFor="global-search" className="sr-only">
        Hayvanlarda ara
      </label>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        id="global-search"
        type="search"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-stone-300 bg-white pl-12 pr-4 text-sm text-stone-700 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
      />
    </div>
  );
}