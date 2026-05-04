
import { getPayload } from "payload";
import config from "@payload-config";
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

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepageData();
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

  const homepageData = (await getHomepageData());
  
  return <HomeContent homepageData={homepageData} />;
}
