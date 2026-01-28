import { performRequest } from "@/app/lib/datocms";
import { ServiceData } from "@/app/lib/definitions";
import SectionContent from "@/app/ui/section-content";

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
  }
}
`;

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
