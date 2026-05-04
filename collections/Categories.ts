import type { CollectionConfig } from 'payload';
import { slugField } from '@/fields/slugField';

import { VideoBlock } from '../blocks/Video';
import { ExternalLinkBlock } from '../blocks/ExternalLink';

export const Categories: CollectionConfig = {
  slug: 'categories',
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
      name: 'description',
      type: 'richText',
    },
    {
      name: 'addBlog',
      type: 'checkbox',
      label: 'Add an Blog List?',
      defaultValue: false,
    },
    {
      name: 'blogGroup',
      type: 'group',
      label: 'Blog',
      admin: {
        condition: (siblingData) => {
          // if checkbox is true show blog list if not hide it
          return Boolean(siblingData.addBlog)
        },
      },
      fields: [
        {
          name: 'blogList',
          label: 'List',
          type: 'array',
          labels: {
            singular: 'Project', // Changes the button to 'Add Slide'
            plural: '', // Changes the header above the array to 'Slides'
          },
          admin: {
            components: {
              Label: '@/components/CustomLabelSize.tsx#default',
            },
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'richText',
            },
            {
              name: 'link',
              type: 'blocks', // always returns a array in the json api response 
              labels: {
                singular: 'Block', // Changes the button to 'Add Project'
                plural: 'Blocks', // Changes the header above the array to 'Gallery'
              },
              maxRows: 1,
              blocks: [VideoBlock, ExternalLinkBlock],
            },
          ],
        },
        {
          name: 'cta',
          label: 'CTA',
          type: 'richText',
        }
      ]
    },
    // {
    //   name: 'content',
    //   type: 'radio',
    //   options: [
    //     { label: 'Gallery Content', value: 'gallery' },
    //     { label: 'Blog Content', value: 'blog' },
    //   ],
    //   defaultValue: 'gallery',
    //   admin: {
    //     layout: 'horizontal', // Makes the radio buttons sit side-by-side
    //   },
    // },
    // // 2. The Single Object
    // {
    //   name: 'gallery',
    //   type: 'array',
    //   labels: {
    //     singular: 'Project', // Changes the button to 'Add Project'
    //     plural: 'Gallery',  // Changes the header above the array to 'Gallery'
    //   }, 
    //   admin: {
    //     // This is the magic line that hides/shows the field
    //     condition: (data, siblingData) => siblingData?.content === 'gallery',
    //   },
    //   fields: [
    //     // slide
    //     {
    //       name: 'project',
    //       type: 'relationship',
    //       relationTo: 'projects', // This must exactly match the slug of your Projects collection
    //       hasMany: false, // Set to false for a single dropdown, true for a multi-select dropdown
    //       required: true,
    //       admin: {
    //         position: 'sidebar', // Optional: moves the dropdown to the right sidebar
    //       },
    //     },
    //       {
    //         name: 'tags',
    //         type: 'relationship',
    //         relationTo: 'tags', 
    //         hasMany: true, // Set to true so you can select multiple tags at once
    //         admin: {
    //           position: 'sidebar',
    //         }
    //       }
    //   ],
    // },
    // {
    //   name: 'blog',
    //   type: 'array',
    //   labels: {
    //     singular: 'Project', // Changes the button to 'Add Slide'
    //     plural: 'Blog',  // Changes the header above the array to 'Slides'
    //   },
    //   admin: {
    //     condition: (data, siblingData) => siblingData?.content === 'blog',
    //   },
    //   fields: [
    //     {
    //       name: 'title',
    //       type: 'text',
    //       required: true,
    //     },
    //     {
    //       name: 'description',
    //       type: 'text',
    //     },
    //     {
    //       name: 'link',
    //       type: 'blocks',
    //       labels: {
    //         singular: 'Block', // Changes the button to 'Add Project'
    //         plural: 'Blocks',  // Changes the header above the array to 'Gallery'
    //       }, 
    //       maxRows: 1,
    //       blocks: [VideoBlock, ExternalLinkBlock],
    //     },
    //   ],
    // },
  ],
};
