"use client";

import Image from "next/image";
import { useState } from "react";

type AnimalGalleryProps = {
  name: string;
  imageUrls: string[];
};

export function AnimalGallery({ name, imageUrls }: AnimalGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (imageUrls.length === 0) {
    return (
      <div
        className="flex min-h-[360px] items-center justify-center rounded-3xl border border-stone-200 bg-stone-100 text-sm text-stone-500"
        role="img"
        aria-label={`${name} için fotoğraf bulunmuyor`}
      >
        Fotoğraf bulunmuyor
      </div>
    );
  }

  const activeImage = imageUrls[Math.min(activeIndex, imageUrls.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <Image
          key={activeImage}
          src={activeImage}
          alt={`${name} fotoğraf ${activeIndex + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      {imageUrls.length > 1 ? (
        <div className="flex flex-wrap gap-3">
          {imageUrls.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${name} fotoğraf ${index + 1}'i göster`}
              aria-pressed={index === activeIndex}
              className={`relative h-20 w-24 overflow-hidden rounded-2xl border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                index === activeIndex
                  ? "border-emerald-700"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}