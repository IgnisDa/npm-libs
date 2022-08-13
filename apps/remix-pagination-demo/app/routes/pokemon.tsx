import { RemixPagination } from '@ignisda/remix-pagination';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import RemixImage from 'remix-image';

import { graphqlSdk } from '../lib/services/graphql.server';
import pokemonPageStyles from '../styles/pages/pokemon.css';

import type { LoaderArgs, LinksFunction, MetaFunction } from '@remix-run/node';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: pokemonPageStyles }];
};

export const meta: MetaFunction = () => {
  return { title: 'Pokemon List' };
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const offset = (parseInt(url.searchParams.get('page') || '1') - 1) * 10;
  const { pokemons } = await graphqlSdk.GetSomePokemon({ offset });
  return json({ count: pokemons?.count, allPokemon: pokemons?.results });
}

export default function () {
  const { allPokemon, count } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col mx-auto space-y-5">
      <h1 className="text-3xl text-center uppercase underline">Pokemon List</h1>
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-10 gap-y-6 my-8 lg:my-0">
          {allPokemon?.map((p) => (
            <div key={p?.id} data-pokemon-id={p?.id}>
              <div className="h-32 w-32 object-contain">
                <RemixImage src={p?.artwork || ''} />
              </div>
              <h1 className="text-center capitalize text-lg font-mono">
                {p?.name}
              </h1>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <RemixPagination total={count || 0} size={20} classPrefix="pokemon" />
      </div>
    </div>
  );
}
