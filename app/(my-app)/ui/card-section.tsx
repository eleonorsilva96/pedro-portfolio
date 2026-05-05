"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import ReactPlayer from "react-player";
import Link from "next/link";
import { saveScrollPosition } from "../lib/utils";
import { SectionsBlock } from "./sections";

export default function CardSection({
  content,
}: {
  content:
    | null
    | NonNullable<
        NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]
      >[number];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  if (!content) return null;

  if (content.id) {
    params.set("id", content.id);
  }
  const url = `${pathname}?${params.toString()}`;

  return (
    <>
      {content.blockType === "externalLinkTitleBlock" ? (
        <Link
          key={content.id}
          href={url}
          className="shrink-0 snap-center group relative w-auto h-auto"
          onClick={saveScrollPosition}
        >
          <div className="absolute w-full h-full group-hover:bg-gray-500/50 transition-colors duration-300 cursor-pointer"></div>
          <div className="aspect-[16/9] w-[378px]">
            <ReactPlayer
              src={content.externalLink}
              light={true}
              controls={true}
              width="100%"
              height="100%"
              muted={false}
            />
          </div>
        </Link>
      ) : (
        <Link
          key={content.id}
          href={url}
          className="shrink-0 snap-center group relative w-auto h-auto"
          onClick={saveScrollPosition}
        >
          <div className="absolute w-full h-full group-hover:bg-gray-500/50 transition-colors duration-300 cursor-pointer"></div>
          <div className="aspect-[2/3] w-[325px]">
            <Image
              src={typeof content.image === 'object' && content.image.url || ''}
              className="w-full h-full object-cover"
              width={typeof content.image === 'object' && content.image.width || undefined}
              height={typeof content.image === 'object' && content.image.height || undefined}
              alt={typeof content.image === 'object' && content.image.alt || ''}
            />
          </div>
        </Link>
      )}
    </>
  );
}
