import type { GlobalConfig } from "payload";
import { slugField } from "payload";

import { imageField } from "@/fields/imageField";

export const Contact: GlobalConfig = {
  slug: "contact",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField(),
    imageField,
  ],
};
