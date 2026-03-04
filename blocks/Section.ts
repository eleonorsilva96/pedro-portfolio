import { Block } from "payload";

import { ExternalLinkTitleBlock } from "./ExternalLinkTitle";
import { ImageTitleBlock } from "./ImageTitle";

export const SectionBlock: Block = {
  slug: "sectionBlock",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: 'content',
      type: 'blocks',
      labels: {
        singular: "Block",
        plural: "Blocks",
      }, 
      maxRows: 1,
      blocks: [ExternalLinkTitleBlock, ImageTitleBlock],
    }
  ],
};
