import { gql } from 'urql';

export const GET_SOME_POKEMON = gql`
  query GetSomePokemon($offset: Int) {
    pokemons(offset: $offset) {
      count
      results {
        id
        name
        artwork
      }
    }
  }
`;
