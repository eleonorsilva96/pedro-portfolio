import { Block } from "payload";

import { externalLinkField } from "../fields/externalLinkField";

export const ExternalLinkTitleBlock: Block = {
  slug: "externalLinkTitleBlock",
  fields: [
    {
        name: 'title',
        type: 'text',
        required: true,
    },
    externalLinkField,
  ],
};
