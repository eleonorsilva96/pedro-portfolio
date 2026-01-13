import PrevNextButtons from "@/app/ui/prev-next-buttons";
import { VideoPlayer } from "react-datocms";
import ReactPlayer from "react-player";
import { PortfolioGalleryType } from "@/app/lib/definitions";

export default async function Slide({
  allProjects,
  projectDetails,
  currentId,
  category
}: {
  allProjects: PortfolioGalleryType[] | [];
  projectDetails: PortfolioGalleryType;
  currentId: string;
  category: string;
}) {
  let video = null;
  let content = null;
  let year = null;

  if (
    projectDetails?.__typename === "GalleryPortfolioRecord" &&
    projectDetails?.projectId.content.__typename === "SlideProjectRecord"
  ) {
    year = projectDetails?.projectId.content.date?.split("-");

    console.log(year)

    if (projectDetails?.projectId.content.videoMedia?.externalVideo) {
      video = (
        <ReactPlayer
          src={projectDetails?.projectId.content.videoMedia.externalVideo.url}
          light={projectDetails?.projectId.content.videoMedia.externalVideo.thumbnailUrl}
          controls={true}
          width="100%"
          height="100%"
        />
      );
    } else if (projectDetails?.projectId.content.videoMedia?.videoAsset) {
      video = (
        <VideoPlayer
          data={projectDetails?.projectId.content.videoMedia.videoAsset?.video}
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
            {projectDetails?.projectId.content.role}
          </span>
        </span>
        <span className="font-bold">
          Contexto:{" "}
          <span className="font-normal">
            {projectDetails?.projectId.content.context}
          </span>
        </span>
        <span className="font-bold">
          Data:{" "}
          <span className="font-normal">{year?.at(0)}</span>
        </span>
      </>
    );
  } else {
    video = <div>Video unavailable</div>;
    content = <div>Content unavailable</div>;
  }

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
