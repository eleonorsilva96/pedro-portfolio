import { Project } from "@/payload-types";
import Slide from "./slide";
import { Suspense } from "react";
import GalleryPortfolio from "./gallery-portfolio";
import Sections from "./sections";
import GalleryVertical from "./gallery-vertical";


export default function ProjectContentItems({
  projects,
  project,
  category,
}: {
  projects: Project[];
  project: null | Project;
  category: string;
}) {
  console.log("Project Details");
  console.log(project);

  const isSlide = project?.content === "single";
  const isPhotographyGallery =
    project?.content === "multiple" &&
    (typeof project?.category === "object" &&
    project.category.slug === "fotografia") &&
    project?.multipleContent?.some((block) => block.blockType === "ImagesBlock")
      ? true
      : false;
  const isDigitalImageGallery =
    project?.content === "multiple" &&
    (typeof project?.category === "object" &&
      project.category.slug === "imagem-digital") &&
    project?.multipleContent?.some((block) => block.blockType === "ImagesBlock")
      ? true
      : false;
  const isSection = 
  project?.content === "multiple" &&  
  project?.multipleContent?.some(
    (block) => block.blockType === "SectionsBlock",
  )
    ? true
    : false;

  if (isSlide) {
    return (
      <Slide
        projects={projects}
        projectDetails={project?.singleContent}
        projectId={project?.id}
        category={category}
      />
    );
  } else if (isPhotographyGallery) {
    const imagesProject = project?.multipleContent?.find(
      (block) => block.blockType === "ImagesBlock",
    );
    return (
      <Suspense fallback={null}>
        <GalleryPortfolio data={imagesProject?.images || []} isModal />
      </Suspense>
    );
  } else if (isSection) {
    const sectionsBlock = project?.multipleContent?.find(
      (block) => block.blockType === "SectionsBlock",
    );
    return (
      <Sections sectionsData={sectionsBlock?.sections || []} />
    )
  } else if (isDigitalImageGallery) {
    const imagesContent = project?.multipleContent?.find(
      (content) => content.blockType === "ImagesBlock",
    );

    const rightList = imagesContent?.images?.filter((_, index) => index % 2 === 0);

    const leftList = imagesContent?.images?.filter((_, index) => index % 2 !== 0);

    console.log("Right List", rightList);
    console.log("Left List", leftList);

    return (
      <div className="flex w-full lg:max-w-[950px] gap-8 px-8 mb-16">
        {/* right side list - desktop */}
        <div className="hidden md:flex md:flex-col md:gap-8">
          {rightList?.map((image) => (
            <Suspense key={image.id} fallback={null}>
              <GalleryVertical image={image} />
            </Suspense>
          ))}
        </div>
        {/* left side list - desktop */}
        <div className="hidden md:flex md:flex-col md:gap-8">
          {leftList?.map((image) => (
            <Suspense key={image.id} fallback={null}>
              <GalleryVertical image={image} />
            </Suspense>
          ))}
        </div>
        {/* single list - mobile */}
        <div className="flex flex-col gap-8 md:hidden">
          {imagesContent?.images?.map((image) => (
            <Suspense key={image.id} fallback={null}>
              <GalleryVertical image={image} />
            </Suspense>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
