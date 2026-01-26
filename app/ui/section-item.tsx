'use client'

import { GalleryItemsProjectBlock } from "@/app/lib/definitions";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import ReactPlayer from "react-player";
import Link from "next/link";

export default function SectionItem({
  item,
}: {
  item: GalleryItemsProjectBlock;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    let url = null;
    let items = null;

    console.log("section", item);

    if (item.__typename === 'ExternalVideoTitleRecord' || item.__typename === 'GalleryItemRecord') {
        const params = new URLSearchParams(searchParams);
        params.set("id", item.slug);
        url = `${pathname}?${params.toString()}`;

        items =
          item.__typename === "ExternalVideoTitleRecord" ? (
            <Link key={item.id} href={url} className="shrink-0 snap-center group relative w-auto h-auto">
              <div className="absolute w-full h-full group-hover:bg-gray-500/50 transition-colors duration-300 cursor-pointer"></div>
              <div className="aspect-[16/9] w-[378px]">
                <ReactPlayer
                  src={item.link.url}
                  light={item.link.thumbnailUrl}
                  controls={true}
                  width="100%"
                  height="100%"
                />
              </div>
            </Link>
          ) : (
            <Link key={item.id} href={url} className="shrink-0 snap-center group relative w-auto h-auto">
              <div className="absolute w-full h-full group-hover:bg-gray-500/50 transition-colors duration-300 cursor-pointer"></div>
              <div className="aspect-[2/3] w-[325px]">
                <Image
                  src={item.asset.url}
                  className="w-full h-full object-cover"
                  width={item.asset.width}
                  height={item.asset.height}
                  alt={item.asset.alt}
                />
              </div>
            </Link>
          );
    }


  return <>{items}</>;
}
