import { AboutMe } from "../../../payload-types";

import SectionContent from "../ui/section-content";

async function getAboutMeData() {
  const res = await fetch("http://localhost:3000/api/globals/about-me", {
    cache: "force-cache",
    next: {
      tags: ["global_about_me"],
    },
  });

  if (!res.ok) throw Error("Failed to fetch About Me data");

  return res.json();
}

export default async function AboutPage() {
  const aboutData = (await getAboutMeData()) as AboutMe;

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <SectionContent content={{ ...aboutData, docType: "AboutMe" as const }} />  {/* the doctType is not a string */}
    </div>
  );
}
