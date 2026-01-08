"use client";

import {
  PortfolioGalleryType,
  GalleryItemsProjectBlock,
} from "../lib/definitions";
import clsx from "clsx";
import Link from "next/link";
import ArrowRight from "./icons/arrow-right";
import ArrowLeft from "./icons/arrow-left";

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
  gallery: PortfolioGalleryType[] | GalleryItemsProjectBlock[];
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

  const currentIndex = gallery.findIndex((i) => i.id === currentId);
  const galleryLength = gallery?.length - 1;

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

  const getSlug = (item: PortfolioGalleryType | GalleryItemsProjectBlock | null) => {
    if(!item) return "";
    if (item.__typename === 'GalleryPortfolioRecord') {
      return item.projectId?.project || "";
    } else if (item.__typename === 'ExternalVideoRecord' || item.__typename === 'GalleryItemRecord') {
      return item.slug || "";
    }
  };

  prevSlug = getSlug(prevProject);
  nextSlug = getSlug(nextProject);

  if (isModal) {
    if (project) {
      urlPrev = `/portfolio/${category}/${project}/watch?id=${prevSlug}`;
      urlNext = `/portfolio/${category}/${project}/watch?id=${nextSlug}`;
    } else {
      urlPrev = `/portfolio/${category}?id=${prevSlug}`;
      urlNext = `/portfolio/${category}?id=${nextSlug}`;
    }
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
    <ArrowLeft
      className={clsx({
        "text-neutral-900": disableBtn !== "prev" && isProject,
        "text-neutral-500": disableBtn === "prev" && (!isProject || isProject),
        "text-neutral-100": disableBtn !== "prev" && !isProject,
      })}
    />
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
    <ArrowRight
      className={clsx({
        "text-neutral-900": disableBtn !== "next" && isProject,
        "text-neutral-500": disableBtn === "next" && (!isProject || isProject),
        "text-neutral-100": disableBtn !== "next"&& !isProject,
      })}
    />
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

  console.log(urlPrev);
  console.log(urlNext);

  console.log(prevSlug);
  console.log(nextSlug);

  return <>{buttonsLayout}</>;
}
