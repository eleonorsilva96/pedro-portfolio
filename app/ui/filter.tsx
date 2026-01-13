"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { PortfolioGalleryTag } from "@/app/lib/definitions";
import { useState } from "react";
import clsx from "clsx";

export default function Filter({ tags }: { tags: PortfolioGalleryTag[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [showActive, setActive] = useState<string | null>("all"); // set all as default select

  const handleClick = (slug: string) => {
    const params = new URLSearchParams(searchParams); // use utility methods from API to manipulate the URL params

    if (slug !== "all") {
      if (params.get("filter") === slug) {
        // remove filter if clicked again
        setActive('all');
        params.delete("filter");
      } else {
        if (slug) {
          setActive(slug);
          params.set("filter", slug);
        } else {
          setActive(null);
          params.delete("filter");
        }
      }
    } else {
      setActive(slug);
      params.delete("filter");
    }

    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex items-start self-start gap-2 my-4">
      <div className="flex flex-wrap gap-4">
        {/* check showActive if the slug selected is the one  */}
        <div
          onClick={() => handleClick("all")}
          className={clsx(
            "py-2 px-4 cursor-pointer rounded-full hover:bg-primary-200 hover:text-neutral-900",
            {
              "bg-primary-200 text-neutral-900": showActive === "all",
              "bg-primary-500 text-white": showActive !== "all",
            }
          )}
        >
          Todos
        </div>
        {tags.map((tag) => (
          <div
            key={tag.id}
            onClick={() => handleClick(tag.slug)}
            className={clsx(
              "py-2 px-4 cursor-pointer rounded-full hover:bg-primary-200 hover:text-neutral-900",
              {
                "bg-primary-200 text-neutral-900": showActive === tag.slug,
                "bg-primary-500 text-white": showActive !== tag.slug,
              }
            )}
          >
            {tag.title}
          </div>
        ))}
      </div>
    </div>
  );
}
