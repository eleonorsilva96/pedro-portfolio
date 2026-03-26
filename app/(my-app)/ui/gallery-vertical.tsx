"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import ImageSkeleton from "./image-skeleton";
import { saveScrollPosition } from "../lib/utils";
import { ImagesBlock } from "./gallery-portfolio";

export default function GalleryVertical({
  image,
}: {
  image: null | NonNullable<ImagesBlock['images']>[number];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  if (!image) return null;

  if (image.id) {
    params.set("id", image.id);
  }

  const url = `${pathname}?${params.toString() || ''}`;

  return (
    <Link
      href={url}
      className="overflow-hidden bg-purple-300 group"
      onClick={saveScrollPosition}
    >
      <ImageSkeleton
        src={typeof image.image === 'object' && image.image.url || ''}
        className="w-full h-full"
        width={typeof image.image === 'object' && image.image.width || undefined}
        height={typeof image.image === 'object' && image.image.height || undefined}
        alt={typeof image.image === 'object' && image.image.alt || ''}
        removeOpacity
      />
    </Link>
  );
}
