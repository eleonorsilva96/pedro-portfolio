import type { GlobalConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { revalidateGlobal } from '@/app/(my-app)/lib/hooks';

export const Privacy: GlobalConfig = {
  slug: "privacy",
  hooks: {
    afterChange: [revalidateGlobal('/privacy')],
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
