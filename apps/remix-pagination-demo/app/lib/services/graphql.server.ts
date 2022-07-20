import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
} from 'urql';
import { createUrqlRequester } from 'urql-generic-requester';

import { POKEMON_API_URL } from '../constants';
import { getSdk } from '../graphql-generated';

const client = createClient({
  url: POKEMON_API_URL,
  exchanges: [dedupExchange, cacheExchange, fetchExchange],
});

const requestHandler = createUrqlRequester(client);

export const graphqlSdk = getSdk(requestHandler);
