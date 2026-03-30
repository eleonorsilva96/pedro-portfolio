import type { GlobalConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { revalidateTag } from 'next/cache';

export const Privacy: GlobalConfig = {
  slug: "privacy",
  hooks: {
    // event triggered when the content is changed in the cms page (hit save button) 
    afterChange: [
      ({ doc, req }) => {
        // safety check: avoid hitting the Next.js Cache API during bulk DB scripts or migrations
        if (req.context?.skipRevalidate) return doc;

        // when the data is saved on the MongoDB, immediately clear this specific cache tag in the front
        revalidateTag('global_privacy', { expire: 0 });

        return doc;
      },
    ],
  },
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
