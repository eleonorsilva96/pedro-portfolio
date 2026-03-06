import { Field } from 'payload';

// 1. The Portuguese formatter logic
const formatSlug = (stringToFormat: string): string => {
  return stringToFormat
    .normalize('NFD')                     // Splits "í" into "i" + "´" and "ç" into "c" + "¸"
    .replace(/[\u0300-\u036f]/g, '')      // Deletes all the floating accent marks
    .toLowerCase()                        // Converts to lowercase
    .trim()                               // Removes spaces from the start and end
    .replace(/[^a-z0-9\s-]/g, '')         // Removes any remaining illegal characters
    .replace(/[\s-]+/g, '-')              // Replaces spaces with hyphens
    .replace(/^-+|-+$/g, '');             // Cleans up any leftover hyphens at the edges
};

// 2. The custom reusable field (Factory Function)
export const slugField = (fallbackField: string = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  admin: {
    position: 'sidebar', // Keeps it nicely tucked on the right side of the CMS
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        // If the user manually typed a custom slug, format it and lock it.
        if (value) {
          return formatSlug(value);
        }
        // If the slug is empty, grab the fallback field (usually "title"), format it, and lock it.
        if (data && data[fallbackField]) {
          return formatSlug(data[fallbackField]);
        }
        return value;
      },
    ],
  },
});