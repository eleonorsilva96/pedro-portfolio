import ImageSkeleton from "./image-skeleton";
import { Project } from "@/payload-types";
import { ImagesBlock } from "./gallery-portfolio";
import clsx from "clsx";

export default function CardPortfolio({
  item,
}: {
  item: (null | Project | NonNullable<ImagesBlock['images']>[number]);
}) {
  if (!item) return null;

  function isProject(item: Project | NonNullable<ImagesBlock['images']>[number]): item is Project {
    return 'slug' in item;
  }

  const projectTitle = isProject(item) ? item.title : null;
  const projectImage = isProject(item) && typeof item.thumbnail === 'object' ? item.thumbnail : null;
  const imageBlock = !isProject(item) && typeof item.image === 'object' ? item.image : null;

  return (
    <div
      className={clsx(
        "relative aspect-[4/2.65] overflow-hidden w-full h-auto rounded-lg shadow-lg cursor-pointer group",
        {
          'bg-purple-300' : isProject(item),
        }
      )}
    >
      <ImageSkeleton
        src={projectImage?.url || imageBlock?.url || ''}
        width={projectImage?.width || imageBlock?.width || undefined}
        height={projectImage?.height || imageBlock?.height || undefined}
        alt={projectImage?.alt || imageBlock?.alt || projectTitle || ''}
        className={clsx(
          {
            "w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" : isProject(item),
          }
        )}
        removeOpacity={!isProject(item)}
      />
      <div className={clsx(
        "absolute opacity-0 group-hover:opacity-100 inset-0 flex items-center justify-center transition-opacity duration-300",
        {
          'hidden': !isProject(item),
        }
      )}>
        <span className="text-center">{projectTitle}</span>
      </div>
    </div>
  );
}
