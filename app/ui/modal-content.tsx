"use client";

import PrevNextButtons from "./prev-next-buttons";
import Close from "./close";
import ExpandIcon from "./icons/expand";
import MinimizeIcon from "./icons/minimize";
import Image from "next/image";
import { VideoPlayer } from "react-datocms";
import ReactPlayer from "react-player";
import {
  PortfolioGalleryType,
  SlideProjectBlock,
  GalleryItemsProjectBlock,
} from "@/app/lib/definitions";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";

export default function ModalContent({
  galleryList,
  modalProject, // project 
  sliderContent, // project content
  projectId,
  category,
  project
}: {
  galleryList: PortfolioGalleryType[] | GalleryItemsProjectBlock[]; // pass all the watch items/projects
  modalProject?: PortfolioGalleryType | null; // project thumbnail
  sliderContent: SlideProjectBlock | GalleryItemsProjectBlock | null; // item
  projectId: string;
  category: string;
  project?: string | null;
}) {
  // console.log(sliderContent);
  // use state for the expand
  const [isExpand, setExpand] = useState<boolean>(false);
  let mediaPlayer = null;
  let year = null;
  let linkBlock = null;

  const projectModal =
    sliderContent?.__typename === "SlideProjectRecord" ? sliderContent : null;
  const projectGalleryList = galleryList?.filter(
    (item) => item.__typename === "GalleryPortfolioRecord"
  );

  console.log("projectModal", projectModal);
  console.log("modalProject", modalProject);

  const moreDetailsModal =
    sliderContent?.__typename === "ExternalVideoTitleRecord" ||
    sliderContent?.__typename === "GalleryItemRecord"
      ? sliderContent
      : null;

  const moreDetailsGalleryList = galleryList.filter(
    (item) =>
      item.__typename === "ExternalVideoTitleRecord" ||
      item.__typename === "GalleryItemRecord"
  );

  console.log("moreDetailsModal", moreDetailsModal);
  console.log("moreDetailsGalleryList", moreDetailsGalleryList);
  
  const checkGalleryList = projectGalleryList.length !== 0 ? projectGalleryList : moreDetailsGalleryList; // return watchGalleryList

  if (projectModal?.videoMedia?.externalVideo || moreDetailsModal?.__typename === 'ExternalVideoTitleRecord') {
    mediaPlayer = (
      <ReactPlayer
        src={moreDetailsModal?.__typename !== 'ExternalVideoTitleRecord' ? projectModal?.videoMedia.externalVideo?.url : moreDetailsModal.link.url}
        light={moreDetailsModal?.__typename !== 'ExternalVideoTitleRecord' ? projectModal?.videoMedia.externalVideo?.thumbnailUrl : moreDetailsModal.link.thumbnailUrl}
        controls={true}
        width="100%"
        height="100%"
      />
    );
  } else if (projectModal?.videoMedia?.videoAsset) {
    mediaPlayer = (
      <VideoPlayer
        data={projectModal?.videoMedia.videoAsset.video}
        className="w-full h-full object-cover"
        preload="none"
      />
    );
  } else if (modalProject?.__typename === "GalleryPortfolioRecord" || moreDetailsModal?.__typename === 'GalleryItemRecord'){
      mediaPlayer = (
        <Image
          src={modalProject ? modalProject?.thumbnail.url : moreDetailsModal?.asset.url || ''}
          className={clsx(
            'w-full',
            {
              'h-auto' : modalProject,
              'h-full object-cover' : !modalProject
            }
          )}
          width={modalProject ? modalProject?.thumbnail.width : moreDetailsModal?.asset.width || 0}
          height={modalProject ? modalProject?.thumbnail.height : moreDetailsModal?.asset.height || 0}
          alt={modalProject ? modalProject?.thumbnail.alt : moreDetailsModal?.asset.alt || ''}
        />
      );
  } else {
    mediaPlayer = <div>No Video or Image!</div>
  }

  const expandIconHandler = !isExpand ? (
    <ExpandIcon className={clsx({
      'text-neutral-800' : modalProject,
      'text-neutral-100' : !modalProject,
    })} />
  ) : (
    <MinimizeIcon className={clsx({
      'text-neutral-800' : modalProject,
      'text-neutral-100' : !modalProject,
    })} />
  );

  if (projectModal?.date) {
    const yearValue = projectModal.date.split("-").at(0);

    year = (
      <span className="font-bold">
        Data: <span className="font-normal">{yearValue}</span>
      </span>
    );
  }

  if (projectModal?.linkBlock?.__typename === "AdditionalLinkBlockRecord") {
    linkBlock = (
      <Link
        href={`${projectModal?.linkBlock.link}`}
        className="!underline underline-offset-4 decoration-gray-950"
      >
        {projectModal?.linkBlock.text}
      </Link>
    );
  } else if (
    projectModal?.linkBlock?.__typename === "RelatedProjectBlockRecord"
  ) {
    linkBlock = (
      <Link
        href={`/portfolio/${category}/${projectModal?.linkBlock.link.project}/watch`}
        className="!underline underline-offset-4 decoration-gray-950"
      >
        {projectModal?.linkBlock.text}
      </Link>
    );
  }

  return (
    // "fixed inset-0 z-[9999] bg-gray-300"
    <div className={clsx(
      'fixed inset-0 z-[9999] bg-gray-300',
      {
        'bg-gray-300' : modalProject,
        'bg-neutral-800' : !modalProject,
      }
    )}>
      <div className="w-full h-full relative flex flex-col items-center justify-center">
        <div
          className="absolute top-0 left-0 ml-4 mt-4 z-[20] cursor-pointer"
          onClick={() => setExpand(!isExpand)}
        >
          {expandIconHandler}
        </div>
        <Close isProject={modalProject ? true : false} projectId={projectId} />
        <div className="w-full h-auto lg:max-w-[900px] xl:max-w-[1400px] flex flex-col lg:flex-row px-4 gap-8 justify-center">
          <div className={clsx(
            'w-full flex flex-col gap-4',
            {
              'aspect-[16/9]' : moreDetailsModal?.__typename !== 'GalleryItemRecord',
              'aspect-[2/3] !w-[600px]' : moreDetailsModal?.__typename == 'GalleryItemRecord',
            }
          )}>
            {mediaPlayer}
          </div>
          <div
            className={clsx("flex flex-col gap-4", {
              hidden: isExpand === true,
              flex: isExpand === false,
              'w-md' : modalProject,
              'w-sm' : !modalProject,
            })}
          >
            <h3 className={clsx(
              'text-2xl lg:text-4xl 2xl:text-5xl font-medium',
              {
                'text-neutral-800' : modalProject,
                'text-neutral-100' : !modalProject,
              }
            )}>
              {modalProject ? modalProject?.projectId.title : moreDetailsModal?.title}
            </h3>
            {modalProject ? (
              <>
              <span className="font-bold">
                Contexto:{" "}
                <span className="font-normal">{projectModal?.context}</span>
              </span>
              <span className="font-bold">
                Função: <span className="font-normal">{projectModal?.role}</span>
              </span>
              {year}
              {linkBlock}
              </>
            ) : null}
          </div>
        </div>
        <div className="flex items-center absolute inset-y-0 right-0 mr-4">
          <PrevNextButtons
            gallery={checkGalleryList || []}
            currentId={modalProject ? modalProject?.id : moreDetailsModal?.id || ""}
            category={category}
            project={project ? project : null}
            isModal
            hidePrev
            isProject={modalProject ? true : false}
          />
        </div>
        <div className="flex items-center absolute inset-y-0 left-0 ml-4">
          <PrevNextButtons
            gallery={checkGalleryList || []}
            currentId={modalProject ? modalProject?.id : moreDetailsModal?.id || ""}
            category={category}
            project={project ? project : null}
            isModal
            hideNext
            isProject={modalProject ? true : false}
          />
        </div>
      </div>
    </div>
  );
}
