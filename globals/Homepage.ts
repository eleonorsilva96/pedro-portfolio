import type { GlobalConfig, UploadField } from "payload";

import { videoField } from "@/fields/videoFields";
import { imageField } from "@/fields/imageField";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  // Globals don't need 'admin.useAsTitle' because there is no list of items!
  fields: [
    {
      ...videoField, // unpack all default properties to add a new one
      label: "Hero Video",
    } as UploadField,
    {
      name: "aboutSection",
      type: "group",
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "text",
          required: true,
        },
        {
          name: "buttonText",
          type: "text",
          required: true,
        },
        imageField,
      ],
    },
    {
      name: "featuredProjectsSection",
      type: "group",
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "projects",
          type: "array",
          fields: [
            {
              name: "referenceProject",
              label: "Project",
              type: "relationship",
              relationTo: "projects",
              hasMany: false,
            },
          ],
        },
      ],
    },
    {
      name: "servicesSection",
      type: "group",
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "services",
          type: "array",
          fields: [
            {
              name: "referenceService",
              label: "Service",
              type: "relationship",
              relationTo: "services",
              hasMany: false,
            },
          ],
        },
      ],
    },
    {
      name: "formSection",
      type: "group",
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          defaultValue: "Pede um orçamento gratis",
        },
      ],
    },
  ],
};
