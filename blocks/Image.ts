import { Block } from "payload";

import { imageField } from "../fields/imageField";

export const ImageBlock: Block = {
  slug: "imageBlock",
  fields: [
    imageField
  ],
};
