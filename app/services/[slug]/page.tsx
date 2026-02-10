import { performRequest } from "@/app/lib/datocms";
import { ServiceData } from "@/app/lib/definitions";
import SectionContent from "@/app/ui/section-content";
import { Metadata } from "next";

const PAGE_CONTENT_QUERY = `
query IndividualService($slug: String!) {
  service(filter: { slug: { eq: $slug } }) {
    __typename
    slug
    thumbnailImage {
      url
      width
      height
      alt
    }
    title
    description
    buttonText
    seo {
      title
      description
      image {
        url
        width
        height
        alt
      }
    }
  }
}
`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { service } = (await performRequest(PAGE_CONTENT_QUERY, {
    variables: {
      slug: slug,
    },
  })) as ServiceData;

  if (!service) return {};

  const { title, thumbnailImage, seo } = service;

  const shareImage = {
    url: seo?.image?.url || thumbnailImage?.url,
    width: seo?.image?.width || thumbnailImage?.width,
    height: seo?.image?.height || thumbnailImage?.height,
    alt: seo?.title || thumbnailImage?.alt || title,
  }

  return {
    title: seo?.title || title,
    description: seo?.description,
    openGraph: {
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || title,
      description: seo?.description,
      images: [shareImage],
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // inside the route props we can get the dynamic url from the route using params
  const { slug } = await params;
  const response = (await performRequest(PAGE_CONTENT_QUERY, {
    variables: {
      slug: slug,
    },
  })) as ServiceData;

  const content = response.service;

  console.log(response);

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <SectionContent content={content} />
    </div>
  );
}
