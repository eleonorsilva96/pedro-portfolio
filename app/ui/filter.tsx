"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { PortfolioGalleryTag } from "@/app/lib/definitions";

export default function Filter({ tags }: { tags: PortfolioGalleryTag[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (slug: string) => {
    const params = new URLSearchParams(searchParams); // use utility methods from API to manipulate the URL params

    if (slug !== "all") {
      if (params.get("filter") === slug) {
        // remove filter if clicked again
        params.delete("filter");
      } else {
        if (slug) {
          params.set("filter", slug);
        } else {
          params.delete("filter");
        }
      }
    } else {
      params.delete("filter");
    }

    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex items-start self-start gap-2 my-4">
      <div className="flex flex-wrap gap-4">
        <div onClick={() => handleClick("all")}>Todos</div>
        {tags.map((tag) => (
          <div key={tag.id} onClick={() => handleClick(tag.slug)}>
            {tag.title}
          </div>
        ))}
      </div>
    </div>
  );
}
