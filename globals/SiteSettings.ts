import type { GlobalConfig } from "payload";
import { headerFields } from "@/fields/headerFields";
import { footerFields } from "@/fields/footerFields";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
  },
  fields: [
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
                }
            ],
        },

        // ADD SEO SECTION
      ],
    },
  ],
};
