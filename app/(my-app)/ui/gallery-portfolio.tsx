"use client";

import Link from "next/link";
import CardPortfolio from "@/app/(my-app)/ui/card-portfolio";
import { useSearchParams, usePathname } from "next/navigation";
import { Project, Service } from "@/payload-types";
import CardService from "./card-service";

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

  function isProject(item: Project | NonNullable<ImagesBlock['images']>[number] | Service): item is Project {
    return 'slug' in item && 'category' in item;
  }
  
  function isService(item: Project | NonNullable<ImagesBlock['images']>[number] | Service): item is Service {
    return 'slug' in item && 'description' in item && 'image' in item;
  }

  return (
    <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-[repeat(4,minmax(0,1fr))] gap-4">
      {data.map((item) => {
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
              <CardService data={item} />
            ) : (
              <CardPortfolio item={item} />
            )}
          </Link>
        );
      })}
    </div>
  );
}