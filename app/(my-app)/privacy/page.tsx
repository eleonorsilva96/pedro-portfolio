import clsx from "clsx";
import { performRequest } from "../lib/datocms";
import { PrivacyPolicyData } from "../lib/definitions";
import ReactMarkdown from "react-markdown";

// send quero to DatoCMS
const PAGE_CONTENT_QUERY = `
    query PrivacyPage {
        privacyPolicy {
            title
            text {
                __typename
                ... on TitleDescriptionBlockRecord {
                    id
                    title
                    description
                }
            
            }
        }
    } 
`;

export default async function PrivacyPage() {
    const { privacyPolicy } = await performRequest(PAGE_CONTENT_QUERY) as PrivacyPolicyData;
    const { text } = privacyPolicy;

    console.log("privacy", privacyPolicy)

    const textBlock = text.map((block, index) => (
        <div key={block.id} className={clsx(
            "flex flex-col w-full max-w-3xl p-4 lg:p-0",
            {
                "items-center": index === 0,
                "items-start gap-4": index !== 0,
            }
        )}>
            <h1 className="text-3xl lg:text-4xl">{block.title}</h1>
            {index === 0 && <div className="w-16 h-[3px] bg-neutral-900 mx-auto my-4"></div>}
            {/* insert description in a markdown parser to allow links and other formats */}
            <ReactMarkdown
            // add custom style for the link
            components={{
                // remove node property out of the object
                p: ({ children, ...props }) => {
                return (
                    <p
                    {...props}
                    className="w-full whitespace-pre-line text-md lg:text-lg"
                    >
                    {children}
                    </p>
                );
                },
                a: ({ ...props }) => (
                <a
                    {...props}
                    className="!text-neutral-900 !underline"
                    target="_blank"
                />
                ),
                ul: ({...props}) => (
                    <ul
                    {...props}
                    className="list-disc ml-6 mt-4 text-md lg:text-lg" 
                    />
                ),
            }}
            >
            {block.description}
            </ReactMarkdown>
        </div>
    ));


    return (
        <div className="w-full flex flex-col items-center bg-white gap-6 py-8">
            {textBlock}
        </div>

    );

}