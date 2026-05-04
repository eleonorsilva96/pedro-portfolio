import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";

import { imageField } from "@/fields/imageField";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    // title in admin
    useAsTitle: "title",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    // automatically generates a URL-safe slug from the title
    slugField(),
    {
      name: "description",
      type: "richText",
      required: true
    },
    imageField,
  ],
};
