import { performRequest } from "@/app/lib/datocms";
import { ProjectData, PortfolioGalleryType } from "@/app/lib/definitions";
import Slide from "@/app/ui/slide";
import Gallery from "@/app/ui/gallery";
import clsx from "clsx";
import ArrowLeft from "@/app/ui/icons/arrow-left";
import Link from "next/link";
import ModalContent from "@/app/ui/modal-content";
import { Suspense } from "react";

// send query to DatoCMS
const PAGE_CONTENT_QUERY = `
  query Project($project: String!, $category: String!) {
    # Get a single project by the slug
    project(filter: { project: { eq: $project } }) {
      id
      title
      description
      
      contentType {
        __typename
        ... on MultipleBlockRecord {
          id
          content {
            __typename
            ... on GalleryProjectRecord {
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
        ... on SingleBlockRecord {
          id
          content {
            __typename
            ... on SlideProjectRecord {
              id
              context
              role
              date
              videoMedia {
                __typename
                ... on ExternalVideoRecord {
                  externalVideo {
                    url
                    title
                    width
                    height
                    provider
                    providerUid
                    thumbnailUrl
                  }
                }
                ... on VideoBlockRecord {
                  videoAsset {
                    url
                    alt
                    video {
                      muxPlaybackId
                      title
                      width
                      height
                      blurUpThumb
                    }
                  }
                }
              }
              linkBlock {
                __typename
                ... on AdditionalLinkBlockRecord {
                  text
                  link
                }
                ... on RelatedProjectBlockRecord {
                  text
                  link {
                    ... on ProjectRecord {
                      project
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    # get gallery by category to handle projects navigation 
    allPortfolioCategories(filter: { slug: { eq: $category } }){
      gallery {
        ... on GalleryPortfolioRecord {
          __typename
          projectId {
            ... on ProjectRecord {
              id
              project 
            }
          }
        }
      }   
    }
  }
`;

// add props to receive fetching data
export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; project: string }>;
  searchParams: Promise<{ id: string }>;
}) {
  const { category, project } = await params;

  // if URL param id is empty return a empty object
  const { id } = (await searchParams) ?? Promise.resolve({});

  const response = (await performRequest(PAGE_CONTENT_QUERY, {
    variables: {
      project: project,
      category: category,
    },
  })) as ProjectData;

  if (!response) return null;
  
  const { allPortfolioCategories } = response;
  const { title, description, contentType } = response.project;
  const projectId = response.project.id;
  
  const portfolioGallery = allPortfolioCategories[0].gallery.filter((item) => item.__typename === 'GalleryPortfolioRecord') as PortfolioGalleryType[];

  let contentView = null;
  
  if (contentType.__typename === 'SingleBlockRecord' && contentType.content.__typename === 'SlideProjectRecord') {
    contentView = (
      <Slide
        allProjects={portfolioGallery || []}
        projectDetails={contentType.content || {}}
        currentId={projectId}
        category={category}
      />
    );
  } else if (contentType.__typename === 'MultipleBlockRecord') {
    contentView = (
      <Suspense fallback={null}>
        <Gallery
          galleryItems={contentType.content ?? []}
          removeBtn
        />
      </Suspense>
    );
  }

  const modal = id ? (
    <Suspense fallback={null}>
      <ModalContent
        galleryList={contentType.__typename === 'MultipleBlockRecord'? contentType.content || [] : []}
        projectId={id}
        category={category}
        project={project}
      />
    </Suspense>
  ) : null;

  return (
    <div className="flex justify-center w-full my-4">
      <div
        className={clsx(
          "flex flex-col w-full items-center justify-center mx-4 lg:mx-6",
          {
            "lg:max-w-4xl xl:max-w-5xl lg:mx-0":
              contentType.__typename === 'SingleBlockRecord' && contentType.content.__typename === 'SlideProjectRecord',
          },
        )}
      >
        <div
          className="py-2 px-2 self-start text-neutral-500"
        >
          <Link
            href={`/portfolio/${category}`}
            className="flex gap-1 items-center group"
          >
            <ArrowLeft className="w-6 h-6 transition-transform duration-150 group-hover:scale-115 group-hover:text-neutral-900" />
            <span className="text-lg transition-transform duration-300 group-hover:text-neutral-900">
              Back
            </span>
          </Link>
        </div>
        <div className="flex flex-col gap-4 mt-4 self-start">
          <h1 className="text-2xl lg:text-4xl font-medium">{title}</h1>
          <p>{description}</p>
        </div>
        {contentView}
      </div>
      {modal}
    </div>
  );
}
