import { PortfolioData } from "@/app/lib/definitions";
import { performRequest } from "@/app/lib/datocms";
import Filter from "@/app/ui/filter";
import GalleryPortfolio from "@/app/ui/gallery-portfolio";
import CardTextMedia from "@/app/ui/card-text-media";
import ReactMarkdown from "react-markdown";
import { Suspense } from "react";
import Modal from "@/app/ui/modal";
import { Metadata } from "next";

const PAGE_CONTENT_QUERY = `
  query Portfolio($slug: String) {
    allPortfolioCategories {
      id
      title
      description
      slug
      cta
      
      gallery {
        __typename

        ... on GalleryPortfolioRecord {
          id
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
              project # Assuming this is your slug field
              title
              description
              thumbnail {
                url
                width
                height
                alt
              }
              
              contentType {
                __typename
                ... on SingleBlockRecord {
                  id 
                  __typename
                  content {
                    __typename 
                    
                    ... on SlideProjectRecord {
                      id 
                      context
                      role
                      date
                      
                      linkBlock {
                        __typename
                        ... on AdditionalLinkBlockRecord {
                          id
                          text
                          link
                        }
                        ... on RelatedProjectBlockRecord {
                          id
                          text
                          link {
                            ... on ProjectRecord {
                              id
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
          }
        }

        ... on MusicPortfolioRecord {
          __typename
          id
          title
          description
          video {
            __typename
            ... on VideoBlockRecord {
              id
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
              id
              externalVideoLink
            }
          }
        }
      }
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
    
    portfolioCategory(filter: { slug: { eq: $slug } }) {
      title
      description
      seo {
        title
        description
        image {
          url
          width
          height
        }
      }
    }
  }`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  const { portfolioCategory } = (await performRequest(PAGE_CONTENT_QUERY, {
    variables: {
      slug: category,
    },
  })) as PortfolioData;

  if (!portfolioCategory) return {};

  const { title, description, seo } = portfolioCategory;

  if (!seo) return {};

  const shareImage = {
    url: seo.image?.url,
    width: seo.image?.width,
    height: seo.image?.height,
    alt: seo.title || title,
  }

  return {
    title: seo.title || title,
    description: seo.description || description,
    openGraph: {
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title || title,
      description: seo.description || description,
      images: [shareImage],
    },
  };
}

export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ filter: string; id: string }>;
}) {
  // inside the route props we can get the dynamic url from the route using params
  const { category } = await params;

  const { filter, id } = (await searchParams) ?? Promise.resolve({}); // if there's no filters return a empty object
  const { allPortfolioCategories, allPortfolioTags } = (await performRequest(
    PAGE_CONTENT_QUERY)) as PortfolioData;
  let categoryDataFiltered = null;

  const categoryData = allPortfolioCategories.find((c) => c.slug === category);
  const categoryTags = allPortfolioTags.filter((t) =>
    t.categoryRef.find((r) => r.slug === category),
  );

  const galleryList = categoryData?.gallery.filter(
    (project) => project.__typename === "GalleryPortfolioRecord",
  );

  const musicList = categoryData?.gallery.filter(
    (project) => project.__typename === "MusicPortfolioRecord",
  );

  const musicCard = musicList?.map((item, index) => {
    const videoLink = item.video.externalVideoLink
      ? item.video.externalVideoLink
      : item.video.videoAsset;

    if (index % 2 === 0) {
      return (
        <CardTextMedia
          key={item.id}
          title={item.title}
          desc={item.description}
          media={videoLink}
          isBlogSection
          isMediaRight
        />
      );
    } else {
      return (
        <CardTextMedia
          key={item.id}
          title={item.title}
          desc={item.description}
          media={videoLink}
          isBlogSection
        />
      );
    }
  });

  const isModal = category === "imagem-digital" ? true : false;

  if (filter) {
    categoryDataFiltered = categoryData?.gallery.filter(
      (p) =>
        p.__typename === "GalleryPortfolioRecord" &&
        p.tag.find((t) => t.slug === filter),
    );
  }

  return (
    <div className="flex flex-col w-full items-center">
      <h1 className="text-5xl mb-4 mt-8 px-4">{categoryData?.title}</h1>
      {categoryData?.description ? (
        <p className="text-center w-full md:w-2xl lg:w-3xl text-lg px-4 min-w-0 break-words">
          {categoryData?.description}
        </p>
      ) : (
        ""
      )}
      {categoryData?.slug !== "musica" ? (
        <div className="flex flex-col w-full my-6 px-6">
          {categoryTags.length > 0 ? (
            <Suspense fallback={null}>
              <Filter tags={categoryTags} />
            </Suspense>
          ) : (
            ""
          )}
          {/* wrap in a suspense component that will check for url params (query params) */}
          <Suspense fallback={null}>
            <GalleryPortfolio
              data={
                filter
                  ? categoryDataFiltered || []
                  : categoryData?.gallery || []
              }
              isModal={isModal}
            />
          </Suspense>
        </div>
      ) : (
        <>
          {musicCard}
          <div className="flex justify-center w-full mt-8 py-14 bg-neutral-400/50 ">
            <ReactMarkdown
              components={{
                p: ({ ...props }) => (
                  <p
                    {...props}
                    className="text-4xl text-stone-900 text-center"
                  ></p>
                ),
                a: ({ ...props }) => (
                  <>
                    <br className="lg:hidden" />{" "}
                    <a
                      {...props}
                      className="!text-stone-900 !underline"
                      target="_blank"
                    />
                  </>
                ),
              }}
            >
              {categoryData?.cta}
            </ReactMarkdown>
          </div>
        </>
      )}
      {id && (
        <Modal content={galleryList || []} modalId={id} category={category} />
      )}
    </div>
  );
}
