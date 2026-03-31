
import { getPayload } from "payload";
import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { Metadata } from 'next';

import HomeContent from "./ui/home-content";

async function getHomepageData() {
  const payload = await getPayload({ config });

  const result = await payload.findGlobal({
    slug: 'homepage',
    depth: 2, 
  });

  return result || null;
}

export const getCachedHomepageData = unstable_cache(
  // function with the request
  async () => getHomepageData(),
  // key array to facilitate the finding of the cached data
  ["homepage-cache"],
  // tag name to eventually clear it when data changes on the db
  {
    tags: ["global_homepage"],
    revalidate: 86400, // auto-revalidate every 24 hours
  },
);

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getCachedHomepageData();
  return {
    title: (homepage.meta?.title || 'Homepage') + ' — Pedro A. Martins',
    description: homepage.meta?.description,
    openGraph: {
      title: (homepage.meta?.title || 'Homepage') + ' — Pedro A. Martins',
      // add condition to omit description if it doesn't exist
      ...(homepage.meta?.description && { description: homepage.meta.description }), 
      images: typeof homepage.meta?.image === 'object' && homepage.meta?.image?.url ? [{ url: homepage.meta.image.url }] : [],
    },
  }
}

export default async function Home() {

  const homepageData = (await getCachedHomepageData());
  
  return <HomeContent homepageData={homepageData} />;
}
