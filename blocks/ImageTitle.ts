import { Block } from "payload";

import { imageField } from "../fields/imageField";

export const ImageTitleBlock: Block = {
  slug: "imageTitleBlock",
  fields: [
    {
        name: 'title',
        type: 'text',
        required: true,
    },
    imageField,
  ],
};
