import { PortfolioData } from "@/app/lib/definitions";
import { performRequest } from "@/app/lib/datocms";
import Filter from "@/app/ui/filter";
import GalleryPortfolio from "@/app/ui/gallery-portfolio";
import ModalContent from "@/app/ui/modal-content";

// send query to DatoCMS
const PAGE_CONTENT_QUERY = `
  query Portfolio {
    allPortfolioCategories { # get all records from the Portfolio collection model
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
                          title
                          asset {
                            url
                            width
                            height
                            alt
                          }
                        }
                        ... on ImageBlockRecord {
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
    allPortfolioTags {
      id
      title
      slug
      categoryRef {
        ... on PortfolioCategoryRecord {
          slug
        }
      }
    }
  }`;

export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ filter: string; id: string }>;
}) {
  // inside the route props we can get the dynamic url from the route using params
  const { category } = await params;
  const { filter, id } = await searchParams ?? Promise.resolve({}); // if there's no filters return a empty object
  const { allPortfolioCategories, allPortfolioTags } = (await performRequest(
    PAGE_CONTENT_QUERY
  )) as PortfolioData;
  let categoryDataFiltered = null;

  const categoryData = allPortfolioCategories.find((c) => c.slug === category);
  const categoryTags = allPortfolioTags.filter((t) =>
    t.categoryRef.find((r) => r.slug === category)
  );

  const galleryList = categoryData?.gallery.filter(
    (project) => project.__typename === "GalleryPortfolioRecord"
  );

  const isModal =
    category === "animation" || category === "digital-image" ? true : false;

  if (filter) {
    categoryDataFiltered = categoryData?.gallery.filter(
      (p) =>
        p.__typename === "GalleryPortfolioRecord" &&
        p.tag.find((t) => t.slug === filter)
    );
  }

  const modalProject = id
    ? categoryData?.gallery.find(
        (p) =>
          p.__typename === "GalleryPortfolioRecord" &&
          p.projectId.project === id
      )
    : null;

  const isValidProject = modalProject?.__typename === "GalleryPortfolioRecord";

  const sliderContent =
    isValidProject &&
    modalProject.projectId.content.__typename === "SlideProjectRecord"
      ? modalProject.projectId.content
      : null;

  const modal = isValidProject ? (
    <ModalContent
      galleryList={galleryList || []}
      modalProject={modalProject}
      sliderContent={sliderContent}
      projectId={id}
      category={category}
    />
  ) : null;

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full flex-col items-start bg-white md:items-center">
        <h1 className="text-5xl my-4">{categoryData?.title}</h1>
        {categoryData?.description ? <p className="text-center w-4xl">{categoryData?.description}</p> : ""}
        <div className="flex flex-col w-full my-6 px-6">
          {categoryTags.length > 0 ? <Filter tags={categoryTags} /> : ""}
          <GalleryPortfolio
            data={
              filter ? categoryDataFiltered || [] : categoryData?.gallery || []
            }
            isModal={isModal}
          />
        </div>
        {modal}
      </main>
    </div>
  );
}
