'use client'

import Image, { ImageProps } from "next/image";
import { useState } from "react";

// to be able to use custom props we need to extend ImagePros 
interface ImageSkeletonProps extends ImageProps {
  removeOpacity?: boolean
}

export default function ImageSkeleton({ className, alt, removeOpacity, ...props }: ImageSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  const groupHover = removeOpacity ? 'transition-all duration-500 group-hover:scale-105' : 'duration-700 ease-in-out group-hover:opacity-0 transition-opacity';

  return (
    <div className={`relative overflow-hidden bg-neutral-100 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-500/30 animate-pulse z-10" />
      )}
      <Image
        {...props}
        alt={alt}
        className={`
          w-full h-full object-cover ${groupHover}
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
