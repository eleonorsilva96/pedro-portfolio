"use client";

import { CategoryRecord, PortfolioGalleryTag } from "@/app/lib/definitions";
import Image from "next/image";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

// add props to receive fetching data
export default function FilteredGallery({
  tags,
  data,
}: {
  tags: PortfolioGalleryTag[];
  data: CategoryRecord[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (slug: string) => {
    const params = new URLSearchParams(searchParams); // use utility methods from API to manipulate the URL params
    if (params.get('filter') === slug) { // remove filter if clicked again
        params.delete('filter');
    } else {
        if (slug) {
          params.set('filter', slug);
        } else {
          params.delete('filter');
        }
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col w-full my-4 ml-8">
      {tags.length > 0 ? (
        <div className="flex items-start self-start gap-2 my-4">
          <span>Filtros:</span>
          <div className="flex gap-4">
            {tags.map((tag) => (
              <div key={tag.id} onClick={() => handleClick(tag.slug)}>
                {tag.title}
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-wrap gap-4">
        {data.map((project) => {
          if (project.__typename === "GalleryPortfolioRecord") {
            return (
              <div
                key={project.id}
                className="overflow-hidden w-full max-w-[600px] h-auto rounded-lg shadow-lg"
              >
                <Image
                  src={project.thumbnail.url}
                  className="w-full h-auto"
                  width={project.thumbnail.width}
                  height={project.thumbnail.height}
                  alt={project.thumbnail.alt}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
