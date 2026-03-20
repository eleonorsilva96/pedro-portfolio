import { UploadField } from "payload";

export const videoField: UploadField = {
  name: "video",
  type: "upload",
  relationTo: "media",
  required: true,
  filterOptions: {
    // only show video files
    mimeType: { contains: "video" },
  },
};
