import { Metadata } from "next";
import { performRequest } from "../lib/datocms";
import { AboutData } from "../lib/definitions";
import SectionContent from "../ui/section-content";

const PAGE_CONTENT_QUERY = `
  query AboutPage {
    about {
      __typename
      title
      coverImage {
        url
        width
        height
        alt
      }
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
  }
`;

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await performRequest(PAGE_CONTENT_QUERY) as AboutData;

  if (!about) return {};

  const { title, coverImage, seo } = about;

  const shareImage = seo?.image?.url ? {
    url: seo?.image?.url || coverImage?.url,
    width: seo?.image?.width || coverImage?.width,
    height: seo?.image?.height || coverImage?.height,
    alt: seo?.title || coverImage?.alt || title,
  } : undefined;

  return {
    title: seo?.title || title,
    description: seo?.description,
    openGraph: {
      images: shareImage ? [shareImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || title,
      description: seo?.description,
      images: shareImage ? [shareImage] : undefined,
    },
  };
}

export default async function AboutPage() {
  const { about } = (await performRequest(PAGE_CONTENT_QUERY)) as AboutData;

  // add response check

  console.log(about);

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <SectionContent content={about} />
    </div>
  );
}
