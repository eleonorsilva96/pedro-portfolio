import Gallery from "@/app/ui/gallery";
import Form from "@/app/ui/form";
import { performRequest } from '@/app/lib/datocms';
import { VideoPlayer } from "react-datocms";
import { HomeData } from "@/app/lib/definitions";
import CardTextMedia from "@/app/ui/card-text-media";

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
  
  const videoBlock = homepage.sections?.find((s) => s.__typename === 'VideoBlockRecord');
  const cardTextImg = homepage.sections?.find((s) => s.__typename === 'CardTextImgRecord');
  const cardGallery = homepage.sections?.filter((s) => s.__typename === 'CardGalleryRecord');
  
  if (!videoBlock) return null;
  if (!cardTextImg) return null;
  if (!cardGallery) return null;

  console.log("cards home", cardGallery);


  console.log("last works + services", cardGallery);

  return (
    <div className="flex flex-col w-full items-center sm:items-start">
        {/* <Video /> */}
        <div className="relative w-full h-[1000px] lg:h-[800px]">
          <VideoPlayer
            data={videoBlock.videoAsset.video}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            loop
            preload="none"
          />
          {/* to avoid showing control panel */}
          <div className="absolute inset-0 z-10 bg-transparent"></div>
        </div>
        <CardTextMedia
          title={cardTextImg.title}
          desc={cardTextImg.description}
          btnLabel={cardTextImg.buttonText}
          media={cardTextImg.asset}
          isMediaRight
        />
        <div
          id="last-works"
          className="flex flex-col w-full h-auto items-center py-16 px-5 lg:px-[56px] bg-white"
        >
          <h1 className="text-4xl lg:text-[44px]">{cardGallery[0].title}</h1>
          <div className="w-7 h-[3px] bg-foreground mx-auto my-6"></div>
          <Gallery galleryItems={cardGallery[0].galleryItems}/>
        </div>
        <div
          id="services"
          className="flex flex-col w-full h-auto items-center py-16 px-5 lg:px-[56px]"
        >
          <h1 className="text-4xl lg:text-[44px]">{cardGallery[1].title}</h1>
          <div className="w-7 h-[3px] bg-foreground mx-auto my-6"></div>
          <Gallery galleryItems={cardGallery[1].galleryItems} hasTitle removeBtn />
        </div>
        <div
          id="contact"
          className="flex flex-col w-full h-auto items-center py-16 px-5 lg:px-[56px] bg-white"
        >
          <h1 className="text-4xl lg:text-[44px] text-center">Pede um orçamento gratis</h1>
          <div className="w-7 h-[3px] bg-foreground mx-auto my-5"></div>
          <Form />
        </div>
    </div>
  );
}


// ... on GalleryItemRecord {
            //   __typename
            //   id
            //   title
            //   asset { # change to asset
            //     url
            //     width
            //     height
            //     alt
            //   }
            // }