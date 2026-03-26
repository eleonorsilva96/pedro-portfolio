import CardSection from "./card-section";
import { Suspense } from "react";
import { MultipleContentBlock } from "./gallery-portfolio";
import clsx from "clsx";

export type SectionsBlock = Extract<MultipleContentBlock, { blockType: "SectionsBlock" }>;

export default function Sections({
  sectionsData,
}: {
  sectionsData: (null | NonNullable<SectionsBlock["sections"]>[number])[];
}) {
  return (
    <>
      {sectionsData?.map((section, index) => (
        <div key={section?.id} className="w-full flex flex-col items-center">
          <div
            className={clsx(
              "w-full flex flex-col justify-center gap-10 items-center py-15",
              {
                "bg-black": index % 2 === 0,
                "bg-neutral-800": index % 2 !== 0,
              },
            )}
          >
            <h3 className="text-white text-3xl lg:text-4xl font-special tracking-wider">
              {section?.title}
            </h3>
            <div
              className={clsx(
                "w-full max-w-[100vw] flex overflow-x-auto overflow-y-hidden snap-x scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] xl:overflow-x-hidden xl:flex-wrap xl:justify-center gap-4 px-4",
                {
                  "md:justify-center": index === sectionsData.length - 1,
                },
              )}
            >
              {section?.sectionContent?.map((contentItem) => (
                  <Suspense key={contentItem.id} fallback={null}>
                    <CardSection content={contentItem} />
                  </Suspense>
                ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
