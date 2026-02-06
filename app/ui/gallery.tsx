"use client";

import CardGallery from "@/app/ui/card-gallery";
import clsx from "clsx";
import {
  GalleryRelatedProjects,
  GalleryRelatedServices,
  GalleryProjectBlock,
  ExternalVideoBlock,
  GalleryItems
} from "../lib/definitions";
import CardPortfolio from "./card-portfolio";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { saveScrollPosition } from "../lib/utils";

// add props to receive fetching data
export default function Gallery({
  galleryItems,
  hasTitle,
  removeBtn,
}: {
  galleryItems: (
    | GalleryRelatedProjects
    | GalleryRelatedServices
    | ExternalVideoBlock 
    | GalleryItems
    | GalleryProjectBlock
  )[];
  hasTitle?: boolean;
  removeBtn?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  console.log("card title", galleryItems);
  // the method map creates a new array populated with the results of calling a provided function on each element of the current array
  const content = galleryItems.map((item) => {

    if (!item) return null;

    let card = null;
    let cardId = "";
    let cardUrl = "";

    if (
      (item?.__typename === "RelatedServicesBlockRecord" && hasTitle) ||
      item?.__typename === "GalleryProjectRecord"
    ) {
      
      if (item.__typename === "RelatedServicesBlockRecord") {
        const serviceGallery = item.__typename === "RelatedServicesBlockRecord" ? item.service : null;
        
        if (!serviceGallery) return null;
      }
      
      if (item.__typename === "GalleryProjectRecord") {
        const photoGallery = item.__typename === "GalleryProjectRecord" ? item.asset : null;

        if (!photoGallery) return null;
      }

      let imgUrl = "";

      if (item.__typename === "GalleryProjectRecord") {
        const params = new URLSearchParams(searchParams);
        params.set("id", item.id);
        imgUrl = `${pathname}?${params.toString()}`;
      }

      cardId =
        item.__typename === "RelatedServicesBlockRecord"
          ? item.service.id
          : item.id;
      cardUrl =
        item.__typename === "RelatedServicesBlockRecord"
          ? `/services/${item.service.slug}`
          : imgUrl;

      card = (
        <div
          className="group"
          key={
            item.__typename === "RelatedServicesBlockRecord"
              ? item.service.id
              : item.id
          }
        >
          <CardGallery
            imgUrl={
              item.__typename === "RelatedServicesBlockRecord"
                ? item.service.thumbnailImage.url
                : item.asset.url
            }
            width={
              item.__typename === "RelatedServicesBlockRecord"
                ? item.service.thumbnailImage.width
                : item.asset.width
            }
            height={
              item.__typename === "RelatedServicesBlockRecord"
                ? item.service.thumbnailImage.height
                : item.asset.height
            }
            alt={
              item.__typename === "RelatedServicesBlockRecord"
                ? item.service.thumbnailImage.alt
                : item.asset.alt
            }
            hasRadius={!hasTitle}
            title={
              hasTitle && item.__typename === "RelatedServicesBlockRecord"
                ? item.service.title
                : null
            }
          />
        </div>
      );
    } else if (item.__typename === "RelatedProjectsBlockRecord") {

      if(!item.project) return null;

      cardId = item.project.id;
      cardUrl = `/portfolio/${item.project.portfolioCategory.slug}/${item.project.project}`;

      card = <CardPortfolio project={item || {}} />;
    } 

    console.log("id", cardId);
    console.log("url", cardUrl);

    return (
      <Link key={cardId} href={cardUrl} onClick={saveScrollPosition}>
        {card}
      </Link>
    );
  });

  console.log("gallery map", content);

  return (
    <div className="flex flex-col items-center text-center mt-6">
      <div className="grid grid-cols gap-4 lg:flex-row lg:flex-wrap w-full h-auto items-center md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[repeat(4,minmax(0,1fr))]">
        {content}
      </div>
      <Link
        href={`/portfolio/video`}
        className={clsx(
          "font-mulish font-medium flex items-center justify-center w-fit py-3 px-8 mt-8 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-base cursor-pointer",
          {
            hidden: removeBtn === true,
          },
        )}
      >
        Ver Mais
      </Link>
    </div>
  );
}
