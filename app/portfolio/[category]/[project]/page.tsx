import { performRequest } from "@/app/lib/datocms";
import { PortfolioData } from "@/app/lib/definitions";
import Slide from "@/app/ui/slide";
import Gallery from "@/app/ui/gallery";
import clsx from "clsx";
import ArrowLeft from "@/app/ui/icons/arrow-left";
import Link from "next/link";
import ModalContent from "@/app/ui/modal-content";
import { Suspense } from "react";

// send query to DatoCMS
const PAGE_CONTENT_QUERY = `
  query Portfolio {
    allPortfolioCategories { # get all records from the collection model
      title
      description
      slug
      # multiple field blocks
      gallery {
        ... on GalleryPortfolioRecord {
          __typename
          id
          thumbnail {
            url
            width
            height
            alt
          }
          tag {
            ... on PortfolioTagRecord {
              id
              title
              slug
              categoryRef {
                ... on PortfolioCategoryRecord {
                  slug
                }
              }
            }
          }
          projectId {
            ... on ProjectRecord {
              id
              title
              project
              content {
                ... on GalleryProjectRecord {
                  __typename
                  description
                  photosGallery {
                    ... on ImageBlockRecord {
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
                ... on SectionProjectRecord {
                  __typename
                  description
                  section {
                    ... on CardGalleryRecord {
                      title
                      galleryItems {
                        ... on ExternalVideoTitleRecord {
                          __typename
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
                          title
                          asset {
                            url
                            width
                            height
                            alt
                          }
                        }
                        ... on ImageBlockRecord {
                          __typename
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
                ... on SlideProjectRecord {
                  __typename
                  id
                  videoMedia {
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
                  context
                  role
                  date
                  linkBlock {
                    ... on AdditionalLinkBlockRecord {
                      __typename
                      text
                      link
                    }
                    ... on RelatedProjectBlockRecord {
                      __typename
                      text
                      link { # Link to another Record
                        id
                        title
                        project
                      }
                    }
                  }
                }
              }
            }
          }
        }
        ... on MusicPortfolioRecord {
          __typename
          id
          title
          description
          video {
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
            ... on ExternalVideoStringRecord {
              externalVideoLink
            }
          }
        }
      }
      cta
    }
  }`;

// add props to receive fetching data
export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; project: string }>;
  searchParams: Promise<{ id: string }>;
}) {
  const { category, project } = await params;
  const { allPortfolioCategories } = (await performRequest(
    PAGE_CONTENT_QUERY,
  )) as PortfolioData;
  // if query param id is empty return a empty object
  const { id } = (await searchParams) ?? Promise.resolve({});

  let contentView = null;
  let title = null;
  let description = null;

  console.log("allPortfolioCategories", allPortfolioCategories);

  const categoryRecord = allPortfolioCategories.find(
    (p) => p.slug === category,
  );
  // to return in one single array
  const projectGallery = categoryRecord?.gallery.flatMap((p) => {
    if (
      p.__typename === "GalleryPortfolioRecord" &&
      p.projectId.project === project &&
      p.projectId.content.__typename === "GalleryProjectRecord"
    ) {
      return p.projectId.content.photosGallery;
    }
    return [];
  });

  console.log("projectGallery", projectGallery);

  const gallerySlideList = categoryRecord?.gallery.filter(
    (project) => project.__typename === "GalleryPortfolioRecord",
  );

  const projectDetails = categoryRecord?.gallery.find(
    (pd) =>
      pd.__typename === "GalleryPortfolioRecord" &&
      pd.projectId.project === project,
  );

  if (projectDetails?.__typename === "GalleryPortfolioRecord") {
    title = (
      <h1 className="w-full text-5xl">{projectDetails?.projectId.title}</h1>
    );
    if (projectDetails?.projectId.content.__typename === "SlideProjectRecord") {
      contentView = (
        <Slide
          allProjects={gallerySlideList || []}
          projectDetails={projectDetails || {}}
          currentId={projectDetails.id}
          category={category}
        />
      );
    } else if (
      projectDetails?.projectId.content.__typename === "GalleryProjectRecord"
    ) {
      description = projectDetails?.projectId.content.description;
      contentView = (
        <Suspense fallback={null}>
          <Gallery
            galleryItems={projectDetails?.projectId.content.photosGallery ?? []}
            removeBtn
          />
        </Suspense>
      );
    } else {
      description = projectDetails?.projectId.content.description;
      contentView = <div>Section Project</div>;
    }
  }

  const modal = id ? (
    <Suspense fallback={null}>
      <ModalContent
        galleryList={projectGallery || []}
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
              projectDetails?.__typename === "GalleryPortfolioRecord" &&
              projectDetails?.projectId.content.__typename ===
                "SlideProjectRecord",
          },
        )}
      >
        <div
          className={clsx("py-2 px-2 self-start text-neutral-500", {
            hidden:
              projectDetails?.__typename === "GalleryPortfolioRecord" &&
              projectDetails?.projectId.content.__typename !==
                "SlideProjectRecord" &&
              projectDetails.projectId.content.__typename !==
                "GalleryProjectRecord",
          })}
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
          {title}
          <p>{description}</p>
        </div>
        {contentView}
      </div>
      {modal}
    </div>
  );
}
