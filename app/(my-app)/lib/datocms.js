// function to fetch content from DatoCMS

// package that offers various helpers around the native Fetch API
// to perform GraphQL requests towards DatoCMS API
// it need manual caching to be able to save request in POST
import { executeQuery } from '@datocms/cda-client';
import { cache } from 'react';

const dedupedPerformRequest = cache(async (serializedArgs) => {
  return executeQuery(...JSON.parse(serializedArgs));
})

export function performRequest(query, options) {
  return dedupedPerformRequest(JSON.stringify([
    query,
    {
      ...options,
      token: process.env.NEXT_DATOCMS_API_TOKEN,
      environment: process.env.NEXT_DATOCMS_ENVIRONMENT,
    },
  ]));
}