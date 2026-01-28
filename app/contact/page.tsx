import { performRequest } from "../lib/datocms";
import { ContactData } from "../lib/definitions";
import { formatPhoneNumber } from "../lib/utils";
import SectionContent from "../ui/section-content";

const PAGE_CONTENT_QUERY = `
    query ContactPage {
        contact {
            __typename
            title
            coverImage {
                url
                width
                height
                alt
            }
            phoneNumber
            email
        }
    }
`;

export default async function ContactPage() {
  const { contact } = (await performRequest(PAGE_CONTENT_QUERY)) as ContactData;

  console.log(contact);

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <SectionContent content={contact} />
      <div className="flex justify-center w-full py-14 bg-neutral-200">
        <div className="p-10 flex flex-col items-center gap-2 bg-primary-600 text-white text-xl">
            <a href={`tel:${formatPhoneNumber(contact.phoneNumber)}`} className="underline">
              {contact.phoneNumber}
            </a>
            <a href={`mailto:${contact.email}`} className="underline">{contact.email}</a>            
        </div>
      </div>
    </div>
  );
}
