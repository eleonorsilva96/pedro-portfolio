import PrevNextButtons from "@/app/(my-app)/ui/prev-next-buttons";
import ReactPlayer from "react-player";
import { Project } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";

// component - returns a jsx
const Video = ({
  projectDetails
} : {
  projectDetails: null | Project['singleContent'],
}) => {

  // it doesn't carry the type narrowing from inside the callback it only returns the matched value from the condition
  const videoBlock = projectDetails?.video?.find((block) => block.blockType === 'videoBlock'); 
  const externalLinkBlock = projectDetails?.video?.find((block) => block.blockType === 'externalLinkBlock');
  const urlVideoBlock = typeof videoBlock?.image === 'object' ? videoBlock.image.url : null;
  const urlExternalLinkBlock = externalLinkBlock?.externalLink;

  return (
    <ReactPlayer
        src={urlVideoBlock || urlExternalLinkBlock || ''}
        controls={true}
        muted={false}
        width="100%"
        height="100%"
      />
  );
};

export default async function Slide({
  projects,
  projectDetails,
  projectId,
  category
}: {
  projects: Project[];
  projectDetails: null | Project['singleContent']; 
  projectId: undefined | string;
  category: string;
}) {

  const year = projectDetails?.date?.split("-").at(0);

  const content = (
    <>
      <span className="font-bold">
        Função:{" "}
        <span className="font-normal">
          {projectDetails?.role}
        </span>
      </span>
      <span className="font-bold">
        Contexto:{" "}
        <div className="font-normal">
          {projectDetails?.context && <RichText data={projectDetails.context} className="rich-text" />}
        </div>
      </span>
      <span className="font-bold">
        Data:{" "}
        <span className="font-normal">{year}</span>
      </span>
    </>
  );

  return (
    <div className="self-center w-full flex flex-col gap-5">
      <div className="w-full aspect-[16/9]">
      {<Video projectDetails={projectDetails} />}
      </div>
      <div className="flex flex-col gap-1">{content}</div>
      <PrevNextButtons
        gallery={projects || []}
        currentId={projectId}
        category={category}
        isTextBtn
      />
    </div>
  );
}
