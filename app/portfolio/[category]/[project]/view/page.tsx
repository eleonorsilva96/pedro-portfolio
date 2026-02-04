import { performRequest } from "@/app/lib/datocms";
import { MoreDetailsProjectData, ContentBlock, GalleryItemsBlock, ContentTypeBlock, SectionProjectBlock, GalleryProjectBlock } from "@/app/lib/definitions";
import SectionItem from "@/app/ui/section-item";
import ModalContent from "@/app/ui/modal-content";
import clsx from "clsx";
import { Suspense } from "react";
import GalleryImage from "@/app/ui/gallery-image";

const PAGE_CONTENT_QUERY = `
  query SectionProject($project: String!) {
    # get a single project by the slug wrapped in a object 
    project(filter: { project: { eq: $project } }) {
      title
      description
      
      contentType {
        __typename
        
        ... on MultipleBlockRecord {
          __typename
          id
          
          content {
            __typename
            
            ... on SectionProjectRecord {
              id
              title
              
              # Level 3: Gallery Items
              galleryItems {
                __typename 
                
                ... on ExternalVideoTitleRecord {
                  __typename
                  id
                  slug
                  title
                  link {
                    url
                    title
                    width
                    height
                    provider
                    providerUid
                    thumbnailUrl
                  }
                }
                
                ... on GalleryItemRecord {
                  __typename
                  id
                  slug
                  title
                  asset {
                    url
                    width
                    height
                    alt
                  }
                }
              }
            }
            ... on GalleryProjectRecord {
              __typename
              id
              asset {
                url
                width
                height
                alt
              }
            }
          }
        }
      }
    }
  }
`;

const Content = ({ content }: { content: (SectionProjectBlock | GalleryProjectBlock)[] }) => {

  if (!content) return null;

  const checkGalleryItems = (item: GalleryItemsBlock) =>
    item.__typename === "ExternalVideoTitleRecord" ||
    item.__typename === "GalleryItemRecord";

  const section = content.filter((item) => item.__typename === 'SectionProjectRecord');
  const gallery = content.filter((item) => item.__typename === 'GalleryProjectRecord');
  // even elements
  const rightList = gallery.filter((_, index) => index % 2 === 0);
  // odd elements
  const leftList = gallery.filter((_, index) => index % 2 !== 0);

  if (section.length !== 0 && gallery.length === 0) {
    return section.map((item, index) => (
      <div key={item.id} className="w-full flex flex-col items-center">
        <div className={clsx(
          "w-full flex flex-col justify-center gap-10 items-center py-15", 
          {
            "bg-black": index % 2 === 0,
            "bg-neutral-800": index % 2 !== 0,
          }
        )}>
          <h3 className="text-white text-3xl lg:text-4xl font-special tracking-wider">{item.title}</h3>
          <div
            className={clsx(
              "w-full max-w-[100vw] flex overflow-x-auto overflow-y-hidden snap-x scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] xl:overflow-x-hidden xl:flex-wrap xl:justify-center gap-4 px-4",
              {
                "md:justify-center": index === section.length - 1,
              },
            )}
          >
            {item.galleryItems
              .filter(checkGalleryItems) // select only the items we need
              .map(
                (
                  galleryItem, // render the items
                ) => (
                  <Suspense key={galleryItem.id} fallback={null}>
                    <SectionItem item={galleryItem} />
                  </Suspense>
                ),
              )}
          </div>
        </div>
      </div>
    ));
  } else {
    return (
      <div className="flex w-full lg:max-w-[950px] gap-8 px-8 mt-8 mb-16">
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
          {gallery.map((item) => (
            <Suspense key={item.id} fallback={null}>
              <GalleryImage item={item} />
            </Suspense>
          ))}
        </div>
      </div>
    );
  } 

};

const Modal = ({ content, modalId, category, project }: { content: (SectionProjectBlock | GalleryProjectBlock)[], modalId: string, category: string, project: string }) => {
  
  if (!modalId) return null;

  const checkGalleryItems = (item: GalleryItemsBlock) =>
    item.__typename === "ExternalVideoTitleRecord" ||
    item.__typename === "GalleryItemRecord";
  
  const section = content.filter((item) => item.__typename === 'SectionProjectRecord');
  const gallery = content.filter((item) => item.__typename === 'GalleryProjectRecord');

  if (section.length !== 0 && gallery.length === 0) {
    return section.map((item) => (
      <div key={item.id}>
        <Suspense fallback={null}>
          <ModalContent
            galleryList={item.galleryItems.filter(checkGalleryItems) || []}
            projectId={modalId}
            category={category}
            project={project}
          />
        </Suspense>
      </div>
    ));
  } else {
    return (
    <Suspense fallback={null}>
      <ModalContent
        galleryList={gallery|| []}
        projectId={modalId}
        category={category}
        project={project}
      />
    </Suspense>
    );
  }
  

};

export default async function View({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; project: string }>;
  searchParams: Promise<{ id: string }>;
}) {
  const { category, project } = await params;
  // if query param id is empty return a empty object
  const { id } = (await searchParams) ?? Promise.resolve({});
  const response = (await performRequest(PAGE_CONTENT_QUERY, {
    variables: {
      project: project,
    },
  })) as MoreDetailsProjectData;

  console.log("PROJECT MORE DETAILS", response);

  const { title, description, contentType } = response.project;

  const isMultipleBlock = (content: ContentTypeBlock) => content.__typename === 'MultipleBlockRecord';
  const findSection = (item: ContentBlock) => item.__typename === 'SectionProjectRecord';
  const findContent = (item: ContentBlock) => item.__typename === 'SectionProjectRecord' || item.__typename === 'GalleryProjectRecord';
  
  const isSection = isMultipleBlock(contentType) ? contentType.content.some(findSection) : false; 
  const checkFontSize = isSection ? "text-2xl lg:text-3xl font-special tracking-wider" : "text-3xl lg:text-5xl font-quicksand";
  const contentItems = isMultipleBlock(contentType) ? contentType.content.filter(findContent) : null;
  
  if (!contentItems) return null;

  return (
    <div className="flex flex-col w-full items-start bg-white md:items-center">
      <div className={clsx(
        "w-full flex flex-col items-center py-15 text-neutral-900 px-4 gap-7",
        {
          "bg-neutral-800 text-white" : isSection
        }
      )}>
        <h3 className={`w-full text-center ${checkFontSize}`}>{title}</h3>
        <p className="w-full md:w-2xl whitespace-pre-line text-center text-xl">
          {description}
        </p>{" "}
        {/* remove indentation but preserves the line breaks */}
      </div>
      <Content content={contentItems} />
      <Modal content={contentItems} modalId={id} category={category} project={project} />
    </div>
  );
}

