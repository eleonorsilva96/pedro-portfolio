import { Field } from 'payload';

export const externalLinkField: Field = {
  name: 'externalLink',
  type: 'text',
  required: true,
  label: 'Link',
  admin: {
    description: 'Enter a valid URL',
  },
  validate: (value: string | undefined | null) => {
    // if value is empty, show warning message
    
    if (!value) {
      return 'Please enter a URL.';
    }
    try {
      // if it builds a URL object
      new URL(value);

      return true;
    } catch(error) {
      return 'Please enter a valid URL.';
    }
    
  },
};
