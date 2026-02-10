import { performRequest } from "@/app/lib/datocms";
import { HomeData } from "@/app/lib/definitions";
import HomeContent from "./ui/home-content";
import { Metadata } from "next";

// send query to DatoCMS
const PAGE_CONTENT_QUERY = `
  query Home {
    homepage {
      title
      
      contentType {
        __typename
        ... on MultipleBlockRecord {
          id
          
          content {
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

            ... on CardTextImgRecord {
              id
              title
              description
              buttonText
              asset {
                url
                width
                height
                alt
              }
            }

            ... on SectionProjectRecord {
              id
              title
              
              galleryItems {
                __typename
                ... on RelatedProjectsBlockRecord {
                  __typename
                  project {
                    id
                    title
                    project
                    portfolioCategory {
                      slug
                    }
                    thumbnail {
                      url
                      width
                      height
                      alt
                    }
                  }
                }
                ... on RelatedServicesBlockRecord {
                  __typename
                  service {
                    id
                    title
                    slug
                    thumbnailImage {
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
  }
`;

export async function generateMetadata(): Promise<Metadata> {
  const { homepage } = await performRequest(PAGE_CONTENT_QUERY) as HomeData;
  
  if(!homepage) return {};

  const { seo, title } = homepage;

  // check for images to ensure nextjs uses the global seo image if its undefined  
  const shareImage = seo?.image?.url ? {
    url: seo.image.url,
    width: seo.image.width,
    height: seo.image.height,
    alt: seo.title || title,
  } : undefined;

  return {
    title: seo?.title || title,
    description: seo?.description,
    openGraph: {
      images: shareImage ? [shareImage] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title,
      description: seo?.description,
      images: shareImage ? [shareImage] : undefined,
    },
  };
}

export default async function Home() {
  // I do another request but what Next.js does is if the same request already exists, 
  // it uses the same response and doesn't request again (deduplication removes duplicated requests)
  const { homepage } = (await performRequest(PAGE_CONTENT_QUERY)) as HomeData;

  return (
    <div className="flex flex-col w-full items-center sm:items-start">
      <HomeContent sections={homepage.contentType.content} />
    </div>
  );
}
