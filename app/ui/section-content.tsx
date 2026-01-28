'use client'

import { AboutDataBlock, ServiceDataBlock } from "../lib/definitions";
import CardTextMedia from "@/app/ui/card-text-media";
import Form from "@/app/ui/form";
import { useRef } from "react";

export default function SectionContent({
    content
} : {
    content: ServiceDataBlock | AboutDataBlock;
}) {
  const formRef = useRef<HTMLDivElement>(null);

  // put items assignment logic here

  return (
    <>
      <CardTextMedia
        title={content.title}
        desc={content.description}
        btnLabel={content.__typename === 'ServiceRecord' ? content.buttonText : undefined}
        media={content.__typename === 'ServiceRecord' ? content.thumbnailImage : content.coverImage}
        formRef={formRef}
        isMediaRight
        isVertical
      />
      <Form innerRef={formRef} hasBgWhite />
    </>
  );
}
