"use client";

import Image from "next/image";
import { ImageAsset, VideoAsset } from "../lib/definitions";
import ReactPlayer from "react-player";
import { VideoPlayer } from "react-datocms";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";

export default function CardTextMediaTest({
  title,
  desc,
  btnLabel,
  media,
  isMediaRight,
}: {
  title: string;
  desc: string;
  btnLabel?: string;
  media: ImageAsset | VideoAsset | string; // externalLink is a string and not a external video
  isMediaRight?: boolean;
}) {
  let mediaContent = null;

  console.log(isMediaRight);

  if (!media) return null;

  // external video link
  if (typeof media === "string") {
    if (media.includes("soundcloud.com")) {
      const encodedUrl = encodeURIComponent(media);

      const embedUrl = `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;

      mediaContent = (
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
      mediaContent = (
        <div className="w-full md:w-lg h-auto aspect-[16/9]">
          <ReactPlayer
            src={media}
            width="100%"
            height="100%" // This fills the parent container defined above
            controls={true}
          />
        </div>
      );
    }
    // image
  } else if (
    "width" in media &&
    "height" in media &&
    "video" in media === false
  ) {
    mediaContent = (
      <div className="w-full">
        <Image
          src={media.url}
          className="w-full md:object-center lg:w-3xl lg:h-[660px] object-fit object-[35%_0]"
          width={media.width}
          height={media.height}
          alt={media.alt}
        />
      </div>
    );
    // uploaded video
  } else if ("video" in media && media.video) {
    mediaContent = (
      <div className="w-full md:w-lg h-auto aspect-[16/9]">
        <VideoPlayer
          data={media.video}
          className="object-cover"
          preload="none"
        />
      </div>
    );
  }
  return (
    <div className={clsx(
        'flex flex-col w-full h-auto',
        {
            'mt-14 px-4' : !btnLabel
        }
    )}>
      <div className={clsx({
        'w-1/5 h-[1.2px] bg-neutral-500 mx-auto mb-14 rounded' : !btnLabel
        }
      )}></div>
      <div
        className={clsx(
          `flex flex-col lg:flex-row w-full items-center bg-transparent`,
          {
            "justify-center": typeof media === "string" || "video" in media,
          }
        )}
      >
        <div
          className={clsx(
            "w-full flex flex-col h-auto justify-center gap-4",
            {
              "md:w-sm" : !btnLabel,
              "py-8 px-4 lg:p-0 md:w-full" : btnLabel,
              "items-start": typeof media === "string" || "video" in media,
              "items-center":
                typeof media !== "string" &&
                "width" in media &&
                "height" in media,
            }
          )}
        >
          <h1 className={clsx({
            'text-3xl' : !btnLabel,
            'text-3xl md:text-4xl text-center' : btnLabel
          })}>{title}</h1>
          <div className={clsx({
            'w-7 h-[4px] bg-primary mx-auto my-4' : btnLabel
          })}></div>
          {/* insert description in a markdown parser to allow links */}
          <ReactMarkdown
            // add custom style for the link
            components={{
            // remove node property out of the object
              p: ({node, ...props }) => (
                <p {...props} className={clsx(
                    'w-full whitespace-pre-line text-md md:text-lg',
                    {
                        'text-center w-full md:w-lg' : btnLabel,
                    }
                )}></p>
              ),
              a: ({node, ...props }) => (
                <a
                  {...props}
                  className="!text-neutral-900 !underline"
                  target="_blank"
                />
              ),
            }}
          >
            {desc}
          </ReactMarkdown>
          {btnLabel ? <button className="w-3xs h-12 rounded-full bg-primary text-neutral-50 mt-4 font-semibold">{btnLabel}</button> : null}
        </div>
        <div
          className={clsx(
            'flex justify-center order-last w-full lg:w-auto',
            {
            "lg:w-full" : btnLabel,
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
