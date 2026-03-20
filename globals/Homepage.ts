import type { GlobalConfig } from "payload";

import { videoField } from "@/fields/videoFields";
import { imageField } from "@/fields/imageField";
import { revalidateTag } from 'next/cache';


export const Homepage: GlobalConfig = {
  slug: "homepage",
  hooks: {
    // event triggered when the content is changed (hit save button) 
    afterChange: [
      ({ doc, req }) => {
        // safety check: avoid hitting the Next.js Cache API during bulk DB scripts or migrations
        if (req.context?.skipRevalidate) return doc;

        // when the data is saved on the MongoDB, immediately clear this specific cache tag in the front
        revalidateTag('global_homepage', { expire: 0 });

        return doc;
      },
    ],
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
