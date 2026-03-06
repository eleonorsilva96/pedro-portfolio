import { Block } from "payload";
import { slugField } from "@/fields/slugField";

import { externalLinkField } from "../fields/externalLinkField";

export const ExternalLinkTitleBlock: Block = {
  slug: "externalLinkTitleBlock",
  fields: [
    {
        name: 'title',
        type: 'text',
        required: true,
    },
    slugField(),
    externalLinkField
  ],
};
