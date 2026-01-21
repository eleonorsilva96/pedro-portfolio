'use client'

import Image, { ImageProps } from "next/image";
import { useState } from "react";

export default function ImageSkeleton({ className, alt, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-neutral-100 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-500/30 animate-pulse z-10" />
      )}
      <Image
        {...props}
        alt={alt}
        className={`
          duration-700 ease-in-out w-full h-full object-cover group-hover:opacity-0 transition-opacity
          ${
            isLoading
              ? "blur-xl opacity-0"
              : "blur-0 opacity-100"
          }
        `}
        onLoad={() => setIsLoading(false)} // browser event that fires when image is loaded/downloaded
      />
    </div>
  );
}
