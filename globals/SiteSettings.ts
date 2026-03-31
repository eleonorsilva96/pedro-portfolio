import type { GlobalConfig } from "payload";
import { headerFields } from "@/fields/headerFields";
import { footerFields } from "@/fields/footerFields";
import { revalidateTag } from 'next/cache';

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  hooks: {
    // event triggered when the content is changed in the cms panel (hit save button) 
    afterChange: [
      ({ doc, req }) => {
        // safety check: avoid hitting the Next.js Cache API during bulk DB scripts or migrations
        if (req.context?.skipRevalidate) return doc;

        // when the data is saved on the MongoDB, immediately clear this specific cache tag in the front
        revalidateTag('global_site_settings', { expire: 0 }); 

        return doc;
      },
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "favicon",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        // header
        {
            label: 'Header',
            name: 'header',
            fields: [
                ...headerFields,
            ],
        },
        {
            label: 'Footer',
            name: 'footer',
            fields: [
                ...footerFields,
            ],
        },
        {
            label: 'Contact Form',
            name: 'contactSection',
            fields: [
                {
                    name: 'formTitle',
                    type: 'text',
                    defaultValue: 'Pede um orçamento grátis',
                },
                //  QUERO ORÇAMENTO button
                {
                  name: "buttonText",
                  type: "text",
                  required: true,
                },
            ],
        },

        // ADD SEO SECTION
      ],
    },
  ],
};
