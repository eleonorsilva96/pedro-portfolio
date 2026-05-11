import type { GlobalConfig } from "payload";
import { headerFields } from "@/fields/headerFields";
import { footerFields } from "@/fields/footerFields";
import { revalidateGlobal } from '@/app/(my-app)/lib/hooks';

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  hooks: {
    afterChange: [revalidateGlobal('/')],
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
      name: 'titleSuffix',
      type: 'text',
      required: true,
      defaultValue: '— Pedro A. Martins'
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
