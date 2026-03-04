import { Field } from "payload";

export const imageField: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  required: true,
  filterOptions: {
    // only show video files
    mimeType: { contains: "image" },
  },
};
