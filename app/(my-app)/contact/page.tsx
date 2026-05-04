
import { getPayload } from "payload";
import config from '@payload-config';

import SectionContent from "../ui/section-content";
import { Metadata } from 'next'

async function getContactData() {
  const payload = await getPayload({ config });

  const result = await payload.findGlobal({
    slug: 'contact',
    depth: 1, 
  });

  return result || null;
}


export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactData();
  
  return {
    title: contact.meta?.title || contact.title,
    description: contact.meta?.description,
    openGraph: {
      title: contact.meta?.title || contact.title,
      // add condition to omit description if it doesn't exist
      ...(contact.meta?.description && { description: contact.meta.description }), 
      images: typeof contact.meta?.image === 'object' && contact.meta?.image?.url ? [{ url: contact.meta.image.url }] : [],
    },
  }
}

export default async function ContactPage() {
  const contactData = await (getContactData());

  return (
    <div className="flex flex-col w-full items-center bg-white">

      <SectionContent content={{...contactData, docType: 'Contact' as const}} />
    </div>
  );
}
