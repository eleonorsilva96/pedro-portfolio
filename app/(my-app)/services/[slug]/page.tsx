import { getPayload } from "payload";
import config from '@payload-config';

import { unstable_cache } from "next/cache";

import { Service } from "@/payload-types";

import SectionContent from "@/app/(my-app)/ui/section-content";

async function getServiceData(slug: string) {
  // using the Payload Local API is a better option because the Next.js frontend (Server Components) 
  // and Payload CMS backend live in the exact same Node.js server. This delivers faster responses just by calling a function
  // and completely eliminates the need for HTTP network requests.
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'services',
    where: {
      slug: {
        equals: slug
      },
    },
    limit: 1, // stop searching the second it finds a match
    depth: 1, // the number of nested fields/relationships I want to retrieve
  });

  return result.docs[0] || null;
}

export const getCachedServiceBySlug = unstable_cache(
  // function with the request
  async (slug: string) => getServiceData(slug),
  // key array to facilitate the finding of the cached data
  ['service-by-slug-cache'], 
  // tag name to eventually clear it when data changes on the db
  {
    tags: ['collection_services'], 
    revalidate: 3600, // auto-revalidate every hour
  }
);

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // inside the route props get the dynamic url 
  const { slug } = await params;

  const serviceData = (await getCachedServiceBySlug(slug)) as Service;

  console.log("service data");
  console.log(serviceData);

  return (
    <div className="flex flex-col w-full items-center bg-white">
      {/* PASS THE BUTTON NAME FROM SITE SETTINGS GLOBAL */}
      <SectionContent content={{ ...serviceData, docType: 'Service' as const }} />
    </div>
  );
}
