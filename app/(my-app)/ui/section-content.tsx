'use client'

import { AboutMe, Contact, Service } from "../../../payload-types";
import Form from "@/app/(my-app)/ui/form";
import { useRef } from "react";
import { RichText } from '@payloadcms/richtext-lexical/react';
import CardTextImage from "./card-text-image";

export type PayloadAbout = AboutMe & { docType: 'AboutMe' };
export type PayloadContact = Contact & { docType: 'Contact' };
export type PayloadService = Service & { docType: 'Service' };

export default function SectionContent({
    content
} : {
    content: PayloadAbout | PayloadContact | PayloadService;
}) {
  // when the service form is visible attach it to the ref and pass it on the CardTextImage to create a smooth anchor 
  const formRef = useRef<HTMLDivElement>(null);

  const description = content.docType === 'AboutMe' || content.docType === 'Service' ? <RichText data={content.description} /> : undefined;

  return (
    <>
      <CardTextImage
        title={content.title}
        desc={description}
        btnLabel={content.docType === 'Service' ? content.buttonText : undefined}
        image={typeof content.image === 'object' ? content.image : null} // check if is a object (media type)
        formRef={formRef}
      />
      {content.docType === 'AboutMe' || content.docType === 'Service' ? <Form innerRef={formRef} hasBgWhite /> : null}
    </>
  );
}
