"use client";

import { MouseEvent, RefObject, ReactNode } from "react";
import Image from "next/image";
import Form from "@/app/(my-app)/ui/form";

// create blueprint to get the fields we need from payload cms
interface PayloadImage {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
}

export default function CardTextImage({
  title,
  desc,
  btnLabel,
  image,
  formRef,
}: {
  title: string;
  desc?: ReactNode; // to load Payload <RichText />
  btnLabel?: string;
  image?: PayloadImage | null;
  formRef?: RefObject<HTMLDivElement | null>;
}) {
  // if there is no image, don't render the component
  if (!image?.url) return null;

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (formRef) {
      return formRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const contentType = desc ? (
    <>
      <h1 className="text-4xl 2xl:text-5xl lg:w-xl md:text-[44px] text-center">{title}</h1>
      <div className="w-7 h-[4px] bg-primary-500 mx-auto my-4"></div>

      <div className="w-full text-base md:text-lg 2xl:text-[22px] md:w-xl lg:w-lg 2xl:w-4xl text-center">{desc}</div>

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

  const imageContent = (
    <div className="relative w-full aspect-[9/16] max-h-[600px] lg:max-h-[850px] overflow-hidden">
      <Image
        src={image.url}
        alt={image.alt || title}
        fill // ignore its original file dimensions and stretch to the container
        className="object-cover"
        // optimize image size for each device by telling the browser the image is full-screen on mobile but half-screen on desktop
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );

  return (
    <div className="flex flex-col w-full h-auto">
      <div className="flex flex-col lg:flex-row w-full items-center bg-transparent">
        <div className="w-full flex flex-col h-auto justify-center items-center gap-4 py-14 px-4 lg:p-0 md:w-full">
          {contentType}
        </div>
        <div className="flex justify-center w-full">{imageContent}</div>
      </div>
    </div>
  );
}
