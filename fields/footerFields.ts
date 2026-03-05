import { Field } from "payload";
import { imageField } from "./imageField";

export const footerFields: Field[] = [
  {
    name: "columnLeft",
    type: "group",
    label: "Left Column",
    fields: [
      {
        name: "phoneNumber",
        type: "text",
        required: true,
        validate: (value: string | null | undefined) => {
          if (!value) return "A phone number is required.";

          // Remove all spaces and dashes
          const cleanedPhone = value.replace(/[\s-]/g, "");

          // Follow the standard portuguese phone format
          const phonePattern = /^(?:\+351|00351)?[23789]\d{8}$/;

          if (phonePattern.test(cleanedPhone)) return true;

          return "Please enter a valid phone number.";
        },
      },
      {
        name: "email",
        type: "email",
        required: true,
      },
      {
        name: "socialMediaLabel",
        type: "text",
        required: true,
      },
      {
        name: "socialMediaList",
        type: "array",
        labels: {
          singular: "Icon",
          plural: "Icons",
        },
        fields: [imageField],
      },
    ],
  },
  {
    name: "columnRight",
    type: "group",
    label: "Right Column",
    fields: [
      {
        name: "complaintsBookPage",
        type: "text",
        defaultValue: "/complaints",
        admin: {
          readOnly: true, // The client sees it, but can't edit it and break the site!
          description: "This route is locked by the system.",
        },
      },
      {
        name: "privacyPage",
        type: "text",
        defaultValue: "/privacy",
        admin: {
          readOnly: true, // The client sees it, but can't edit it and break the site!
          description: "This route is locked by the system.",
        },
      },
      {
        name: "copyright",
        type: "text",
        required: true,
        defaultValue: "by Pedro A. Martins",
      },
    ],
  },
];
