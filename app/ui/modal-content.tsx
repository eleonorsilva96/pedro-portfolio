"use client";

import PrevNextButtons from "./prev-next-buttons";
import Close from "./close";
import ExpandIcon from "./icons/expand";
import MinimizeIcon from "./icons/minimize";
import Image from "next/image";
import { VideoPlayer } from "react-datocms";
import ReactPlayer from "react-player";
import { PortfolioGalleryType, SlideProjectBlock } from "../lib/definitions";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";


export default function ModalContent({
    galleryList,
    modalProject,
    sliderContent,
    projectId,
    category
} : {
    galleryList: PortfolioGalleryType[];
    modalProject: PortfolioGalleryType;
    sliderContent: SlideProjectBlock | null;
    projectId: string;
    category: string;
}) {
  // use state for the expand
  const [isExpand, setExpand] = useState<boolean>(false);
  let mediaPlayer = null;
  let year = null;

  if (sliderContent?.urlVideo) {
    mediaPlayer = (
      <ReactPlayer
        src={sliderContent?.urlVideo?.url}
        light={sliderContent?.urlVideo?.thumbnailUrl}
        controls={true}
        width="100%"
        height="100%"
      />
    );
  } else if (sliderContent?.video) {
    mediaPlayer = (
      <VideoPlayer
        data={sliderContent?.video?.video}
        className="w-full h-full object-cover"
        preload="none"
      />
    );
  } else {
    if (modalProject.__typename === "GalleryPortfolioRecord") {
      mediaPlayer = (
        <Image
          src={modalProject?.thumbnail.url}
          className="w-full h-auto"
          width={modalProject?.thumbnail.width}
          height={modalProject?.thumbnail.height}
          alt={modalProject?.thumbnail.alt}
        />
      );
    }
  }

  const expandIconHandler = !isExpand ? (
    <ExpandIcon className="text-gray-950" />
  ) : (
    <MinimizeIcon className="text-gray-950" />
  );

  if (sliderContent?.date) {
    const yearValue = sliderContent.date.split("-").at(0);

    year = (
        <span className="font-bold">
              Data: <span className="font-normal">{yearValue}</span>
            </span>
    );
  }

//   const year =
// //     projectDetails?.__typename === "GalleryPortfolioRecord" &&
// //     projectDetails?.projectId.content.__typename === "SlideProjectRecord"
// //       ? projectDetails?.projectId.content.date?.split("-")
// //       : null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-300">
      <div className="w-full h-full relative flex flex-col items-center justify-center">
        <div 
          className="absolute top-0 left-0 ml-4 mt-4 z-[20] cursor-pointer"
          onClick={() => setExpand(!isExpand)}
        >
          {expandIconHandler}
        </div>
        <Close projectId={projectId} />
        <div className="w-full h-auto lg:max-w-[900px] xl:max-w-[1500px] flex flex-col lg:flex-row px-4 gap-8">
          <div className="aspect-[16/9] w-full flex flex-col gap-4">
            {mediaPlayer}
          </div>
          <div className={clsx(
            'w-full lg:w-[700px] xl:w-[400px] flex-col gap-4',
            {
                'hidden': isExpand === true,
                'flex': isExpand === false,
            }
          )}>
            <h3 className="text-2xl lg:text-4xl 2xl:text-6xl font-medium">{modalProject?.projectId.title}</h3>
            <span className="font-bold">
              Contexto:{" "}
              <span className="font-normal">{sliderContent?.context}</span>
            </span>
            <span className="font-bold">
              Função: <span className="font-normal">{sliderContent?.role}</span>
            </span>
            {year}
            {sliderContent?.additionalLinkText ? (
                <Link href={`${sliderContent?.additionalLink}`} className="!underline underline-offset-4 decoration-gray-950">
                    {sliderContent.additionalLinkText}
                </Link>
            ) : null}
          </div>
        </div>
        <div className="flex items-center absolute inset-y-0 right-0 mr-4">
          <PrevNextButtons
            gallery={galleryList || []}
            currentId={modalProject?.id}
            category={category}
            isModal
            hidePrev
          />
        </div>
        <div className="flex items-center absolute inset-y-0 left-0 ml-4">
          <PrevNextButtons
            gallery={galleryList || []}
            currentId={modalProject?.id}
            category={category}
            isModal
            hideNext
          />
        </div>
      </div>
    </div>
  );
}
