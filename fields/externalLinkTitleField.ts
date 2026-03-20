import { Field } from 'payload';
import { externalLinkField } from './externalLinkField';

export const externalLinkTitleField: Field = {
  name: 'externalLinkTitleGroup',
  type: 'group',
  required: true,
  label: 'Link Button',
  fields: [
    {
        name: 'name',
        type: 'text',
        required: true,
    },
    externalLinkField,
  ],
};
