import { getPayload } from "payload";
import config from '@payload-config';
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

export async function generateMetadata(): Promise<Metadata> {
  const aboutMe = await getAboutMeData();
  
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
  const aboutData = (await getAboutMeData());

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <SectionContent content={{ ...aboutData, docType: 'AboutMe' as const }} />  {/* the doctType is not a string */}
    </div>
  );
}
