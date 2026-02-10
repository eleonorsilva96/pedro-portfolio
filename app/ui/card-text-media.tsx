"use client";

import { MouseEvent, RefObject } from "react";
import Image from "next/image";
import { ImageAsset, VideoAsset } from "../lib/definitions";
import ReactPlayer from "react-player";
import { VideoPlayer } from "react-datocms";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import Form from "@/app/ui/form";

export default function CardTextMedia({
  title,
  desc,
  btnLabel,
  media,
  formRef,
  isBlogSection,
  isMediaRight,
  isVertical
}: {
  title: string;
  desc?: string;
  btnLabel?: string;
  media: ImageAsset | VideoAsset | string; // externalLink is a string and not a external video
  formRef?: RefObject<HTMLDivElement | null>;
  isBlogSection?: boolean;
  isMediaRight?: boolean;
  isVertical?: boolean;
}) {
  let mediaContent = null;

  console.log(isMediaRight);

  if (!media) return null;

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (formRef) {
      return formRef.current?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  };

  const contentType = desc ? (
    <>
      <h1
        className={clsx({
          "text-3xl": isBlogSection,
          "text-4xl lg:w-xl md:text-[44px] text-center": !isBlogSection,
        })}
      >
        {title}
      </h1>
      <div
        className={clsx({
          "w-7 h-[4px] bg-primary-500 mx-auto my-4": !isBlogSection,
        })}
      ></div>
      {/* insert description in a markdown parser to allow links */}
      <ReactMarkdown
        // add custom style for the link
        components={{
          // remove node property out of the object
          p: ({ children, ...props }) => {
            return (
              <p
                {...props}
                className={clsx(
                  "w-full whitespace-pre-line text-md md:text-lg",
                  {
                    "w-full md:w-lg lg:w-xl": !isBlogSection,
                    "text-center": !isBlogSection,
                  },
                )}
              >
                {children}
              </p>
            );
          },
          a: ({ ...props }) => (
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
      {btnLabel ? (
        <a
          onClick={(e) => scrollToSection(e)}
          href="#contact"
          className="font-mulish font-medium flex items-center justify-center w-3xs h-12 rounded-full bg-primary-500 hover:bg-primary-600 cursor-pointer text-neutral-50 pt-auto mt-4"
        >
          {btnLabel}
        </a>
      ) : null}
    </>
  ) : (
    <>
      <Form />
    </>
  );

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
        <div className="w-md px-8 md:px-0 lg:w-lg h-auto aspect-[16/9]">
          <ReactPlayer
            src={media}
            width="100%"
            height="100%" // This fills the parent container defined above
            controls={true}
            muted={false}
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
          className={clsx(
            "w-full object-cover md:object-center 2xl:object-[50%_19%]",
            {
              "max-h-[800px] md:max-h-[660px]" : !isVertical,
              "aspect-[9/16] max-h-[600px] lg:max-h-[850px]" : isVertical
            }
          )}
          width={media.width}
          height={media.height}
          alt={media.alt}
        />
      </div>
    );
    // uploaded video
  } else if ("video" in media && media.video) {
    mediaContent = (
      <div className="w-md px-8 md:px-0 lg:w-lg h-auto aspect-[16/9]">
        <VideoPlayer
          data={media.video}
          className="object-cover"
          preload="none"
        />
      </div>
    );
  }
  return (
    <div
      className={clsx("flex flex-col w-full h-auto", {
        "mt-14 px-4": isBlogSection,
      })}
    >
      <div
        className={clsx({
          "w-1/5 h-[1.2px] bg-neutral-500 mx-auto mb-14 rounded": isBlogSection,
        })}
      ></div>
      <div
        className={clsx(
          `flex flex-col lg:flex-row w-full items-center bg-transparent`,
          {
            "justify-center": typeof media === "string" || "video" in media,
            "gap-7 md:gap-11": isBlogSection,
          }
        )}
      >
        <div
          className={clsx("w-full flex flex-col h-auto justify-center gap-4", {
            "md:w-sm": isBlogSection,
            "py-14 px-4 lg:p-0 md:w-full": !isBlogSection,
            "items-start": typeof media === "string" || "video" in media,
            "items-center":
              typeof media !== "string" &&
              "width" in media &&
              "height" in media,
          })}
        >
          {contentType}
        </div>
        <div
          className={clsx("flex justify-center order-last", {
            "w-full": !isBlogSection,
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
