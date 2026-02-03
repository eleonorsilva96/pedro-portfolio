import { performRequest } from "@/app/lib/datocms";
import { HomeData } from "@/app/lib/definitions";
import HomeContent from "./ui/home-content";

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
    }
  }
`;

export default async function Home() {
  // run the query and treat the result as HomeData
  const { homepage } = (await performRequest(PAGE_CONTENT_QUERY)) as HomeData;

  return (
    <div className="flex flex-col w-full items-center sm:items-start">
      <HomeContent sections={homepage.contentType.content} />
    </div>
  );
}
