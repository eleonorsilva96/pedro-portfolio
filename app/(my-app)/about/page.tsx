import { getPayload } from "payload";
import config from '@payload-config';

import { AboutMe } from "../../../payload-types";

import SectionContent from "../ui/section-content";

async function getAboutMeData() {
  const payload = await getPayload({ config });

  const result = await payload.findGlobal({
    slug: 'about-me',
    depth: 1, 
  });

  return result || null;
}

export default async function AboutPage() {
  const aboutData = (await getAboutMeData()) as AboutMe;

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <SectionContent content={{ ...aboutData, docType: 'AboutMe' as const }} />  {/* the doctType is not a string */}
    </div>
  );
}
