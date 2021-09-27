import { q, createFaunaDBClient, Schema } from './lib/faunadb';

type CountriesQuery = Schema['Collections']['countries'][];

export default {
  async fetch(_request: Request, env: Env) {
    const faunadb = createFaunaDBClient(env.FAUNADB_KEY_SECRET);

    const countries = await faunadb.query<CountriesQuery>(
      q.Let(
        {
          paginationResult: q.Map(
            q.Paginate(q.Match(q.Index('all_countries'))),
            q.Lambda('page', q.Select(['data'], q.Get(q.Var('page'))))
          ),
        },
        q.Select(['data'], q.Var('paginationResult'))
      )
    );

    return new Response(JSON.stringify(countries));
  },
};
