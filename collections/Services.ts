import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { revalidateTag } from 'next/cache';

import { imageField } from "@/fields/imageField";

export const Services: CollectionConfig = {
  slug: "services",
  hooks: {
    // event triggered when the content is changed (hit save button) 
    afterChange: [
      ({ doc, req }) => {
        // safety check: avoid hitting the Next.js Cache API during bulk DB scripts or migrations
        if (req.context?.skipRevalidate) return doc;

        // when the data is saved on the MongoDB, immediately clear this specific cache tag in the front
        revalidateTag('collection_services', { expire: 0 }); 

        return doc;
      },
    ],
  },
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
