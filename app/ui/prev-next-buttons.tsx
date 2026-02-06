"use client";

import {
  PortfolioGalleryType,
  ExternalVideoBlock,
  GalleryProjectBlock,
  GalleryItems
} from "../lib/definitions";
import clsx from "clsx";
import ArrowLeft from "./icons/arrow-left";
import ArrowRight from "./icons/arrow-right";
import Link from "next/link";

export default function PrevNextButtons({
  gallery,
  currentId,
  category,
  project,
  isTextBtn,
  isModal,
  hidePrev,
  hideNext,
  isProject,
}: {
  gallery: (PortfolioGalleryType | GalleryProjectBlock | ExternalVideoBlock | GalleryItems)[];
  // gallery: (PortfolioGalleryType | GalleryItemsProjectBlock | ContentBlock)[];
  currentId: string;
  category: string;
  project?: string | null;
  isTextBtn?: boolean;
  isModal?: boolean;
  hidePrev?: boolean;
  hideNext?: boolean;
  isProject?: boolean;
}) {
  let disableBtn = null;
  let prevSlug = null;
  let nextSlug = null;
  let urlPrev = "#";
  let urlNext = "#";
  let prevProject = null;
  let nextProject = null;

  if (!gallery) return null;

  console.log("GALLERY", gallery);
  
  const findId = (item: PortfolioGalleryType | GalleryProjectBlock | ExternalVideoBlock | GalleryItems) => {
    if (item.__typename === 'GalleryPortfolioRecord') {
      return item.projectId.id === currentId;
    } else {
      return item.id === currentId;
    }
  };
  
  const currentIndex = gallery.findIndex(findId);
  const galleryLength = gallery?.length - 1;

  console.log("CURRENT INDEX", currentIndex);

  if (currentIndex === 0) {
    disableBtn = "prev";
    prevProject = null;
    nextProject = gallery[currentIndex + 1];
  } else if (currentIndex === galleryLength) {
    disableBtn = "next";
    prevProject = gallery[currentIndex - 1];
    nextProject = null;
  } else {
    prevProject = gallery[currentIndex - 1];
    nextProject = gallery[currentIndex + 1];
  }

  const getSlug = (item: PortfolioGalleryType | GalleryProjectBlock | ExternalVideoBlock | GalleryItems | null) => {
    if(!item) return "";
    if (item.__typename === 'GalleryPortfolioRecord') {
      return item.projectId.project || "";
    } else if (item.__typename === 'ExternalVideoTitleRecord' || item.__typename === 'GalleryItemRecord') {
      if (item.slug) {
        return item.slug || "";
      } else {
        return item.id || "";
      }
    } 
    else if (item.__typename === 'GalleryProjectRecord') {
      return item.id || "";
    }
  };

  prevSlug = getSlug(prevProject);
  nextSlug = getSlug(nextProject);

  if (isModal) {
    if (project) {
      urlPrev = `/portfolio/${category}/${project}?id=${prevSlug}`;
      urlNext = `/portfolio/${category}/${project}?id=${nextSlug}`;
    } else {
      urlPrev = `/portfolio/${category}?id=${prevSlug}`;
      urlNext = `/portfolio/${category}?id=${nextSlug}`;
    }
  // slide nav
  } else {
    urlPrev = `/portfolio/${category}/${prevSlug}`;
    urlNext = `/portfolio/${category}/${nextSlug}`;
  }

  const prevButtonType = isTextBtn ? (
    <span
      className={clsx({
        "text-neutral-400": disableBtn === "prev",
        "text-neutral-900": disableBtn !== "prev",
      })}
    >
      Anterior
    </span>
  ) : (
    <div className="relative z-50">
      <ArrowLeft
        className={clsx(
          'w-10 h-10 lg:w-12 lg:h-12',
          {
            "text-neutral-900": disableBtn !== "prev" && isProject,
            "text-neutral-500": disableBtn === "prev" && (!isProject || isProject),
            "text-neutral-100": disableBtn !== "prev" && !isProject,
          }
        )}
      />
      <div className="absolute inset-0 -z-10 w-10 h-10 lg:w-12 lg:h-12 bg-neutral-100/30 rounded-full"></div>
    </div>
  );

  const nextButtonType = isTextBtn ? (
    <span
      className={clsx({
        "text-neutral-400": disableBtn === "next",
        "text-neutral-900": disableBtn !== "next",
      })}
    >
      Próximo
    </span>
  ) : (
    <div className="relative z-50">
      <ArrowRight
        className={clsx(
          'w-10 h-10 lg:w-12 lg:h-12',
          {
            "text-neutral-900": disableBtn !== "next" && isProject,
            "text-neutral-500": disableBtn === "next" && (!isProject || isProject),
            "text-neutral-100": disableBtn !== "next"&& !isProject,
          }
        )}
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
          "pointer-events-none cursor-not-allowed": disableBtn === "prev",
        })}
      >
        {prevButtonType}
      </Link>
      <Link
        href={urlNext}
        className={clsx({
          hidden: hideNext === true,
          "pointer-events-none opacity-50 cursor-not-allowed":
            disableBtn === "next",
          "opacity-100": disableBtn !== "next",
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
          "pointer-events-none cursor-not-allowed": disableBtn === "prev",
        })}
      >
        {prevButtonType}
      </Link>
      <Link
        href={urlNext}
        className={clsx({
          hidden: hideNext === true,
          "pointer-events-none opacity-50 cursor-not-allowed":
            disableBtn === "next",
          "opacity-100": disableBtn !== "next",
        })}
      >
        {nextButtonType}
      </Link>
    </>
  );

  console.log("urlPrev", urlPrev);
  console.log("urlNext", urlNext);

  console.log("prevSlug", prevSlug);
  console.log("nextSlug", nextSlug);

  return <>{buttonsLayout}</>;
}
