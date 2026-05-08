"use client";

import Link from "next/link";
import CardPortfolio from "@/app/(my-app)/ui/card-portfolio";
import { useSearchParams, usePathname } from "next/navigation";
import { Project, Service } from "@/payload-types";
import CardService from "./card-service";
import Masonry from "react-masonry-css";

// get me the types of single elements inside multipleContent block (is an array)
export type MultipleContentBlock = NonNullable<Project['multipleContent']>[number];
// extract the images block type
export type ImagesBlock = Extract<MultipleContentBlock, { blockType: 'ImagesBlock' }>

export default function GalleryPortfolio({
  data,
  isModal,
  refProject
}: {
  // array of projects or of single image objects
  data: (Project | NonNullable<ImagesBlock['images']>[number] | Service)[]; // number: means get the type of a single element inside this array
  isModal?: boolean;
  refProject?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const breakpointColumns = {
    default: 3,
    1024: 2,
    640: 1,
  };

  function isProject(item: Project | NonNullable<ImagesBlock['images']>[number] | Service): item is Project {
    return 'slug' in item && 'category' in item;
  }
  
  function isService(item: Project | NonNullable<ImagesBlock['images']>[number] | Service): item is Service {
    return 'slug' in item && 'description' in item && 'image' in item;
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex gap-4"
      columnClassName="flex flex-col gap-4"
    >
      {data.map((item, index) => {
        const params = new URLSearchParams(searchParams); // use utility methods from API to manipulate the URL params
        let newUrl = null;
        const projectSlug = isProject(item) ? item.slug : null;
        const projectCategory = isProject(item) ? typeof item.category === 'object' && item.category.slug : null;
        const serviceSlug = isService(item) ? item.slug : null;

        if (isModal) {
          params.set("id", item?.id || ''); // add a fallback string to avoid showing null or undefined in the search param
          newUrl = `${pathname}?${params.toString()}`; // set the url to show a search param when the card opens a modal
        } else if (refProject) {
          newUrl = `/portfolio/${projectCategory}/${projectSlug}`;
        } else if (isService(item)) {
          newUrl = `/services/${serviceSlug}`;
        } else {
          newUrl = `${pathname}/${projectSlug}`;
        }

        return (
          <Link key={item?.id} href={newUrl} className="group">
            {isService(item) ? (
              <CardService data={item} priority={index === 0} />
            ) : (
              <CardPortfolio item={item} priority={index === 0} />
            )}
          </Link>
        );
      })}
    </Masonry>
  );
}