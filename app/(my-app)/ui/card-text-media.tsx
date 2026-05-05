"use client";

import clsx from "clsx";
import { Category } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";

import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

// pull the link block type from Category, enter blogGroup type using NonNullable to strip away null 
// and then enter blogList array type using again NonNullable 
// and also on the link array and finally grab both link blocks
// why i need to this and not access directly?
export type LinkBlockUnion = NonNullable<NonNullable<NonNullable<Category['blogGroup']>['blogList']>[number]['link']>[number];

// extract each block by the type name
export type VideoBlock = Extract<LinkBlockUnion, { blockType: 'videoBlock' }>;
export type ExternalLinkBlock = Extract<LinkBlockUnion, { blockType: 'externalLinkBlock' }>;

export default function CardTextMedia({
  title,
  desc,
  media,
  isMediaRight,
}: {
  title: string;
  desc?: Category['description'] | null;
  media: VideoBlock | ExternalLinkBlock | null; // externalLink is a string and not a external video
  isMediaRight?: boolean;
}) {
  let videoPlayer = null;

  if (!media) return null;

  // external video link
  if (media.blockType === 'externalLinkBlock') {
    if (media.externalLink.includes("soundcloud.com")) {
      const encodedUrl = encodeURIComponent(media.externalLink);

      const embedUrl = `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;


      videoPlayer = (
        <div className="w-[388px] h-[388px]">
          <iframe
            width="100%"
            height="100%"
            allow="autoplay"
            src={embedUrl}
            title="SoundCloud Player"
          />
        </div>
      );
    } else {
      videoPlayer = 
          <ReactPlayer
            src={media.externalLink}
            width="100%"
            height="100%" // This fills the parent container defined above
            controls={true}
            muted={false}
          />;
    }

    // uploaded video
  } else {
    const imageObj = typeof media.image === 'object' ? media.image : null;

    videoPlayer = <ReactPlayer
            src={imageObj?.url || ''}
            width="100%"
            height="100%" // This fills the parent container defined above
            controls={true}
          />;
  }

  const mediaContent = media.blockType === 'externalLinkBlock' 
  && media.externalLink.includes('soundcloud.com') ? videoPlayer : (
    <div className="w-md px-8 md:px-0 lg:w-lg h-auto aspect-[16/9]">
      {videoPlayer}
    </div>

  )

  return (
    <div
      className="flex flex-col w-full h-auto mt-14 lg:mt-20 px-4"
    >
      <div
        className="w-1/5 h-[1.2px] bg-neutral-500 mx-auto mb-14 lg:mb-20 rounded"
      ></div>
      <div
        className="flex flex-col lg:flex-row w-full items-center bg-transparent justify-center gap-7 md:gap-11"
      >
        <div
          className="w-full flex flex-col h-auto justify-center gap-4 md:w-sm items-start"
        >
          <h1 className="text-3xl">{title}</h1>
          {/* use Payload rich text renderer to render the lexical rich text object */}
          {desc && <RichText data={desc} className="rich-text" />}
        </div>
        <div
          className={clsx("flex justify-center order-last", {
            "lg:order-last": isMediaRight,
            "lg:order-first": !isMediaRight,
          })}
        >
          {mediaContent}
        </div>
      </div>
    </div>
  );
}
