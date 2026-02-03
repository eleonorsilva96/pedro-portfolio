import PrevNextButtons from "@/app/ui/prev-next-buttons";
import { VideoPlayer } from "react-datocms";
import ReactPlayer from "react-player";
import { PortfolioGalleryType, SlideProjectBlock } from "@/app/lib/definitions";

export default async function Slide({
  allProjects,
  projectDetails,
  currentId,
  category
}: {
  allProjects: PortfolioGalleryType[];
  projectDetails: SlideProjectBlock; // PortfolioGalleryType 
  currentId: string;
  category: string;
}) {

  console.log("PROJECT DETAILS", projectDetails);

  if (!projectDetails) return null;

  let video = null;
  let content = null;
  let year = null;

  year = projectDetails.date?.split("-");

  console.log(year)

  if (projectDetails?.videoMedia.externalVideo) {
    video = (
      <ReactPlayer
        src={projectDetails.videoMedia.externalVideo.url}
        light={projectDetails.videoMedia.externalVideo.thumbnailUrl}
        controls={true}
        width="100%"
        height="100%"
      />
    );
  } else if (projectDetails.videoMedia.videoAsset) {
    video = (
      <VideoPlayer
        data={projectDetails.videoMedia.videoAsset.video}
        className="w-full h-full object-cover"
        preload="none"
      />
    );
  } else {
    video = <div>No Video</div>;
  }

  content = (
    <>
      <span className="font-bold">
        Função:{" "}
        <span className="font-normal">
          {projectDetails.role}
        </span>
      </span>
      <span className="font-bold">
        Contexto:{" "}
        <span className="font-normal">
          {projectDetails.context}
        </span>
      </span>
      <span className="font-bold">
        Data:{" "}
        <span className="font-normal">{year?.at(0)}</span>
      </span>
    </>
  );

  return (
    <div className="self-center w-full flex flex-col gap-5">
      <div className="w-full aspect-[16/9]">{video}</div>
      <div className="flex flex-col gap-1">{content}</div>
      <PrevNextButtons
        gallery={allProjects || []}
        currentId={currentId}
        category={category}
        isTextBtn
      />
    </div>
  );
}
