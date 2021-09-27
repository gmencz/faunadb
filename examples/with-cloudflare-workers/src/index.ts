import { Query } from '@gmencz/faunadb';
import { createFaunaDBClient, Schema } from './lib/faunadb';

type CountriesQuery = Schema['Collections']['countries'][];

export default {
  async fetch(_request: Request, env: Env) {
    const faunadb = createFaunaDBClient(env.FAUNADB_KEY_SECRET);
    const q = new Query<Schema>();

    const countries = await faunadb.query<CountriesQuery>(
      q.Let(
        {
          page: q.Map(
            q.Paginate(q.Match(q.Index('all_countries'))),
            q.Lambda('page', q.Select(['data'], q.Get(q.Var('page'))))
          ),
        },
        q.Select(['data'], q.Var('page'))
      )
    );

    return new Response(JSON.stringify(countries));
  },
};
