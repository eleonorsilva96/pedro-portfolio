"use client";

import clsx from "clsx";
import ArrowLeft from "./icons/arrow-left";
import ArrowRight from "./icons/arrow-right";
import Link from "next/link";
import { Project } from "@/payload-types";
import { ImagesBlock } from "./gallery-portfolio";
import { SectionsBlock } from "./sections";

export default function PrevNextButtons({
  gallery,
  currentId,
  category,
  project,
  isTextBtn,
  hidePrev,
  hideNext,
  projectModal,
  isProjectStyles,
}: {
  gallery: (
    | Project
    | NonNullable<ImagesBlock["images"]>[number]
    | NonNullable<NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]>[number]
  )[];
  currentId: string | undefined;
  category: string;
  project?: string | null;
  isTextBtn?: boolean;
  isModal?: boolean;
  hidePrev?: boolean;
  hideNext?: boolean;
  projectModal?: boolean;
  isProjectStyles?: boolean;
}) {
  let disableBtn = null;
  let urlPrev = "#";
  let urlNext = "#";
  let prevProject = null;
  let nextProject = null;

  console.log("gallery", gallery);

  if (!gallery) return null;

  // type guard
  function isProject(
    item:
      | Project
      | NonNullable<ImagesBlock["images"]>[number]
      | NonNullable<NonNullable<SectionsBlock["sections"]>[number]["sectionContent"]>[number],
  ): item is Project {
    return "slug" in item;
  }

  // i need to check if the element is a object because it could be a string
  const currentIndex = gallery.findIndex((element) => element.id === currentId); // find the index of the current element/project
  const galleryLength = gallery.length - 1;

  if (currentIndex === 0) {
    if (gallery.length === 1) {
      disableBtn = "both";
      prevProject = null;
      nextProject = null;
    } else {
      disableBtn = "prev";
      prevProject = null;
      nextProject = gallery[currentIndex + 1];
    }
  } else if (currentIndex === galleryLength) {
    disableBtn = "next";
    prevProject = gallery[currentIndex - 1];
    nextProject = null;
  } else {
    prevProject = gallery[currentIndex - 1];
    nextProject = gallery[currentIndex + 1];
  }

  console.log("prevProject");
  console.log(prevProject);
  console.log("nextProject");
  console.log(nextProject);

  if (prevProject) {
    if (isProject(prevProject)) {
      if (projectModal) {
        urlPrev = `/portfolio/${category}?id=${prevProject.id}`;
      } else {
        urlPrev = `/portfolio/${category}/${prevProject.slug}`;
      }
    } else {
      urlPrev = `/portfolio/${category}/${project}?id=${prevProject.id}`;
    }
  }

  if (nextProject) {
    if (isProject(nextProject)) {
      if (projectModal) {
        urlNext = `/portfolio/${category}?id=${nextProject.id}`;
      } else {
        urlNext = `/portfolio/${category}/${nextProject.slug}`;
      }
    } else {
      urlNext = `/portfolio/${category}/${project}?id=${nextProject.id}`;
    }
  }

  const prevButtonType = isTextBtn ? (
    <span
      className={clsx({
        "text-neutral-400": disableBtn === "prev" || disableBtn === "both",
        "text-neutral-900": disableBtn !== "prev" && disableBtn !== "both",
      })}
    >
      Anterior
    </span>
  ) : (
    <div className="relative z-50">
      <ArrowLeft
        className={clsx("w-10 h-10 lg:w-12 lg:h-12", {
          "text-neutral-900":
            disableBtn !== "prev" && disableBtn !== "both" && isProjectStyles,
          "text-neutral-500":
            disableBtn === "prev" ||
            (disableBtn === "both" && (!isProjectStyles || isProjectStyles)),
          "text-neutral-100":
            disableBtn !== "prev" && disableBtn !== "both" && !isProjectStyles,
        })}
      />
      <div className="absolute inset-0 -z-10 w-10 h-10 lg:w-12 lg:h-12 bg-neutral-100/30 rounded-full"></div>
    </div>
  );

  const nextButtonType = isTextBtn ? (
    <span
      className={clsx({
        "text-neutral-400": disableBtn === "next" || disableBtn === "both",
        "text-neutral-900": disableBtn !== "next" && disableBtn !== "both",
      })}
    >
      Próximo
    </span>
  ) : (
    <div className="relative z-50">
      <ArrowRight
        className={clsx("w-10 h-10 lg:w-12 lg:h-12", {
          "text-neutral-900":
            disableBtn !== "next" && disableBtn !== "both" && isProjectStyles,
          "text-neutral-500":
            disableBtn === "next" ||
            (disableBtn === "both" && (!isProjectStyles || isProjectStyles)),
          "text-neutral-100":
            disableBtn !== "next" && disableBtn !== "both" && !isProjectStyles,
        })}
      />
      <div className="absolute inset-0 -z-10 w-10 h-10 lg:w-12 lg:h-12 bg-neutral-100/30 rounded-full"></div>
    </div>
  );

  const buttonsLayout = isTextBtn ? (
    <div className="flex justify-between">
      <Link
        href={urlPrev}
        className={clsx({
          hidden: hidePrev === true,
          "pointer-events-none cursor-not-allowed":
            disableBtn === "prev" || disableBtn === "both",
        })}
      >
        {prevButtonType}
      </Link>
      <Link
        href={urlNext}
        className={clsx({
          hidden: hideNext === true,
          "pointer-events-none opacity-50 cursor-not-allowed":
            disableBtn === "next" || disableBtn === "both",
          "opacity-100": disableBtn !== "next" && disableBtn !== "both",
        })}
      >
        {nextButtonType}
      </Link>
    </div>
  ) : (
    <>
      <Link
        href={urlPrev}
        className={clsx({
          hidden: hidePrev === true,
          "pointer-events-none cursor-not-allowed":
            disableBtn === "prev" || disableBtn === "both",
        })}
      >
        {prevButtonType}
      </Link>
      <Link
        href={urlNext}
        className={clsx({
          hidden: hideNext === true,
          "pointer-events-none opacity-50 cursor-not-allowed":
            disableBtn === "next" || disableBtn === "both",
          "opacity-100": disableBtn !== "next" && disableBtn !== "both",
        })}
      >
        {nextButtonType}
      </Link>
    </>
  );

  return <>{buttonsLayout}</>;
}
