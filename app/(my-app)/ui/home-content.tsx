"use client";

import Form from "@/app/(my-app)/ui/form";
import { Suspense, useRef } from "react";
import GalleryPortfolio from "./gallery-portfolio";
import CardTextImage from "./card-text-image";
import { Homepage } from "@/payload-types";
import { Project, Service } from "@/payload-types";

export default function HomeContent({
  homepageData,
}: {
  homepageData: Homepage;
}) {
  const formRef = useRef<HTMLDivElement>(null);

  // map transforms each item (extracting one property)
  // filter removes/keeps item based on a condition
  const extractProjects = homepageData.featuredProjectsSection.projects?.map(
    (project) =>
      typeof project.referenceProject === "object" && project.referenceProject,
  ).filter((item): item is Project => Boolean(item)); // filters array to remove all null and falsy values (null, false, undefined)
  const extractServices = homepageData.servicesSection.services?.map(
    (project) =>
      typeof project.referenceService === "object" && project.referenceService,
  ).filter((item): item is Service => Boolean(item));

  return (
    <div className="flex flex-col w-full items-center sm:items-start">
      <div className="relative w-full h-[1000px] md:h-[800px] 2xl:h-[1000px]">
        <video
          src={
            (typeof homepageData.video === "object" &&
              homepageData.video.url) ||
            ""
          }
          className="w-full h-full object-cover object-center"
          autoPlay
          preload="auto"
          loop
          muted
          playsInline // autoplay for iOS Safari
        />

        {/* to avoid showing control panel */}
        <div className="absolute inset-0 z-10 bg-transparent"></div>
      </div>
      {/* about me */}
      <CardTextImage
        title={homepageData.aboutSection.title}
        desc={homepageData.aboutSection.description}
        textAlign="center"
        btnLabel={homepageData.aboutSection.buttonText}
        image={
          (typeof homepageData.aboutSection.image === "object" &&
            homepageData.aboutSection.image) ||
          null
        }
        formRef={formRef}
        // isMediaRight
      />
      {/* </div> */}
      <div
        id="last-works"
        className="flex flex-col w-full h-auto items-center py-16 px-5 lg:px-[56px] bg-white"
      >
        <h1 className="text-4xl lg:text-[44px]">
          {homepageData.featuredProjectsSection.title}
        </h1>
        <div className="w-7 h-[3px] bg-foreground mx-auto my-6"></div>
        <Suspense fallback={null}>
          <GalleryPortfolio data={extractProjects ?? []} refProject />
        </Suspense>
      </div>
      <div
        id="services"
        className="flex flex-col w-full h-auto items-center py-16 px-5 lg:px-[56px]"
      >
        <h1 className="text-4xl lg:text-[44px]">
          {homepageData.servicesSection.title}
        </h1>
        <div className="w-7 h-[3px] bg-foreground mx-auto my-6"></div>
        <Suspense fallback={null}>
          <GalleryPortfolio data={extractServices ?? []} />
        </Suspense>
      </div>
      <Form innerRef={formRef} />
    </div>
  );
}
