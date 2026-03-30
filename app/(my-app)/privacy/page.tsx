import clsx from "clsx";
import { performRequest } from "../lib/datocms";
import { PrivacyPolicyData } from "../lib/definitions";
import ReactMarkdown from "react-markdown";
import { getPayload } from "payload";
import config from '@payload-config';
import { unstable_cache } from "next/cache";
import { RichText } from "@payloadcms/richtext-lexical/react";

async function getPrivacyData() {
    const payload = await getPayload({ config });

  const result = await payload.findGlobal({
    slug: 'privacy',
    depth: 1, 
  });

  return result || null;
}

export const getCachedPrivacyData = unstable_cache(
    // function with the request
    async () => getPrivacyData(),
    // key array to facilitate the finding of the cached data
    ["privacy-cache"],
    // tag name to eventually clear it when data changes on the db
    {
      tags: ["global_privacy"]
    },
  );

export default async function PrivacyPage() {

    const privacyData = await getCachedPrivacyData();

    console.log("privacy data", privacyData)

    // const textBlock = text.map((block, index) => (
    //     <div key={block.id} className={clsx(
    //         "flex flex-col w-full max-w-3xl p-4 lg:p-0",
    //         {
    //             "items-center": index === 0,
    //             "items-start gap-4": index !== 0,
    //         }
    //     )}>
    //         <h1 className="text-3xl lg:text-4xl">{block.title}</h1>
    //         {index === 0 && <div className="w-16 h-[3px] bg-neutral-900 mx-auto my-4"></div>}
    //         {/* insert description in a markdown parser to allow links and other formats */}
    //         <ReactMarkdown
    //         // add custom style for the link
    //         components={{
    //             // remove node property out of the object
    //             p: ({ children, ...props }) => {
    //             return (
    //                 <p
    //                 {...props}
    //                 className="w-full whitespace-pre-line text-md lg:text-lg"
    //                 >
    //                 {children}
    //                 </p>
    //             );
    //             },
    //             a: ({ ...props }) => (
    //             <a
    //                 {...props}
    //                 className="!text-neutral-900 !underline"
    //                 target="_blank"
    //             />
    //             ),
    //             ul: ({...props}) => (
    //                 <ul
    //                 {...props}
    //                 className="list-disc ml-6 mt-4 text-md lg:text-lg" 
    //                 />
    //             ),
    //         }}
    //         >
    //         {block.description}
    //         </ReactMarkdown>
    //     </div>
    // ));


    return (
        <div className="w-full flex flex-col items-center bg-white gap-6 py-8 px-4">
            <h1 className="text-3xl lg:text-4xl">{privacyData.title}</h1>
            {/* add prose class from tailwind typography plugin to better format the document */}
            {privacyData.content && <RichText data={privacyData.content} className="text-lg prose prose-li:marker:text-stone-700 prose-h1:mb-0 rich-text"/>}
        </div>

    );

}