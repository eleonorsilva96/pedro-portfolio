import { UploadField } from "payload";

export const imageField: UploadField = {
  name: "image",
  type: "upload",
  relationTo: "media",
  required: true,
  filterOptions: {
    // only show image files
    mimeType: { contains: "image" },
  },
};
