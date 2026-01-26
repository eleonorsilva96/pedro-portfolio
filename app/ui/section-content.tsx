'use client'

import { ServiceDataBlock } from "../lib/definitions";
import CardTextMedia from "@/app/ui/card-text-media";
import Form from "@/app/ui/form";
import { useRef } from "react";

export default function SectionContent({
    content
} : {
    content: ServiceDataBlock;
}) {
  const formRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <CardTextMedia
        title={content.title}
        desc={content.description}
        btnLabel={content.buttonText}
        media={content.thumbnailImage}
        formRef={formRef}
        isMediaRight
        isVertical
      />
      <Form innerRef={formRef} hasBgWhite />
    </>
  );
}
