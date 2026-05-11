import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";

import { imageField } from "@/fields/imageField";
import { revalidateCollectionAfterChange, revalidateCollectionAfterDelete } from '@/app/(my-app)/lib/hooks';


export const Services: CollectionConfig = {
  slug: "services",
  hooks: {
    // triggers on the create and update
    afterChange: [revalidateCollectionAfterChange('/services')],
    // ensure don't show empty data
    afterDelete: [revalidateCollectionAfterDelete('/services')],
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
