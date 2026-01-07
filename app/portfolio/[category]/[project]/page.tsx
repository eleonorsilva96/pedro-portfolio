import { performRequest } from "@/app/lib/datocms";
import { PortfolioData } from "@/app/lib/definitions";
import Slide from "@/app/ui/slide";
import Gallery from "@/app/ui/gallery";
import clsx from "clsx";

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
                        ... on ExternalVideoRecord {
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
                  urlVideo {
                    url
                    title
                    width
                    height
                    provider
                    providerUid
                    thumbnailUrl
                  }
                  video {
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
          uploadVideo {
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
          externalVideoLink
        }
      }
      cta
    }
  }`;

// add props to receive fetching data
export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ category: string; project: string }>;
}) {
  const { category, project } = await params;
  const { allPortfolioCategories } = (await performRequest(
    PAGE_CONTENT_QUERY
  )) as PortfolioData;
  let contentView = null;
  let title = null;
  let description = null;

  console.log("allPortfolioCategories", allPortfolioCategories);

  const categoryRecord = allPortfolioCategories.find(
    (p) =>
      p.slug === category
  );

  const galleryList = categoryRecord?.gallery.filter((project) => project.__typename === 'GalleryPortfolioRecord'); 

  const projectDetails = categoryRecord?.gallery.find(
    (pd) =>
      pd.__typename === "GalleryPortfolioRecord" &&
      pd.projectId.project === project
  );

  
  if (projectDetails?.__typename === "GalleryPortfolioRecord") {
    title = <h1 className="text-5xl">{projectDetails?.projectId.title}</h1>;
    if (projectDetails?.projectId.content.__typename === "SlideProjectRecord") {

      contentView = (
        <Slide
          allProjects={galleryList || []}
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
        <Gallery
          galleryItems={projectDetails?.projectId.content.photosGallery ?? []}
          removeBtn
        />
      );
    } else {
      description = projectDetails?.projectId.content.description;
      contentView = <div>Section Project</div>;
    }
  }
  return (
    <div className="flex justify-center w-full my-4">
      <div
        className={clsx(
          "flex flex-col items-center justify-center gap-8",
          {
            "max-w-1/3":
              projectDetails?.__typename === "GalleryPortfolioRecord" &&
              projectDetails?.projectId.content.__typename ===
                "SlideProjectRecord",
            "w-full":
              projectDetails?.__typename === "GalleryPortfolioRecord" &&
              projectDetails?.projectId.content.__typename ===
                "GalleryProjectRecord",
          }
        )}
      >
        <button className={clsx(
          'self-start',
          {
            'hidden': projectDetails?.__typename === "GalleryPortfolioRecord" &&
              projectDetails?.projectId.content.__typename !==
                "SlideProjectRecord",
          }
        )}>Back</button>
        {title}
        <p className="text-center">{description}</p>
        {contentView}
      </div>
    </div>
  );
}
