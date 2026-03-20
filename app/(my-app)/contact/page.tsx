
import { getPayload } from "payload";
import config from '@payload-config';
import { unstable_cache } from "next/cache";

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

export const getCachedContactData = unstable_cache(
  // function with the request
  async () => getContactData(),
  // key array to facilitate the finding of the cached data
  ["contact-cache"],
  // tag name to eventually clear it when data changes on the db
  {
    tags: ["global_contact"],
    revalidate: 86400, // auto-revalidate every 24 hours
  },
);

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getCachedContactData();
  
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
  const contactData = await (getCachedContactData());

  return (
    <div className="flex flex-col w-full items-center bg-white">

      <SectionContent content={{...contactData, docType: 'Contact' as const}} />

        {/* GET CONTACT INFO FROM SITE SETTINGS GLOBALS */}
      {/* <div className="flex justify-center w-full py-14 bg-neutral-200">  

        <div className="p-10 flex flex-col items-center gap-2 bg-primary-600 text-white text-xl">
            <a href={`tel:${formatPhoneNumber(contactData.phoneNumber)}`} className="underline">
              {contactData.phoneNumber}
            </a>
            <a href={`mailto:${contact.email}`} className="underline">{contact.email}</a>            
        </div>
      </div> */}
    </div>
  );
}
