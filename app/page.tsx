import { performRequest } from '@/app/lib/datocms';
import { HomeData } from "@/app/lib/definitions";
import HomeContent from "./ui/home-content";

// send query to DatoCMS
const PAGE_CONTENT_QUERY = `
  query Home {
    homepage {
      title
      # in graphql queries minimizes data transfer, it doesn't send empty columns like in SQL so we need to be very specific
      # modular content block returns a list of different types of blocks and to get only the used fields we use the switch logic 
      sections {
        # get the ID and Type to help React identify the block type 
        __typename
        
        # "Switch" logic
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
          asset {  # change to asset
            url
            width
            height
            alt
          }
        }
        ... on CardGalleryRecord {
          id
          title
          # Nested Modular Content (Gallery Items)
          galleryItems {
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
  }`;

export default async function Home() {
  // run the query and treat the result as HomeData
  const { homepage } = await performRequest(PAGE_CONTENT_QUERY) as HomeData;

  return (
    <div className="flex flex-col w-full items-center sm:items-start">
        <HomeContent sections={homepage.sections}/>
    </div>
  );
}
