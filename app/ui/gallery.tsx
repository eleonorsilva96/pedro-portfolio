import CardGallery from "@/app/ui/card-gallery";
import clsx from "clsx";
import {
  PortfolioPhotoImage,
  GalleryItemsType,
} from "../lib/definitions";
import CardPortfolio from "./card-portfolio";
import Link from "next/link";

// add props to receive fetching data
export default async function Gallery({
  galleryItems,
  hasTitle,
  removeBtn,
}: {
  galleryItems: GalleryItemsType[] | PortfolioPhotoImage[];
  hasTitle?: boolean;
  removeBtn?: boolean;
}) {
  console.log("card title", galleryItems);

  const content = galleryItems.map((item) => {
    let card = null;

    if (
      (item?.__typename === "RelatedServicesBlockRecord" && hasTitle) ||
      item?.__typename === "ImageBlockRecord"
    ) {
      card = (
        <CardGallery
          key={item.__typename === "ImageBlockRecord" ? item.id : null}
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
      );
    } else if (item.__typename === "RelatedProjectsBlockRecord") {
      card = (
        <div
          key={item.project.id}
          className="relative aspect-[4/3] overflow-hidden w-full h-auto rounded-lg shadow-lg bg-purple-300 group cursor-pointer"
        >
          <CardPortfolio project={item || {}} />
        </div>
      );
    }

    if (
      item?.__typename === "RelatedServicesBlockRecord" ||
      item.__typename === "RelatedProjectsBlockRecord"
    ) {
      return (
        <Link
          key={
            item.__typename === "RelatedServicesBlockRecord"
              ? item.service.id
              : item.project.id
          }
          href={
            item.__typename === "RelatedServicesBlockRecord"
              ? `services/${item.service.slug}`
              : `portfolio/${item.project.portfolioCategory.slug}/${item.project.project}`
          }
        >
          {card}
        </Link>
      );
    } else {
      return card;
    }
  });

  return (
    <div className="flex flex-col items-center text-center">
      <div className="grid grid-cols gap-4 lg:flex-row lg:flex-wrap w-full h-auto items-center md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {content}
      </div>
      <Link
        href={`/portfolio/video`}
        className={clsx(
          "flex items-center justify-center w-fit py-3 px-8 mt-8 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-base cursor-pointer",
          {
            hidden: removeBtn === true,
          }
        )}
      >
        Ver Mais
      </Link>
    </div>
  );
}
