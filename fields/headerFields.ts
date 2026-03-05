import { Field } from "payload";

import { titleField } from "./titleField";

// reusable set of fields
export const headerFields: Field[] = [
  {
    name: "logo",
    type: "text",
    required: true,
  },
  {
    name: "serviceGroup",
    type: "group",
    label: "Services",
    fields: [
      titleField,
      {
        name: "navServices",
        type: "array",
        label: "Menu List",
        labels: {
          singular: "Item",
          plural: "Items",
        },
        fields: [
          {
            name: "service",
            type: "relationship",
            required: true,
            relationTo: "services",
            hasMany: false,
          },
        ],
      },
    ],
  },
  {
    name: "categoryGroup",
    type: "group",
    label: "Categories",
    fields: [
      titleField,
      {
        name: "navCategories",
        type: "array",
        label: "Menu List",
        labels: {
          singular: "Item",
          plural: "Items",
        },
        fields: [
          {
            name: "category",
            required: true,
            type: "relationship",
            relationTo: "categories",
            hasMany: false,
          },
        ],
      },
    ],
  },
  {
    name: "aboutMeGroup",
    type: "group",
    label: "About Me",
    fields: [
      titleField,
      {
        name: "url",
        type: "text",
        defaultValue: "/about",
        admin: {
          readOnly: true, // The client sees it, but can't edit it and break the site!
          description: "This route is locked by the system.",
        },
      },
    ],
  },
  {
    name: "contactGroup",
    type: "group",
    label: "Contact",
    fields: [
      titleField,
      {
        name: "url",
        type: "text",
        defaultValue: "/contact",
        admin: {
          readOnly: true, // The client sees it, but can't edit it and break the site!
          description: "This route is locked by the system.",
        },
      },
    ],
  },
];
