"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { Tag } from "@/payload-types";

export default function Filter({ tags }: { tags: (string | Tag)[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [showActive, setActive] = useState<string | null>("all"); // set all as default select

  const handleClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams); // use utility methods from API to manipulate the URL params

    // if slug is null set the active state to null and delete the URL param
    if (!slug) {
        setActive(null);
        params.delete("filter");
    } else {
      if (slug !== "all") {
        // if filter is already selected select all and remove filter
        if (params.get("filter") === slug) {
          setActive('all');
          params.delete("filter");
        } else {
          setActive(slug);
          params.set("filter", slug);
        }
      } else {
        setActive(slug);
        params.delete("filter");
      }
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
        {tags.map((tag) => {
          const tagObj = typeof tag === 'object' ? tag : null;
          const tagSlug = tagObj?.slug ? tagObj.slug : null;
    
        return (
          <div
            key={tagObj?.id}
            onClick={() => handleClick(tagSlug)}
            className={clsx(
              "py-2 px-4 cursor-pointer rounded-full hover:bg-primary-200 hover:text-neutral-900",
              {
                "bg-primary-200 text-neutral-900": showActive === tagSlug,
                "bg-primary-500 text-white": showActive !== tagSlug,
              }
            )}
          >
            {tagObj?.title}
          </div>
        )})}
      </div>
    </div>
  );
}
