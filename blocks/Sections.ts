import { Block } from "payload";

import { ExternalLinkTitleBlock } from "./ExternalLinkTitle";
import { ImageTitleBlock } from "./ImageTitle";

export const SectionsBlock: Block = {
  slug: "SectionsBlock",
  fields: [
    {
      name: 'sections',
      type: 'array',
      label: 'Sections',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: 'sectionContent',
          type: 'blocks',
          labels: {
            singular: "Block",
            plural: "Blocks",
          }, 
          minRows: 2,
          maxRows: 6,
          blocks: [ExternalLinkTitleBlock, ImageTitleBlock],
        }
      ],
    },
  ],
};
