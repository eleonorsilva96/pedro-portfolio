import type { GlobalConfig } from "payload";

import { videoField } from "@/fields/videoFields";
import { imageField } from "@/fields/imageField";
import { revalidateGlobal } from '@/app/(my-app)/lib/hooks';

export const Homepage: GlobalConfig = {
  slug: "homepage",
  hooks: {
    afterChange: [revalidateGlobal('/')],
  },
  fields: [
    {
      ...videoField, // unpack all default properties to add a new one
      label: "Hero Video",
    },
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
