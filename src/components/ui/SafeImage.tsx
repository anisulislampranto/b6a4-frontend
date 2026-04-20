"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";

const DEFAULT_PLACEHOLDER_SRC = "/med.webp";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export default function SafeImage({ src, fallbackSrc = DEFAULT_PLACEHOLDER_SRC, alt, ...props }: SafeImageProps) {
  const initialSrc = useMemo(() => {
    if (typeof src === "string" && src.trim()) return src;
    return fallbackSrc;
  }, [src, fallbackSrc]);

  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
