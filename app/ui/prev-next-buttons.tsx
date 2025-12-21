"use client";

import { PortfolioGalleryType } from "../lib/definitions";
// import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import ArrowRight from "./icons/arrow-right";
import ArrowLeft from "./icons/arrow-left";

export default function PrevNextButtons({
  gallery,
  currentId,
  category,
  isTextBtn,
  isModal,
  hidePrev,
  hideNext,
}: {
  gallery: PortfolioGalleryType[];
  currentId: string;
  category: string;
  isTextBtn?: boolean;
  isModal?: boolean;
  hidePrev?: boolean;
  hideNext?: boolean;
}) {
  let disableBtn = null;
  let prevSlug = null;
  let nextSlug = null;
  let urlPrev = null;
  let urlNext = null;

  
  const currentIndex = gallery.findIndex((i) => i.id === currentId);
  
  const galleryLength = gallery?.length - 1;
  
  if (currentIndex === 0) {
    disableBtn = "prev";
  } else if (currentIndex === galleryLength) {
    disableBtn = "next";
  } 
  const prevProject = gallery.at(currentIndex - 1);
  const nextProject = gallery.at(currentIndex + 1);
  
  prevSlug = prevProject?.projectId.project || ''; // if don't exists return a empty string
  nextSlug = nextProject?.projectId.project || '';
  
  if (isModal) {
    urlPrev = `/portfolio/${category}?projectId=${prevSlug}`;
    urlNext = `/portfolio/${category}?projectId=${nextSlug}`;
  } else {
    urlPrev = `/portfolio/${category}/${prevSlug}`;
    urlNext = `/portfolio/${category}/${nextSlug}`;
  }

  const prevButtonType = isTextBtn ? (
    <span className={clsx(
          {
            'text-gray-400': disableBtn === "prev", 
            'text-gray-950': disableBtn !== "prev", 
          },
        )}>Anterior</span>
  ) : (
    <ArrowLeft className={clsx(
          {
            'text-gray-400': disableBtn === "prev", 
            'text-gray-950': disableBtn !== "prev", 
          },
        )}/>
  );

  const nextButtonType = isTextBtn ? (
    <span className={clsx(
          {
            'text-gray-400': disableBtn === "next", 
            'text-gray-950': disableBtn !== "next", 
          },
        )}>Próximo</span>
  ) : (
    <ArrowRight className={clsx(
          {
            'text-gray-400': disableBtn === "next", 
            'text-gray-950': disableBtn !== "next", 
          },
        )}/>
  );

  const buttonsLayout = isTextBtn ? (
    <div className="flex justify-between">
      <Link
        href={urlPrev}
        className={clsx({
          "hidden": hidePrev === true,
          "pointer-events-none cursor-not-allowed": disableBtn === "prev",
          // "opacity-100": disableBtn !== "prev",
        })}
      >
        {prevButtonType}
      </Link>
      <Link
        href={urlNext}
        className={clsx({
          "hidden": hideNext === true,
          "pointer-events-none opacity-50 cursor-not-allowed": disableBtn === "next",
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
          "hidden": hidePrev === true,
          "pointer-events-none cursor-not-allowed": disableBtn === "prev",
          // "opacity-100": disableBtn !== "prev",
        })}
      >
        {prevButtonType}
      </Link>
      <Link
        href={urlNext}
        className={clsx({
          "hidden": hideNext === true,
          "pointer-events-none opacity-50 cursor-not-allowed": disableBtn === "next",
          "opacity-100": disableBtn !== "next",
        })}
      >
        {nextButtonType}
      </Link>
    </>
  );

  console.log(prevSlug)
  console.log(nextSlug)


  return (
    <>
      {buttonsLayout}
    </>
  );
}


// className="flex justify-between w-full"

//  <Link
//         href={urlPrev}
//         className={clsx({
//           "hidden": hidePrev === true,
//           "pointer-events-none cursor-not-allowed": disableBtn === "prev",
//           // "opacity-100": disableBtn !== "prev",
//         })}
//       >
//         {/* Anterior ADD OPACITY HERE*/} 
//         {/* <ArrowLeft className={clsx(
//           {
//             'text-gray-400': disableBtn === "prev", 
//             'text-gray-950': disableBtn !== "prev", 
//           },
//         )}/> */}
//         {prevButtonType}
//       </Link>
//       <Link
//         href={urlNext}
//         className={clsx({
//           "hidden": hideNext === true,
//           "pointer-events-none opacity-50 cursor-not-allowed": disableBtn === "next",
//           "opacity-100": disableBtn !== "next",
//         })}
//       >
//         {/* Próximo ADD OPACITY HERE*/}
//         {/* <ArrowRight className={clsx(
//           {
//             'text-gray-400': disableBtn === "next",
//             'text-gray-950': disableBtn !== "next",
//           },
//         )}/> */}
//         {nextButtonType}
//       </Link>
