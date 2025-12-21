import { PortfolioGalleryType } from "@/app/lib/definitions";
import ImageSkeleton from "./image-skeleton";

export default function CardPortfolio({
  project
}: {
  project: PortfolioGalleryType;
}) {

  return (
    <>
    <ImageSkeleton 
        src={project.thumbnail.url}
        width={project.thumbnail.width}
        height={project.thumbnail.height}
        alt={project.thumbnail.alt}
        className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
    />
      <div
        className="absolute opacity-0 group-hover:opacity-100 inset-0 flex items-center justify-center transition-opacity duration-300"
      >
        <span className="text-center">{project.projectId.title}</span>
      </div>
    </>
  );
}
