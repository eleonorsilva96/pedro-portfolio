import type { GlobalConfig } from "payload";
import { slugField } from "@/fields/slugField";

export const Privacy: GlobalConfig = {
  slug: "privacy",
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
    }
  ],
};
