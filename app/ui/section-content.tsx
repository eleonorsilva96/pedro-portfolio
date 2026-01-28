'use client'

import { AboutDataBlock, ContactDataBlock, ServiceDataBlock } from "../lib/definitions";
import CardTextMedia from "@/app/ui/card-text-media";
import Form from "@/app/ui/form";
import { useRef } from "react";

export default function SectionContent({
    content
} : {
    content: ServiceDataBlock | AboutDataBlock | ContactDataBlock;
}) {
  const formRef = useRef<HTMLDivElement>(null);

  // put items assignment logic here

  return (
    <>
      <CardTextMedia
        title={content.title}
        desc={content.__typename !== 'ContactRecord' ? content.description : undefined}
        btnLabel={content.__typename === 'ServiceRecord' ? content.buttonText : undefined}
        media={content.__typename === 'ServiceRecord' ? content.thumbnailImage : content.coverImage}
        formRef={formRef}
        isMediaRight
        isVertical
      />
      {content.__typename !== 'ContactRecord' ? <Form innerRef={formRef} hasBgWhite /> : null}
    </>
  );
}
