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
  ContentBlock,
  ExternalVideoBlock,
  GalleryProjectBlock,
  GalleryItems,
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
  isModal,
}: {
  // it accepts a list of pure projects or items and also a mixed list of projects and items
  // project modal - view modal - gallery modal
  galleryList: (PortfolioGalleryType | ContentBlock)[]; // pass all the view projects
  projectId: string;
  category: string;
  project?: string | null;
  isModal?: boolean;
}) {
  const [isExpand, setExpand] = useState<boolean>(false);

  useScrollLock(true);

  console.log("GALLERY LIST", galleryList);

  const isMatchingItem = (content: (PortfolioGalleryType | ContentBlock)[]) => {
    if (
      content.some(
        (galleryPortfolio) =>
          galleryPortfolio.__typename === "GalleryPortfolioRecord",
      )
    ) {
      console.log("PROJECT ID", projectId);
      for (const block of content) {
        if (block.__typename === "GalleryPortfolioRecord") {
          if (block.projectId.project === projectId) {
            return block;
          }
        }
      }
      return undefined;
    }

    if (
      content.some((section) => section.__typename === "SectionProjectRecord")
    ) {
      for (const block of content) {
        if (block.__typename === "SectionProjectRecord") {
          const match = block.galleryItems.find(
            (galleryItem) =>
              galleryItem.slug === projectId || galleryItem.id === projectId,
          );

          console.log("MATCH", match);

          if (match) return match;
        }
      }
      return undefined;
    }

    if (
      content.some(
        (galleryProject) =>
          galleryProject.__typename === "GalleryProjectRecord",
      )
    ) {
      const foundGalleryProjectItem = content.find(
        (galleryProject) =>
          galleryProject.__typename === "GalleryProjectRecord" &&
          galleryProject.id === projectId,
      );

      if (!foundGalleryProjectItem) return undefined;

      return foundGalleryProjectItem;
    }
  };

  const isMatchingGallery = (
    content: (PortfolioGalleryType | ContentBlock)[],
  ) => {
    // GalleryPortfolioRecord
    if (
      content.some(
        (galleryPortfolio) =>
          galleryPortfolio.__typename === "GalleryPortfolioRecord",
      )
    ) {
      const foundGalleryPortfolio = content.filter(
        (galleryPortfolio) =>
          galleryPortfolio.__typename === "GalleryPortfolioRecord",
      );

      if (!foundGalleryPortfolio) return undefined;

      return foundGalleryPortfolio;
    }
    // SectionProjectRecord ExternalVideoTitleRecord or GalleryItemRecord
    if (
      content.some((section) => section.__typename === "SectionProjectRecord")
    ) {
      const foundSectionGallery = content.find((section) => {
        const isSection = section.__typename === "SectionProjectRecord";

        if (!isSection) return undefined;

        const isGalleryItem = section.galleryItems.some((galleryItem) => {
          const isValid =
            galleryItem.__typename === "ExternalVideoTitleRecord" ||
            galleryItem.__typename === "GalleryItemRecord";

          if (!isValid) return undefined;

          if (galleryItem.slug) {
            return galleryItem.slug === projectId;
          } else {
            return galleryItem.id === projectId;
          }
        });

        if (!isGalleryItem) return undefined;

        return isGalleryItem;
      });

      if (!foundSectionGallery) return undefined;

      const sectionGalleryList =
        foundSectionGallery.__typename === "SectionProjectRecord"
          ? foundSectionGallery.galleryItems
          : null;

      return sectionGalleryList;
    }

    // GalleryProjectRecord
    if (
      content.some(
        (galleryPortfolio) =>
          galleryPortfolio.__typename === "GalleryProjectRecord",
      )
    ) {
      const foundGalleryPortfolio = content.filter(
        (galleryPortfolio) =>
          galleryPortfolio.__typename === "GalleryProjectRecord",
      );

      if (!foundGalleryPortfolio) return undefined;

      return foundGalleryPortfolio;
    }
  };

  const getCurrentId = (
    activeItem:
      | ExternalVideoBlock
      | GalleryItems
      | PortfolioGalleryType
      | GalleryProjectBlock
      | ContentBlock,
  ) => {
    if (activeItem.__typename === "GalleryPortfolioRecord")
      return activeItem.projectId.id;

    if (
      activeItem.__typename === "ExternalVideoTitleRecord" ||
      activeItem.__typename === "GalleryItemRecord"
    )
      return activeItem.id;

    if (activeItem.__typename === "GalleryProjectRecord") return activeItem.id;

    return undefined;
  };

  const checkImageVertical = (
    item:
      | ExternalVideoBlock
      | GalleryItems
      | PortfolioGalleryType
      | GalleryProjectBlock
      | ContentBlock,
  ) => {
    if (
      item.__typename === "GalleryItemRecord" ||
      item.__typename === "GalleryProjectRecord"
    ) {
      const height = item.asset.height;
      const width = item.asset.width;

      if (height > width) return true;

      return false;
    }
    return false;
  };

  const activeItem = isMatchingItem(galleryList);

  const activeGallery = isMatchingGallery(galleryList);

  console.log("ACTIVE ITEM", activeItem);
  console.log("ACTIVE GALLERY", activeGallery);

  if (!activeItem) return null;
  if (!activeGallery) return null;

  const currentId = getCurrentId(activeItem);

  const removeDetails =
    activeItem?.__typename === "GalleryProjectRecord" ||
    activeGallery.some(
      (item) => item.__typename === "ExternalVideoTitleRecord" && !item.slug,
    )
      ? true
      : false;

  const isVertical = checkImageVertical(activeItem);

  const isProjectModal = activeItem.__typename === "GalleryPortfolioRecord";
  let media = null;
  let year = null;
  let linkBlock = null;
  let title = null;
  let moreDetails = null;

  if (
    (activeItem.__typename === "GalleryPortfolioRecord" &&
      activeItem.projectId.contentType.content.__typename ===
        "SlideProjectRecord" &&
      !activeItem.projectId.contentType.content.videoMedia) ||
    activeItem.__typename === "GalleryProjectRecord" ||
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
      activeItem.projectId.contentType.content.__typename ===
        "SlideProjectRecord" &&
      !activeItem.projectId.contentType.content.videoMedia
    ) {
      imgUrl = activeItem.projectId.thumbnail.url;
      imgWidth = activeItem.projectId.thumbnail.width;
      imgHeight = activeItem.projectId.thumbnail.height;
      imgAlt = activeItem.projectId.thumbnail.alt;
      imgClassName = "h-auto";
      title = activeItem.projectId.title;

      if (activeItem.projectId.contentType.content.date) {
        year = activeItem.projectId.contentType.content.date.split("-").at(0);
      }

      if (activeItem.projectId.contentType.content.linkBlock) {
        if (
          activeItem.projectId.contentType.content.linkBlock?.__typename ===
          "AdditionalLinkBlockRecord"
        ) {
          linkUrl = `${activeItem.projectId.contentType.content.linkBlock.link}`;
          linkText = activeItem.projectId.contentType.content.linkBlock.text;
        } else if (
          activeItem.projectId.contentType.content.linkBlock?.__typename ===
          "RelatedProjectBlockRecord"
        ) {
          linkUrl = `/portfolio/${category}/${activeItem.projectId.contentType.content.linkBlock.link.project}`;
          linkText = activeItem.projectId.contentType.content.linkBlock.text;
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
        activeItem.projectId.contentType.content.role ||
        activeItem.projectId.contentType.content.context
      ) {
        moreDetails = (
          <>
            <span className="font-bold">
              Contexto:{" "}
              <span className="font-normal">
                {activeItem.projectId.contentType.content.context}
              </span>
            </span>
            <span className="font-bold">
              Função:{" "}
              <span className="font-normal">
                {activeItem.projectId.contentType.content.role}
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
    } else if (activeItem.__typename === "GalleryProjectRecord") {
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
      activeItem.projectId.contentType.content.__typename ===
        "SlideProjectRecord" &&
      activeItem.projectId.contentType.content.videoMedia.externalVideo) ||
    activeItem.__typename === "ExternalVideoTitleRecord"
  ) {
    // external link
    let externalLinkId = null;
    let externalLinkUrl = "";
    let externalLinkThumbnailUrl = "";

    if (
      activeItem.__typename === "GalleryPortfolioRecord" &&
      activeItem.projectId.contentType.content.__typename ===
        "SlideProjectRecord" &&
      activeItem.projectId.contentType.content.videoMedia.externalVideo
    ) {
      externalLinkId = activeItem.projectId.contentType.content.id;
      externalLinkUrl =
        activeItem.projectId.contentType.content.videoMedia.externalVideo.url;
      externalLinkThumbnailUrl =
        activeItem.projectId.contentType.content.videoMedia.externalVideo
          .thumbnailUrl;
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
    activeItem.projectId.contentType.content.__typename ===
      "SlideProjectRecord" &&
    activeItem.projectId.contentType.content.videoMedia.videoAsset
  ) {
    title = activeItem.projectId.title;

    media = (
      <VideoPlayer
        key={activeItem.projectId.contentType.content.id}
        data={
          activeItem.projectId.contentType.content.videoMedia.videoAsset.video
        }
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
          "aspect-[16/9] lg:max-w-7xl": isProjectModal === true || !isVertical,
          "aspect-[2/3] h-auto md:!w-[450px] lg:!w-[550px] 2xl:!w-[1000px]":
            isVertical,
        })}
      >
        {/* change to media */}
        {media}
      </div>
      <div
        className={clsx("flex flex-col gap-4", {
          hidden: isExpand === true || removeDetails,
          flex: isExpand === false,
          "w-full lg:w-md": isProjectModal === true,
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
        <Close isProject={isProjectModal ? true : false} />
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
            isModal={isModal ? true : false}
            hideNext
            isProject={isProjectModal ? true : false}
          />
        </div>
      </div>
    </div>
  );
}
