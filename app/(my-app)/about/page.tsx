import { getPayload } from "payload";
import config from '@payload-config';
import { unstable_cache } from "next/cache";
import { Metadata } from 'next'

import SectionContent from "../ui/section-content";

async function getAboutMeData() {
  const payload = await getPayload({ config });

  const result = await payload.findGlobal({
    slug: 'about-me',
    depth: 1, 
  });

  return result || null;
}

export const getCachedAboutMeData = unstable_cache(
  // function with the request
  async () => getAboutMeData(),
  // key array to facilitate the finding of the cached data
  ["about-me-cache"],
  // tag name to eventually clear it when data changes on the db
  {
    tags: ["global_about_me"],
    revalidate: 86400, // auto-revalidate every 24 hours
  },
);

export async function generateMetadata(): Promise<Metadata> {
  const aboutMe = await getCachedAboutMeData();
  
  return {
    title: aboutMe.meta?.title || aboutMe.title,
    description: aboutMe.meta?.description,
    openGraph: {
      title: aboutMe.meta?.title || aboutMe.title,
      // add condition to omit description if it doesn't exist
      ...(aboutMe.meta?.description && { description: aboutMe.meta.description }), 
      images: typeof aboutMe.meta?.image === 'object' && aboutMe.meta?.image?.url ? [{ url: aboutMe.meta.image.url }] : [],
    },
  }
}

export default async function AboutPage() {
  const aboutData = (await getCachedAboutMeData());

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <SectionContent content={{ ...aboutData, docType: 'AboutMe' as const }} />  {/* the doctType is not a string */}
    </div>
  );
}
