import type { GlobalConfig } from "payload";
import { slugField } from "payload";

import { imageField } from "@/fields/imageField";

export const Contact: GlobalConfig = {
  slug: "contact",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField(),
    imageField,
    {
      name: "formTitle",
      type: "text",
      required: true,
      defaultValue: "Pede um orçamento gratis",
    },
  ],
};
