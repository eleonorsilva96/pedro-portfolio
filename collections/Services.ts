import type { CollectionConfig } from "payload";
import { slugField } from "payload";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    // title in admin
    useAsTitle: "title",
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
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "buttonText",
      type: "text",
      required: true,
    },
  ],
};
