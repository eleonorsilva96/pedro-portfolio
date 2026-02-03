import {
  PortfolioGalleryType,
  GalleryItems,
  GalleryRelatedProjects,
} from "@/app/lib/definitions";
import ImageSkeleton from "./image-skeleton";

export default function CardPortfolio({
  project,
}: {
  project: PortfolioGalleryType | GalleryItems | GalleryRelatedProjects;
}) {
  let urlProps = null;
  let widthProps = null;
  let heightProps = null;
  let altProps = null;
  let titleProps = null;

  if (project.__typename === "GalleryPortfolioRecord") {
    urlProps = project.projectId.thumbnail.url;
    widthProps = project.projectId.thumbnail.width;
    heightProps = project.projectId.thumbnail.height;
    altProps = project.projectId.thumbnail.alt;
    titleProps = project.projectId.title;
  } else if (project.__typename === "GalleryItemRecord") {
    urlProps = project.asset.url;
    widthProps = project.asset.width;
    heightProps = project.asset.height;
    altProps = project.asset.alt;
    titleProps = project.title;
  } else {
    urlProps = project.project.thumbnail.url;
    widthProps = project.project.thumbnail.width;
    heightProps = project.project.thumbnail.height;
    altProps = project.project.thumbnail.alt;
    titleProps = project.project.title;
  }

  return (
    <div
      className="relative aspect-[4/2.65] overflow-hidden w-full h-auto rounded-lg shadow-lg bg-purple-300 group cursor-pointer"
    >
      <ImageSkeleton
        src={urlProps}
        width={widthProps}
        height={heightProps}
        alt={altProps}
        className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
      />
      <div className="absolute opacity-0 group-hover:opacity-100 inset-0 flex items-center justify-center transition-opacity duration-300">
        <span className="text-center">{titleProps}</span>
      </div>
    </div>
  );
}
