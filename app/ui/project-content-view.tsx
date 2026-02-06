import {
  ProjectDataBlock,
  GalleryProjectBlock,
  PortfolioGalleryType,
  SlideProjectBlock,
  SectionProjectBlock,
  GalleryItems,
  ExternalVideoBlock,
} from "../lib/definitions";
import Link from "next/link";
import ArrowLeft from "./icons/arrow-left";
import { Suspense } from "react";
import Gallery from "./gallery";
import Slide from "./slide";
import clsx from "clsx";
import SectionItem from "./section-item";
import GalleryImage from "./gallery-image";
// get category to know which gallery is what 'fotografia' L1 'imagem-digital' L2

// component
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

const ContentView = ({
  project,
  category,
  allProjects,
}: {
  project: ProjectDataBlock;
  category: string;
  allProjects: PortfolioGalleryType[];
}) => {
  const getSection = (projectItem: ProjectDataBlock) => {
    if (
      projectItem.contentType.__typename === "MultipleBlockRecord" &&
      projectItem.contentType.content.some(
        (item) => item.__typename === "SectionProjectRecord",
      )
    ) {
      return projectItem;
    }
  };
  const getSlide = (projectItem: ProjectDataBlock) => {
    if (
      projectItem.contentType.__typename === "SingleBlockRecord" &&
      projectItem.contentType.content.__typename === "SlideProjectRecord"
    ) {
      return projectItem;
    }
  };

  const getPhotoGallery = (projectItem: ProjectDataBlock) => {
    if (
      category === "fotografia" &&
      projectItem.contentType.__typename === "MultipleBlockRecord" &&
      projectItem.contentType.content.some(
        (item) => item.__typename === "GalleryProjectRecord",
      )
    ) {
      return projectItem;
    }
  };

  const getDigitalGallery = (projectItem: ProjectDataBlock) => {
    if (
      category === "imagem-digital" &&
      projectItem.contentType.__typename === "MultipleBlockRecord" &&
      projectItem.contentType.content.some(
        (item) => item.__typename === "GalleryProjectRecord",
      )
    ) {
      return projectItem;
    }
  };

  const section = getSection(project);
  const slide = getSlide(project);
  const photoGallery = getPhotoGallery(project);
  const digitalGallery = getDigitalGallery(project);

  if (slide) {
    return (
      <Slide
        allProjects={allProjects || []}
        projectDetails={(slide.contentType.content as SlideProjectBlock) || {}}
        currentId={slide.id}
        category={category}
      />
    );
  } else if (photoGallery) {
    return (
      <Suspense fallback={null}>
        <Gallery
          galleryItems={
            photoGallery.contentType.content as GalleryProjectBlock[]
          }
          removeBtn
        />
      </Suspense>
    );
  } else if (section) {

    const checkGalleryItems = (item: ExternalVideoBlock | GalleryItems) => // GalleryItemsBlock
      item.__typename === "ExternalVideoTitleRecord" ||
      item.__typename === "GalleryItemRecord";

    const sectionItems = section.contentType.content as SectionProjectBlock[];

    return sectionItems.map((item, index) => (
      <div key={item.id} className="w-full flex flex-col items-center">
        <div
          className={clsx(
            "w-full flex flex-col justify-center gap-10 items-center py-15",
            {
              "bg-black": index % 2 === 0,
              "bg-neutral-800": index % 2 !== 0,
            },
          )}
        >
          <h3 className="text-white text-3xl lg:text-4xl font-special tracking-wider">
            {item.title}
          </h3>
          <div
            className={clsx(
              "w-full max-w-[100vw] flex overflow-x-auto overflow-y-hidden snap-x scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] xl:overflow-x-hidden xl:flex-wrap xl:justify-center gap-4 px-4",
              {
                "md:justify-center": index === sectionItems.length - 1,
              },
            )}
          >
            {item.galleryItems
              .filter(checkGalleryItems) // select only the items we need
              .map((galleryItem) => (
                <Suspense key={galleryItem.id} fallback={null}>
                  <SectionItem item={galleryItem} />
                </Suspense>
              ))}
          </div>
        </div>
      </div>
    ));
  } else if (digitalGallery) {

    const digitalGalleryItems = digitalGallery.contentType
      .content as GalleryProjectBlock[];
    // even elements
    const rightList = digitalGalleryItems.filter((_, index) => index % 2 === 0);
    // odd elements
    const leftList = digitalGalleryItems.filter((_, index) => index % 2 !== 0);
    return (
      <div className="flex w-full lg:max-w-[950px] gap-8 px-8 mb-16">
        {/* right side list */}
        <div className="hidden md:flex md:flex-col md:gap-8">
          {rightList.map((item) => (
            <Suspense key={item.id} fallback={null}>
              <GalleryImage item={item} />
            </Suspense>
          ))}
        </div>
        {/* left side list */}
        <div className="hidden md:flex md:flex-col md:gap-8">
          {leftList.map((item) => (
            <Suspense key={item.id} fallback={null}>
              <GalleryImage item={item} />
            </Suspense>
          ))}
        </div>
        {/* full list */}
        <div className="flex flex-col gap-8 md:hidden">
          {digitalGalleryItems.map((item) => (
            <Suspense key={item.id} fallback={null}>
              <GalleryImage item={item} />
            </Suspense>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default function ProjectContentView({
  project,
  category,
  allProjects,
}: {
  project: ProjectDataBlock;
  category: string;
  allProjects: PortfolioGalleryType[];
}) {
  const isSlide = (projectItem: ProjectDataBlock) =>
    projectItem.contentType.__typename === "SingleBlockRecord" &&
    projectItem.contentType.content.__typename === "SlideProjectRecord";

  const isPhotoGallery = (projectItem: ProjectDataBlock) =>
    category === "fotografia" &&
    projectItem.contentType.__typename === "MultipleBlockRecord" &&
    projectItem.contentType.content.some(
      (item) => item.__typename === "GalleryProjectRecord",
    );

  const isSection = (projectItem: ProjectDataBlock) =>
    projectItem.contentType.__typename === "MultipleBlockRecord" &&
    projectItem.contentType.content.some(
      (item) => item.__typename === "SectionProjectRecord",
    );
    
  const maxWidth = isSlide(project)
    ? "lg:max-w-4xl xl:max-w-5xl lg:mx-0"
    : null;

  const bgSection = isSection(project) ? "bg-neutral-800 text-white" : null;

  const checkFontSize = isSection(project)
    ? "text-2xl lg:text-3xl font-special tracking-wider"
    : "text-3xl lg:text-5xl font-quicksand";

  const mainClassName =
    isSlide(project) || isPhotoGallery(project)
      ? `flex flex-col w-full items-center justify-center mx-4 lg:mx-6 ${maxWidth}`
      : "flex flex-col w-full items-start bg-white md:items-center";
  const textClassName =
    isSlide(project) || isPhotoGallery(project)
      ? "flex flex-col gap-4 mt-4 self-start"
      : `w-full flex flex-col items-center py-15 text-neutral-900 px-4 gap-7 ${bgSection}`;

  const titleClassName =
    isSlide(project) || isPhotoGallery(project)
      ? "text-2xl lg:text-4xl font-medium"
      : `w-full text-center ${checkFontSize}`;

  const descriptionClassName =
    isSlide(project) || isPhotoGallery(project)
      ? ""
      : "w-full md:w-2xl whitespace-pre-line text-center text-xl";

  const backButton =
    isSlide(project) || isPhotoGallery(project) ? (
      <div className="py-2 px-2 self-start text-neutral-500">
        <BackButton category={category} />
      </div>
    ) : null;

  return (
    <>
      <div className={mainClassName}>
        {backButton}
        <div className={textClassName}>
          <h1 className={titleClassName}>{project.title}</h1>
          <p className={descriptionClassName}>{project.description}</p>{" "}
        </div>
        <ContentView
          allProjects={allProjects}
          project={project}
          category={category}
        />
      </div>
    </>
  );
}
