"use client";

import { VideoPlayer } from "react-datocms";
import CardTextMedia from "@/app/ui/card-text-media";
import Gallery from "@/app/ui/gallery";
import Form from "@/app/ui/form";
import { SectionBlock } from "../lib/definitions";
import { Suspense, useRef } from "react";


export default function HomeContent({
    sections
} : {
    sections: SectionBlock[];
}) {
  const formRef = useRef<HTMLDivElement>(null);

  const videoBlock = sections?.find((s) => s.__typename === 'VideoBlockRecord');
  const cardTextImg = sections?.find((s) => s.__typename === 'CardTextImgRecord');
  const cardGallery = sections?.filter((s) => s.__typename === 'CardGalleryRecord');
  
  if (!videoBlock) return null;
  if (!cardTextImg) return null;
  if (!cardGallery) return null;

  return (
    <>
      <div className="relative w-full h-[1000px] lg:h-[800px]">
        <VideoPlayer
          data={videoBlock.videoAsset.video}
          className="w-full h-full"
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          style={{
            // @ts-expect-error: Custom CSS variables for Mux Player are not typed in React
            "--loading-indicator": "none",
            // hide play button
            "--play-button": "none",
            // hide bottom bar controls
            "--controls": "none",
            // forces the video to cover the area (Zoom/Crop)
            "--media-object-fit": "cover",
            "--media-object-position": "center",
          }}
        />
        {/* to avoid showing control panel */}
        <div className="absolute inset-0 z-10 bg-transparent"></div>
      </div>
      {/* <div className="w-full max-h-[660px]"> */}
      <CardTextMedia
        title={cardTextImg.title}
        desc={cardTextImg.description}
        btnLabel={cardTextImg.buttonText}
        media={cardTextImg.asset}
        formRef={formRef}
        isMediaRight
      />
      {/* </div> */}
      <div
        id="last-works"
        className="flex flex-col w-full h-auto items-center py-16 px-5 lg:px-[56px] bg-white"
      >
        <h1 className="text-4xl lg:text-[44px]">{cardGallery[0].title}</h1>
        <div className="w-7 h-[3px] bg-foreground mx-auto my-6"></div>
        <Suspense fallback={null}>
          <Gallery galleryItems={cardGallery[0].galleryItems} />
        </Suspense>
      </div>
      <div
        id="services"
        className="flex flex-col w-full h-auto items-center py-16 px-5 lg:px-[56px]"
      >
        <h1 className="text-4xl lg:text-[44px]">{cardGallery[1].title}</h1>
        <div className="w-7 h-[3px] bg-foreground mx-auto my-6"></div>
        <Suspense fallback={null}>
          <Gallery
            galleryItems={cardGallery[1].galleryItems}
            hasTitle
            removeBtn
          />
        </Suspense>
      </div>
      <Form innerRef={formRef} />
    </>
  );
}
