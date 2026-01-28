import { performRequest } from "../lib/datocms";
import { AboutData } from "../lib/definitions";
import SectionContent from "../ui/section-content";

const PAGE_CONTENT_QUERY = `
query AboutPage {
  about {
    __typename
    slug
    title
    coverImage {
      url
      width
      height
      alt
    }
    description
  }
}
`;

export default async function AboutPage() {
    const { about } = await performRequest(PAGE_CONTENT_QUERY) as AboutData;

    console.log(about);

    return (
        <div className="flex flex-col w-full items-center bg-white">
            <SectionContent content={about} />
        </div>
    );


}