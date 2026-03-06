import type { GlobalConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { revalidateTag } from 'next/cache';

import { imageField } from "@/fields/imageField";

export const AboutMe: GlobalConfig = {
  slug: "about-me",
  hooks: {
    // event triggered when the content is changed in the About Me cms page (hit save button) 
    afterChange: [
      ({ doc, req }) => {
        // safety check: avoid hitting the Next.js Cache API during bulk DB scripts or migrations
        if (req.context?.skipRevalidate) return doc;

        // when the data is saved on the MongoDB, immediately clear this specific cache tag in the front
        revalidateTag('global_about_me', { expire: 0 }); 
        
        console.log('Busted the About Me cache!'); 

        return doc;
      },
    ],
  },
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
