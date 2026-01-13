"use client";

import { CategoryRecord } from "@/app/lib/definitions";
import Link from "next/link";
import CardPortfolio from "@/app/ui/card-portfolio";
import { useSearchParams, usePathname } from "next/navigation";
import { useScrollLock } from "@/app/lib/hooks";


export default function GalleryPortfolio({
  data,
  isModal,
}: {
  data: CategoryRecord[];
  isModal: boolean;
}) {
  useScrollLock(isModal); // it only works on client components
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
    return (
      <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data.map((project) => {
        if (project.__typename === "GalleryPortfolioRecord") {
          const params = new URLSearchParams(searchParams); // use utility methods from API to manipulate the URL params
          let newUrl = null;

          if (isModal) {
            params.set("id", project.projectId.project);
            newUrl = `${pathname}?${params.toString()}`;
          } else {
            newUrl = `${pathname}/${project.projectId.project}`;
          }

          return (
            <Link
              key={project.id}
              href={newUrl}
            >
              <div
                key={project.id}
                className="relative aspect-[4/3] overflow-hidden w-full h-auto rounded-lg shadow-lg bg-purple-300 group cursor-pointer" 
              >
                <CardPortfolio
                  project={project}
                />
              </div>
            </Link>
          );
        }
      })}
    </div>
  );
}
