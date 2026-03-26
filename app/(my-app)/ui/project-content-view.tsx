import Link from "next/link";
import ArrowLeft from "./icons/arrow-left";

import { Project } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import ProjectContentItems from "./project-content-items";

const BackButton = ({ category }: { category: string }) => {
  return (
    <Link
      href={`/portfolio/${category}`}
      className="flex gap-1 items-center group"
    >
      <ArrowLeft className="w-6 h-6 transition-transform duration-150 group-hover:scale-115 group-hover:text-neutral-900" />
      <span className="text-lg transition-transform duration-300 group-hover:text-neutral-900">
        Back
      </span>
    </Link>
  );
};

export default function ProjectContentView({
  projects,
  project,
  category,
}: {
  projects: Project[];
  project: null | Project;
  category: string;
}) {
  // check the hideProject value from Project to change/adapt project details layout
  // check for block type to change styles

  const isSlide = project?.content === "single";
  const isPhotographyGallery =
    project?.content === "multiple" &&
    (typeof project?.category === "object" &&
    project.category.slug === "fotografia") &&
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

  const mainClassName =
    isSlide || isPhotographyGallery
      ? `flex flex-col w-full items-center justify-center mx-4 lg:mx-6 ${isSlide ? "lg:max-w-4xl xl:max-w-5xl lg:mx-0" : null}`
      : "flex flex-col w-full items-start bg-white md:items-center";
  const textClassName =
    isSlide || isPhotographyGallery
      ? "flex flex-col gap-4 my-4 self-start"
      : `w-full flex flex-col items-center py-15 text-neutral-900 px-4 gap-7 ${isSection ? "bg-neutral-800 text-white" : null}`;

  const titleClassName =
    isSlide || isPhotographyGallery
      ? "text-2xl lg:text-4xl font-medium"
      : `w-full text-center ${isSection ? "text-2xl lg:text-3xl font-special tracking-wider" : "text-3xl lg:text-5xl font-quicksand"}`;

  const descriptionClassName =
    isSlide || isPhotographyGallery
      ? ""
      : "w-full md:w-2xl whitespace-pre-line text-center text-xl";

  const backButton =
    isSlide || isPhotographyGallery ? (
      <div className="py-2 px-2 self-start text-neutral-500">
        <BackButton category={category} />
      </div>
    ) : null;

  return (
    <>
      <div className={mainClassName}>
        {backButton}
        <div className={textClassName}>
          <h1 className={titleClassName}>{project?.title}</h1>
          <div className={descriptionClassName}>
            {project?.description && <RichText data={project.description} />}
          </div>{" "}
        </div>
        <ProjectContentItems
          projects={projects}
          project={project}
          category={category}
        />
      </div>
    </>
  );
}
