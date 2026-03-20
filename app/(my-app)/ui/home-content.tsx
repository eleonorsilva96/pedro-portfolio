"use client";

import CardTextMedia from "@/app/(my-app)/ui/card-text-media";
import Gallery from "@/app/(my-app)/ui/gallery";
import Form from "@/app/(my-app)/ui/form";
import { ContentBlock } from "../lib/definitions";
import { Suspense, useRef } from "react";


export default function HomeContent({
    sections
} : {
    sections: ContentBlock[];
}) {
  const formRef = useRef<HTMLDivElement>(null);

  const videoBlock = sections?.find((s) => s.__typename === 'VideoBlockRecord');
  const cardTextImg = sections?.find((s) => s.__typename === 'CardTextImgRecord');
  const cardGallery = sections?.filter((s) => s.__typename === 'SectionProjectRecord');
  
  if (!videoBlock) return null;
  if (!cardTextImg) return null;
  if (!cardGallery) return null;

  return (
    <div className="flex flex-col w-full items-center sm:items-start">
      <div className="relative w-full h-[1000px] md:h-[800px] 2xl:h-[1000px]">
        <video
          src={
            (typeof homepageData.video === "object" &&
              homepageData.video.url) ||
            ""
          }
          className="w-full h-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline // autoplay for iOS Safari
        />

        {/* to avoid showing control panel */}
        <div className="absolute inset-0 z-10 bg-transparent"></div>
      </div>
      {/* about me */}
      <CardTextImage
        title={homepageData.aboutSection.title}
        desc={homepageData.aboutSection.description}
        btnLabel={homepageData.aboutSection.buttonText}
        image={
          (typeof homepageData.aboutSection.image === "object" &&
            homepageData.aboutSection.image) ||
          null
        }
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
          <Gallery galleryItems={cardGallery[0].galleryItems || []} />
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
            galleryItems={cardGallery[1].galleryItems || []}
            hasTitle
            removeBtn
          />
        </Suspense>
      </div>
      <Form innerRef={formRef} />
    </>
  );
}
