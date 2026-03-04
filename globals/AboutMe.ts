import type { GlobalConfig } from "payload";
import { slugField } from 'payload';

import { imageField } from "@/fields/imageField";

export const AboutMe: GlobalConfig = {
  slug: "about-me",
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    imageField,
    {
      name: 'formTitle',
      type: 'text',
      required: true,
      defaultValue: 'Pede um orçamento gratis',
    },
  ],
};
