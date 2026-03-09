
// import { formatPhoneNumber } from "../lib/utils";
import { getPayload } from "payload";
import config from '@payload-config';

import SectionContent from "../ui/section-content";
import { Contact } from "@/payload-types";

async function getContactData() {
  const payload = await getPayload({ config });

  const result = await payload.findGlobal({
    slug: 'contact',
    depth: 1, 
  });

  return result || null;
}

export default async function ContactPage() {
  const contactData = await (getContactData()) as Contact;

  console.log(contactData);

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
