import { Client, SchemaTypes } from '@gmencz/faunadb';

type Schema = SchemaTypes & {
  Collections: {
    countries: {
      name: string;
    };
  };

  Indexes: ['all_countries'];
};

const createFaunaDBClient = (secret: string) => {
  return new Client({
    secret,
    // We need a custom `fetch` because the Workers runtime uses a custom version of fetch.
    fetch: (input, init) => {
      const signal = init?.signal;
      delete init?.signal;

      const abortPromise = new Promise<never>((_, reject) => {
        if (signal) {
          signal.onabort = reject;
        }
      });

      return Promise.race([abortPromise, fetch(input, init)]);
    },
  });
};

export { Schema, createFaunaDBClient };
