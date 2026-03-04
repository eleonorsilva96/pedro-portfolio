import { Block } from "payload";

export const VideoBlock: Block = {
  slug: "videoBlock",
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Project Video",
      filterOptions: {
        // only show video files 
        mimeType: { contains: "video" },
      },
    },
  ],
};
