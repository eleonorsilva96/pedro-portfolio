import type { CollectionConfig } from 'payload';
import { slugField } from "@/fields/slugField";

import { ImagesBlock } from '../blocks/Images';
import { SectionsBlock } from '../blocks/Sections';
import { VideoBlock } from '../blocks/Video';
import { ExternalLinkBlock } from '../blocks/ExternalLink';
import { externalLinkTitleField } from '@/fields/externalLinkTitleField';

export const Projects: CollectionConfig = {
  slug: "projects",
  orderable: true,
  admin: {
    // title in admin
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    // automatically generates a URL-safe slug from the title
    slugField(),
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false, // set to single dropdown
      required: true,
    },
    {
      name: "tag",
      type: "relationship",
      relationTo: "tags",
      hasMany: true, // set to single dropdown
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "hideProject",
      type: "checkbox",
      label: "Hide Project from Portfolio?",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "content",
      type: "radio",
      options: [
        { label: "Single Content", value: "single" },
        { label: "Multiple Content", value: "multiple" },
      ],
      defaultValue: "single",
      admin: {
        layout: "horizontal", // Makes the radio buttons sit side-by-side
      },
    },
    // 2. The Single Object
    {
      name: "singleContent",
      type: "group", // 'group' creates a single JSON object
      label: false, // hide title
      admin: {
        // This is the magic line that hides/shows the field
        condition: (data, siblingData) => siblingData?.content === "single",
      },
      fields: [
        // slide
        {
          name: "video",
          type: "blocks",
          maxRows: 1,
          blocks: [VideoBlock, ExternalLinkBlock],
        },
        {
          name: "role",
          type: "text",
        },
        {
          name: "context",
          type: "richText",
        },
        {
          name: "date",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayOnly",
              displayFormat: "d MMM yyy",
            },
          },
        },
        {
          name: "addLink",
          type: "checkbox",
          label: "Link button?",
          defaultValue: false,
        },
        {
          ...externalLinkTitleField,
          admin: {
            // merge the field's admin property to avoid override it
            ...externalLinkTitleField.admin,
            condition: (data, siblingData) => {
              // if checkbox is true show link if not hide it
              return Boolean(siblingData.addLink);
            },
          },
        } as typeof externalLinkTitleField,
      ],
    },
    {
      name: "multipleContent",
      type: "blocks", 
      label: "Content", // Changes the header to "Content"
      labels: {
        singular: "Block", // Changes the button to "Add Block"
        plural: "Blocks", // Used internally for lists/references
      },
      admin: {
        condition: (data, siblingData) => siblingData?.content === "multiple",
      },
      maxRows: 1,
      blocks: [ImagesBlock, SectionsBlock],
    },
  ],
};