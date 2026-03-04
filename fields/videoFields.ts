import { Field } from "payload";

export const videoField: Field = {
  name: "video",
  type: "upload",
  relationTo: "media",
  required: true,
  filterOptions: {
    // only show video files
    mimeType: { contains: "video" },
  },
};
