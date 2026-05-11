import type { GlobalConfig } from "payload";
import { slugField } from "@/fields/slugField";

import { imageField } from "@/fields/imageField";
import { revalidateGlobal } from '@/app/(my-app)/lib/hooks';

export const Contact: GlobalConfig = {
  slug: "contact",
  hooks: {
    afterChange: [revalidateGlobal('/contact')],
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
    slugField(),
    imageField,
  ],
};
