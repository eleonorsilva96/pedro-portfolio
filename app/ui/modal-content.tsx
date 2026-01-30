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
  GalleryItemsProjectBlock,
} from "@/app/lib/definitions";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useScrollLock } from "../lib/hooks";

export default function ModalContent({
  galleryList,
  projectId,
  category,
  project,
}: {
  // it accepts a list of pure projects or items and also a mixed list of projects and items
  galleryList: (PortfolioGalleryType | GalleryItemsProjectBlock)[]; // pass all the watch items/projects
  projectId: string;
  category: string;
  project?: string | null;
}) {
  const [isExpand, setExpand] = useState<boolean>(false);

  useScrollLock(true);

  const isMatchingItem = (
    item: PortfolioGalleryType | GalleryItemsProjectBlock,
  ) => {
    if (item.__typename === "GalleryPortfolioRecord") {
      return item.projectId.project === projectId;
    }
    
    if (
      item.__typename === "ExternalVideoTitleRecord" || item.__typename === "GalleryItemRecord"
    ) {
      return item.slug === projectId;
    }
    
    if (item.__typename === "ImageBlockRecord") {
      return item.id === projectId;
    }
    return false;
  };

  const isMatchingGallery = (
    item: PortfolioGalleryType | GalleryItemsProjectBlock,
  ) =>
    item.__typename === "GalleryPortfolioRecord" ||
    item.__typename === "ExternalVideoTitleRecord" ||
    item.__typename === "GalleryItemRecord" ||
    item.__typename === "ImageBlockRecord";

  const getCurrentId = (item: PortfolioGalleryType | GalleryItemsProjectBlock) => {
    if (item.__typename === 'GalleryPortfolioRecord') return item.id;

    if (item.__typename === 'ExternalVideoTitleRecord' || item.__typename === "GalleryItemRecord") return item.id;

    if (item.__typename === "ImageBlockRecord") return item.id;

    return null;
  };

  const checkImageVertical = (item: PortfolioGalleryType | GalleryItemsProjectBlock) => {
    if (item.__typename === 'GalleryItemRecord' || item.__typename === 'ImageBlockRecord') {
      const height = item.asset.height;
      const width = item.asset.width;

      if (height > width) return true;

      return false;
    }
    return false;
  };
  
  const activeItem = galleryList.find(isMatchingItem);
  
  const activeGallery = galleryList.filter(isMatchingGallery);

  if (!activeItem) return null;
  if (!activeGallery) return null;
  
  const currentId = getCurrentId(activeItem);
  
  const removeDetails = activeItem?.__typename === 'ImageBlockRecord' ? true : false;

  const isVertical = checkImageVertical(activeItem);
  
  const isProjectModal = activeItem.__typename === 'GalleryPortfolioRecord';
  let media = null;
  let year = null;
  let linkBlock = null;
  let title = null;
  let moreDetails = null;

  if (
    (activeItem.__typename === "GalleryPortfolioRecord" &&
      activeItem.projectId.content.__typename === "SlideProjectRecord" &&
      !activeItem.projectId.content.videoMedia) ||
    activeItem.__typename === "ImageBlockRecord" ||
    activeItem.__typename === "GalleryItemRecord"
  ) {
    // image
    let imgUrl = "";
    let imgWidth = 0;
    let imgHeight = 0;
    let imgAlt = "";
    let imgClassName = "";
    let linkUrl = "";
    let linkText = null;

    if (
      activeItem.__typename === "GalleryPortfolioRecord" &&
      activeItem.projectId.content.__typename === "SlideProjectRecord" &&
      !activeItem.projectId.content.videoMedia
    ) {
      imgUrl = activeItem.thumbnail.url;
      imgWidth = activeItem.thumbnail.width;
      imgHeight = activeItem.thumbnail.height;
      imgAlt = activeItem.thumbnail.alt;
      imgClassName = "h-auto";
      title = activeItem.projectId.title;

      if (activeItem.projectId.content.date) {
        year = activeItem.projectId.content.date.split("-").at(0);
      }

      if (activeItem.projectId.content.linkBlock) {
        if (
          activeItem.projectId.content.linkBlock?.__typename ===
          "AdditionalLinkBlockRecord"
        ) {
          linkUrl = `${activeItem.projectId.content.linkBlock.link}`;
          linkText = activeItem.projectId.content.linkBlock.text;
        } else if (
          activeItem.projectId.content.linkBlock?.__typename ===
          "RelatedProjectBlockRecord"
        ) {
          linkUrl = `/portfolio/${category}/${activeItem.projectId.content.linkBlock.link.project}/watch`;
          linkText = activeItem.projectId.content.linkBlock.text;
        }

        linkBlock = (
          <Link
            href={linkUrl}
            className="!underline underline-offset-4 decoration-gray-950"
          >
            {linkText}
          </Link>
        );
      }

      if (
        activeItem.projectId.content.role ||
        activeItem.projectId.content.context
      ) {
        moreDetails = (
          <>
            <span className="font-bold">
              Contexto:{" "}
              <span className="font-normal">
                {activeItem.projectId.content.context}
              </span>
            </span>
            <span className="font-bold">
              Função:{" "}
              <span className="font-normal">
                {activeItem.projectId.content.role}
              </span>
            </span>
          </>
        );
      }
    } else if (activeItem.__typename === "GalleryItemRecord") {
      imgUrl = activeItem.asset.url;
      imgWidth = activeItem.asset.width;
      imgHeight = activeItem.asset.height;
      imgAlt = activeItem.asset.alt;
      imgClassName = "h-full object-cover";
      title = activeItem.title;
    } else if (activeItem.__typename === "ImageBlockRecord") {
      imgUrl = activeItem.asset.url;
      imgWidth = activeItem.asset.width;
      imgHeight = activeItem.asset.height;
      imgAlt = activeItem.asset.alt;
      imgClassName = "h-full object-cover";
    }

    media = (
      <Image
        src={imgUrl}
        className={`w-full ${imgClassName}`}
        width={imgWidth}
        height={imgHeight}
        alt={imgAlt}
      />
    );
  } else if (
    (activeItem.__typename === "GalleryPortfolioRecord" &&
      activeItem.projectId.content.__typename === "SlideProjectRecord" &&
      activeItem.projectId.content.videoMedia.externalVideo) ||
    activeItem.__typename === "ExternalVideoTitleRecord"
  ) {
    // external link
    let externalLinkId = null;
    let externalLinkUrl = "";
    let externalLinkThumbnailUrl = "";

    if (
      activeItem.__typename === "GalleryPortfolioRecord" &&
      activeItem.projectId.content.__typename === "SlideProjectRecord" &&
      activeItem.projectId.content.videoMedia.externalVideo
    ) {
      externalLinkId = activeItem.projectId.content.id;
      externalLinkUrl =
        activeItem.projectId.content.videoMedia.externalVideo.url;
      externalLinkThumbnailUrl =
        activeItem.projectId.content.videoMedia.externalVideo.thumbnailUrl;
      title = activeItem.projectId.title;
    } else if (activeItem.__typename === "ExternalVideoTitleRecord") {
      externalLinkId = activeItem.id;
      externalLinkUrl = activeItem.link.url;
      externalLinkThumbnailUrl = activeItem.link.thumbnailUrl;
      title = activeItem.title;
    }

    media = (
      <ReactPlayer
        key={externalLinkId}
        src={externalLinkUrl}
        light={externalLinkThumbnailUrl}
        controls={true}
        width="100%"
        height="100%"
      />
    );
  } else if (
    activeItem.__typename === "GalleryPortfolioRecord" &&
    activeItem.projectId.content.__typename === "SlideProjectRecord" &&
    activeItem.projectId.content.videoMedia.videoAsset
  ) {
    title = activeItem.projectId.title;

    media = (
      <VideoPlayer
        key={activeItem.projectId.content.id}
        data={activeItem.projectId.content.videoMedia.videoAsset.video}
        className="w-full h-full object-cover"
        preload="none"
      />
    );
  }

  const content = (
    <div
      key={activeItem.id}
      className="w-full h-auto lg:max-w-[900px] xl:max-w-[1400px] 2xl:max-w-[1800px] flex flex-col lg:flex-row px-4 gap-8 justify-center items-center lg:items-start"
    >
      <div
        className={clsx("w-full flex flex-col gap-4", {
          "aspect-[16/9]": isProjectModal === true || !isVertical,
          "aspect-[2/3] h-auto md:!w-[450px] lg:!w-[550px] 2xl:!w-[1000px]": isVertical,
        })}
      >
        {/* change to media */}
        {media}
      </div>
      <div
        className={clsx("flex flex-col gap-4", {
          hidden: isExpand === true || removeDetails,
          flex: isExpand === false,
          "w-md": isProjectModal === true,
          "w-fit lg:min-w-3xs lg:max-w-2xs text-balance":
            isProjectModal === false,
        })}
      >
        <h3
          className={clsx("text-2xl lg:text-4xl 2xl:text-5xl font-medium", {
            "text-neutral-800": isProjectModal === true,
            "text-neutral-100": isProjectModal === false,
          })}
        >
          {title}
        </h3>
        {moreDetails}
        {year}
        {linkBlock}
      </div>
    </div>
  );

  const expandIconHandler = !isExpand ? (
    <ExpandIcon
      className={clsx({
        "text-neutral-800": isProjectModal,
        "text-neutral-100": !isProjectModal,
      })}
    />
  ) : (
    <MinimizeIcon
      className={clsx({
        "text-neutral-800": isProjectModal,
        "text-neutral-100": !isProjectModal,
      })}
    />
  );

  return (
    <div
      className={clsx("fixed inset-0 z-[9999] bg-gray-300", {
        "bg-gray-300": isProjectModal,
        "bg-neutral-800": !isProjectModal,
      })}
    >
      <div className="w-full h-full relative flex flex-col items-center justify-center">
        <div
          className="absolute top-0 left-0 ml-4 mt-4 z-[20] cursor-pointer"
          onClick={() => setExpand(!isExpand)}
        >
          {expandIconHandler}
        </div>
        <Close
          isProject={isProjectModal ? true : false}
          projectId={projectId}
        />
        {content}
        <div className="flex items-center absolute inset-y-0 right-0 mr-4">
          <PrevNextButtons
            gallery={activeGallery || []}
            currentId={currentId || ""}
            category={category}
            project={project ? project : null}
            isModal
            hidePrev
            isProject={isProjectModal ? true : false}
          />
        </div>
        <div className="flex items-center absolute inset-y-0 left-0 ml-4">
          <PrevNextButtons
            gallery={activeGallery || []}
            currentId={currentId || ""}
            category={category}
            project={project ? project : null}
            isModal
            hideNext
            isProject={isProjectModal ? true : false}
          />
        </div>
      </div>
    </div>
  );
}
