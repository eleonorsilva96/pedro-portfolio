import type { CollectionConfig } from 'payload';
import { slugField } from "@/fields/slugField";

import { ImageBlock } from '../blocks/Image';
import { SectionBlock } from '../blocks/Section';
import { VideoBlock } from '../blocks/Video';
import { ExternalLinkBlock } from '../blocks/ExternalLink';

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    // title in admin
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    // automatically generates a URL-safe slug from the title
    slugField(),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false, // set to single dropdown
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'radio',
      options: [
        { label: 'Single Content', value: 'single' },
        { label: 'Multiple Content', value: 'multiple' },
      ],
      defaultValue: 'single',
      admin: {
        layout: 'horizontal', // Makes the radio buttons sit side-by-side
      },
    },
    // 2. The Single Object
    {
      name: 'singleContent',
      type: 'group', // 'group' creates a single JSON object
      label: false, // hide title
      admin: {
        // This is the magic line that hides/shows the field
        condition: (data, siblingData) => siblingData?.content === 'single',
      },
      fields: [
        // slide
        { 
            name: 'video', 
            type: 'blocks',
            required: true,
            maxRows: 1,
            blocks: [VideoBlock, ExternalLinkBlock], 
        },
        { 
            name: 'role', 
            type: 'text' 
        },
        {
            name: 'context',
            type: 'richText'
        },
        { 
            name: 'date', 
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'dayOnly',
                    displayFormat: 'd MMM yyy',
                }
            }
        },
      ],
    },
    {
      name: 'multipleContent',
      type: 'blocks', // Changes the header to "Content"
      label: 'Content',
      labels: {
        singular: "Block", // Changes the button to "Add Block"
        plural: "Blocks", // Used internally for lists/references
      }, 
      admin: {
        condition: (data, siblingData) =>
          siblingData?.content === 'multiple',
      },
      minRows: 1,
      maxRows: 20,
      blocks: [ImageBlock, SectionBlock],
    },
  ],
};
