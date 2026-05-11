"use client";

import { Project } from "@/payload-types";
import clsx from "clsx";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { useState } from "react";
import ExpandIcon from "./icons/expand";
import MinimizeIcon from "./icons/minimize";
import Close from "./close";
import PrevNextButtons from "./prev-next-buttons";
import { ImagesBlock } from "./gallery-portfolio";
import { SectionsBlock } from "./sections";
import ReactPlayer from "react-player";
import { useScrollLock } from "../lib/utils";

export default function Modal({
  modalContent,
  modalGallery,
  modalId,
  category,
  project,
  projectModal,
}: {
  modalContent:
    | null
    | Project
    | NonNullable<ImagesBlock["images"]>[number]
    | NonNullable<
        NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]
      >[number];
  modalGallery: (
    | Project
    | NonNullable<ImagesBlock["images"]>[number]
    | NonNullable<
        NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]
      >[number]
  )[];
  modalId: string | null;
  category: string | null;
  project?: string | null;
  projectModal?: boolean;
}) {
  const [isExpand, setExpand] = useState<boolean>(false);
  // lock scroll only if content exists
  useScrollLock(Boolean(modalId && category && modalContent));
  
  if (!modalId || !category || !modalContent) return null;

  function isProjectType(
    item:
      | Project
      | NonNullable<ImagesBlock["images"]>[number]
      | NonNullable<
          NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]
        >[number],
  ): item is Project {
    return "slug" in item;
  }

  function isImageSection(
    item:
      | Project
      | NonNullable<ImagesBlock["images"]>[number]
      | NonNullable<
          NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]
        >[number],
  ): item is NonNullable<
    NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]
  >[number] {
    return "blockType" in item && item.blockType === "imageTitleBlock";
  }

  function isImage(
    item:
      | Project
      | NonNullable<ImagesBlock["images"]>[number]
      | NonNullable<
          NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]
        >[number],
  ): item is NonNullable<ImagesBlock["images"]>[number] {
    return "image" in item;
  }

  function isSection(
    item:
      | Project
      | NonNullable<ImagesBlock["images"]>[number]
      | NonNullable<
          NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]
        >[number],
  ): item is NonNullable<
    NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]
  >[number] {
    return "blockType" in item && item.blockType === "externalLinkTitleBlock";
  }

  const isProject = isProjectType(modalContent);

  const expandIconHandler = !isExpand ? (
    <ExpandIcon
      className={clsx({
        "text-neutral-800": isProject,
        "text-neutral-100": !isProject,
      })}
    />
  ) : (
    <MinimizeIcon
      className={clsx({
        "text-neutral-800": isProject,
        "text-neutral-100": !isProject,
      })}
    />
  );

  const mainContent = (
    content:
      | Project
      | NonNullable<ImagesBlock["images"]>[number]
      | NonNullable<
          NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]
        >[number],
  ) => {
    let title = null;
    let media = null;
    let moreDetails = null;
    let vertical = false;

    if (isProjectType(content)) {
      title = content.title;

      const thumbnailImage =
        typeof content.thumbnail === "object" ? content.thumbnail : null;

      media = (
        <Image
          src={thumbnailImage?.url || ""}
          width={thumbnailImage?.width || undefined}
          height={thumbnailImage?.height || undefined}
          alt={thumbnailImage?.alt || content.title}
        />
      );

      const year = content.singleContent?.date?.split("-").at(0);

      const linkBlock = (
        <a
          href={`${content.singleContent?.externalLinkTitleGroup?.externalLink}`}
          className="text-stone-900 underline"
        >
          {content.singleContent?.externalLinkTitleGroup?.name}
        </a>
      );

      moreDetails = (
        <>
          <span className="font-bold">
            Contexto:{" "}
            <div className="font-normal">
              {content.singleContent?.context && (
                <RichText data={content.singleContent.context} className="rich-text" />
              )}
            </div>
          </span>
          <span className="font-bold">
            Função:{" "}
            <span className="font-normal">
              {content.singleContent?.role && content.singleContent.role}
            </span>
          </span>
          {year}
          {linkBlock}
        </>
      );
    } else if (
      (isImageSection(content) &&
        content.blockType === "imageTitleBlock" &&
        typeof content.image === "object") ||
      (isImage(content) && typeof content.image === "object")
    ) {
      if (isImageSection(content)) title = content.title;

      if (
        content.image.height &&
        content.image.width &&
        content.image.height > content.image.width
      ) {
        vertical = true;
      } else {
        vertical = false;
      }

      media = (
        <Image
          src={content.image.url || ""}
          width={content.image.width || undefined}
          height={content.image.height || undefined}
          alt={content.image.alt || ""}
        />
      );
    } else if (
      isSection(content) &&
      content.blockType === "externalLinkTitleBlock"
    ) {
      title = content.title;
      media = (
        <ReactPlayer
          src={content.externalLink}
          light={true}
          controls={true}
          width="100%"
          height="100%"
          muted={false}
        />
      );
    }

    return (
      <div className="w-full h-auto lg:max-w-[900px] xl:max-w-[1400px] 2xl:max-w-[1800px] flex flex-col lg:flex-row px-4 gap-8 justify-center items-center lg:items-start">
        <div
          className={clsx("w-full h-auto", {
            "xl:max-w-5xl 2xl:max-w-6xl": isProject,
            "aspect-video xl:max-w-5xl 2xl:max-w-6xl": isSection(content),
            "max-w-lg":
              (isImage(content) || isImageSection(content)) && vertical,
            "max-w-6xl":
              (isImage(content) || isImageSection(content)) && !vertical,
          })}
        >
          {media}
        </div>
        <div
          className={clsx("flex flex-col gap-4", {
            hidden: isExpand || (isImage(content) && !isImageSection(content)), // removeDetails
            flex: !isExpand,
            "w-full lg:w-md": isProject,
            "w-fit text-balance": !isProject,
          })}
        >
          <h3
            className={clsx("text-2xl lg:text-3xl 2xl:text-4xl font-medium", {
              "text-neutral-800": isProject,
              "text-neutral-100": !isProject,
            })}
          >
            {title}
          </h3>
          {moreDetails}
        </div>
      </div>
    );
  };

  return (
    <div
      className={clsx("fixed inset-0 z-[9999] bg-gray-300", {
        "bg-gray-300": isProject,
        "bg-neutral-800": !isProject,
      })}
    >
      <div className="w-full h-full relative flex flex-col items-center justify-center overflow-y-auto">
        <div
          className="absolute top-0 left-0 ml-4 mt-4 z-[20] cursor-pointer"
          onClick={() => setExpand(!isExpand)}
        >
          {expandIconHandler}
        </div>
        <Close isProject={isProject} />
        {mainContent(modalContent)}
        <div className="flex items-center absolute inset-y-0 right-0 mr-4">
          <PrevNextButtons
            gallery={modalGallery || []}
            currentId={modalId || ""}
            category={category}
            project={project ? project : null}
            hidePrev
            projectModal={projectModal}
            isProjectStyles={isProject}
          />
        </div>
        <div className="flex items-center absolute inset-y-0 left-0 ml-4">
          <PrevNextButtons
            gallery={modalGallery || []}
            currentId={modalId || ""}
            category={category}
            project={project ? project : null}
            hideNext
            projectModal={projectModal}
            isProjectStyles={isProject}
          />
        </div>
      </div>
    </div>
  );
}
