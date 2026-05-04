import type { GlobalConfig } from "payload";
import { slugField } from "@/fields/slugField";

import { imageField } from "@/fields/imageField";

export const AboutMe: GlobalConfig = {
  slug: "about-me",
  // allow public fetching by the next js frontend
  // because I'm using payload local API the access is by default enable
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    imageField,
  ],
};
