'use client'

import { usePathname, useSearchParams } from "next/navigation";
import { GalleryProjectBlock } from "../lib/definitions";
import Link from "next/link";
import Image from "next/image";
import ImageSkeleton from "./image-skeleton";

export default function GalleryImage({ item } : { item: GalleryProjectBlock }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const params = new URLSearchParams(searchParams);

    params.set("id", item.id);

    const url = `${pathname}?${params.toString()}`;

    return (
        <Link href={url} className="overflow-hidden bg-purple-300 group">
            <ImageSkeleton
                src={item.asset.url}
                className="w-full h-full"
                width={item.asset.width}
                height={item.asset.height}
                alt={item.asset.alt}
                removeOpacity
            />
        </Link>
    );

}