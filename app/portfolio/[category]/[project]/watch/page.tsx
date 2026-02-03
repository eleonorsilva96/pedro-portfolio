import { performRequest } from "@/app/lib/datocms";
import { MoreDetailsProjectData, ContentBlock, GalleryItemsBlock, ContentTypeBlock, SectionProjectBlock } from "@/app/lib/definitions";
import SectionItem from "@/app/ui/section-item";
import ModalContent from "@/app/ui/modal-content";
import clsx from "clsx";
import { Suspense } from "react";

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
          }
        }
      }
    }
  }
`;

const Content = ({ section }: { section: SectionProjectBlock[] }) => {

  if (!section) return null;

  const checkGalleryItems = (item: GalleryItemsBlock) =>
    item.__typename === "ExternalVideoTitleRecord" ||
    item.__typename === "GalleryItemRecord";

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
};

const Modal = ({ section, modalId, category, project }: { section: SectionProjectBlock[], modalId: string, category: string, project: string }) => {
  
  if (!modalId) return null;

  const checkGalleryItems = (item: GalleryItemsBlock) =>
    item.__typename === "ExternalVideoTitleRecord" ||
    item.__typename === "GalleryItemRecord";
  
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

};

export default async function Watch({
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

  const { title, description, contentType } = response.project;

  const isMultipleBlock = (content: ContentTypeBlock) => content.__typename === 'MultipleBlockRecord';
  const findSection = (item: ContentBlock) => item.__typename === 'SectionProjectRecord';

  const section = isMultipleBlock(contentType) ? contentType.content.filter(findSection) : null;
  
  if (!section) return null;

  return (
    <div className="flex flex-col w-full items-start bg-white md:items-center">
      <div className="w-full flex flex-col items-center py-15 bg-neutral-800 text-neutral-50 px-4 gap-7">
        <h3 className="w-full text-center text-2xl lg:text-3xl font-special tracking-wider">{title}</h3>
        <p className="w-full md:w-2xl whitespace-pre-line text-center text-xl">
          {description}
        </p>{" "}
        {/* remove indentation but preserves the line breaks */}
      </div>
      <Content section={section} />
      <Modal section={section} modalId={id} category={category} project={project} />
    </div>
  );
}

