import { Block } from "payload";
import { slugField } from 'payload';

import { imageField } from "../fields/imageField";

export const ImageTitleBlock: Block = {
  slug: "imageTitleBlock",
  fields: [
    {
        name: 'title',
        type: 'text',
        required: true,
    },
    slugField(),
    imageField
  ],
};
