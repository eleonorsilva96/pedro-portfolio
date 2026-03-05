
import { formatPhoneNumber } from "../lib/utils";
import SectionContent from "../ui/section-content";
import { Contact } from "@/payload-types";

async function getContactData() {
  const res = await fetch("http://localhost:3000/api/globals/contact", {
    cache: "force-cache",
    next: {
      tags: ["global_about_me"],
    },
  });

  if (!res.ok) throw Error("Failed to fetch Contact data");

  return res.json();
}

export default async function ContactPage() {
  const contactData = await (getContactData()) as Contact;

  console.log(contactData);

  return (
    <div className="flex flex-col w-full items-center bg-white">

      <SectionContent content={{...contactData, docType: 'Contact' as const}} />

      <div className="flex justify-center w-full py-14 bg-neutral-200">  
        {/* GET CONTACT INFO FROM SITE SETTINGS GLOBALS */}

        {/* <div className="p-10 flex flex-col items-center gap-2 bg-primary-600 text-white text-xl">
            <a href={`tel:${formatPhoneNumber(contactData.phoneNumber)}`} className="underline">
              {contactData.phoneNumber}
            </a>
            <a href={`mailto:${contact.email}`} className="underline">{contact.email}</a>            
        </div> */}
      </div>
    </div>
  );
}
