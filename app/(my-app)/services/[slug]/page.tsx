import { getPayload } from "payload";
import config from '@payload-config';
import { Metadata } from 'next'
import { notFound } from 'next/navigation';

import SectionContent from "@/app/(my-app)/ui/section-content";

async function getServiceData(slug: string) {
  // using the Payload Local API is a better option because the Next.js frontend (Server Components) 
  // and Payload CMS backend live in the exact same Node.js server. This delivers faster responses just by calling a function
  // and drops the need for HTTP network requests.
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const service = await getServiceData(slug);

  if (!service) {
    return { title: 'Service Not Found' }
  }
  
  return {
    title: service.meta?.title || service.title,
    description: service.meta?.description,
    openGraph: {
      title: service.meta?.title || service.title,
      // add condition to omit description if it doesn't exist
      ...(service.meta?.description && { description: service.meta.description }), 
      images: typeof service.meta?.image === 'object' && service.meta?.image?.url ? [{ url: service.meta.image.url }] : [],
    },
  }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // inside the route props get the dynamic url 
  const { slug } = await params;

  const serviceData = (await getServiceData(slug));

  if (!serviceData) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full items-center bg-white">
      {/* PASS THE BUTTON NAME FROM SITE SETTINGS GLOBAL */}
      <SectionContent content={{ ...serviceData, docType: 'Service' as const }} />
    </div>
  );
}
