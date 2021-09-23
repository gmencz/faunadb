interface ClientConfig {
  /**
   * Opaque bearer token, associated with a token document or key document
   * within Fauna, that provides access to a specific database.
   * A secret is displayed only once at creation time; it should be stored
   * securely, and needs to be revoked and recreated if lost.
   */
  secret: string;

  /**
   * The URL where your database is located. It's common to use `http://localhost:8443`
   * in development for accesing a local FaunaDB database. For production, you can use
   * one of the region groups's URL. Learn more about region groups here: https://docs.fauna.com/fauna/current/api/fql/region_groups.
   * Defaults to the classic region group URL `https://db.fauna.com`.
   */
  url?: RegionGroupURL | string;

  /**
   * A custom fetch implementation.
   */
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

enum RegionGroupURL {
  US = 'https://db.us.fauna.com',
  EU = 'https://db.eu.fauna.com',
  CLASSIC = 'https://db.fauna.com',
}

const defaultFetch: ClientConfig['fetch'] = (input, init) => {
  let signal: AbortSignal | null = null;
  if (init?.signal) {
    signal = init?.signal;
    delete init?.signal;
  }

  const abortPromise = new Promise<never>((_resolve, reject) => {
    if (signal) {
      signal.onabort = () => reject('aborted');
    }
  });

  return Promise.race([abortPromise, fetch(input, init)]);
};

class Client {
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    const configURL = config.url ?? RegionGroupURL.CLASSIC;
    const configFetch = config.fetch ?? defaultFetch;

    this.config = {
      ...config,
      url: configURL,
      fetch: configFetch,
    };
  }

  log = () => {
    console.log(this.config);
  };

  // query: (expression: Expression) => {};
}

export { Client, RegionGroupURL };
