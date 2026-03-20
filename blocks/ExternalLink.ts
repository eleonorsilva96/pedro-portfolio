import { Block } from "payload";

import { externalLinkField } from "../fields/externalLinkField";

export const ExternalLinkBlock: Block = {
  slug: "externalLinkBlock",
  fields: [
    externalLinkField,
  ],
};
