import { Block } from "payload";

import { imageField } from "../fields/imageField";

export const ImagesBlock: Block = {
  slug: "ImagesBlock",
  fields: [
    {
      name: 'images',
      type: 'array',
      label: 'Image Gallery',
      minRows: 1,
      maxRows: 20,
      fields: [
        imageField, 
      ],
    }
  ],
};
