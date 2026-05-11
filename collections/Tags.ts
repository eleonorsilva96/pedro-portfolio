import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { revalidateCollectionAfterChange, revalidateCollectionAfterDelete } from '@/app/(my-app)/lib/hooks';

export const Tags: CollectionConfig = {
  slug: "tags",
  hooks: {
    // triggers on the create and update
    afterChange: [revalidateCollectionAfterChange('/portfolio')],
    // ensure don't show empty data
    afterDelete: [revalidateCollectionAfterDelete('/portfolio')],
  },
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
    slugField()
  ],
};
