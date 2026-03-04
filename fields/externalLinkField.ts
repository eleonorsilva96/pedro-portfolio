import { Field } from 'payload';

export const externalLinkField: Field = {
  name: 'externalLink',
  type: 'text',
  required: true,
  label: 'External Link',
  admin: {
    description: 'Enter a valid URL',
  },
  validate: (value: string | undefined | null) => {
    // if value is empty, show warning message
    if (!value) {
      return 'Please enter a valid URL.';
    }
    // use regex to check if it's a valid URL
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    // check if text match with regex pattern
    if (urlPattern.test(value)) {
      return true;
    }
    return 'Please enter a valid URL.';
  },
};
