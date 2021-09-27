import fetch from 'cross-fetch';
import { O } from 'ts-toolbelt';
import { wrap } from './expression';
import { QueryError } from './errors';

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
  url: RegionGroupURL | string;

  /**
   * How requests will be made to the FaunaDB URL. In the following example, `fetch` is globally
   * available:
   * ```ts
   * const config: ClientConfig = {
   *   // Other config...
   *   fetch: (input, init) => {
   *     return fetch(input, init);
   *   }
   * }
   * ```
   * This function must return a Promise which resolves to a Response compatible with the
   * Fetch API (https://developer.mozilla.org/en-US/docs/Web/API/Response).
   */
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

enum RegionGroupURL {
  US = 'https://db.us.fauna.com/',
  EU = 'https://db.eu.fauna.com/',
  CLASSIC = 'https://db.fauna.com/',
}

const defaultFetch: ClientConfig['fetch'] = (input, init) => {
  return fetch(input, init);
};

class Client {
  private config: ClientConfig;

  constructor(config: O.Optional<ClientConfig, 'url' | 'fetch'>) {
    this.config = {
      ...config,
      url: config.url ?? RegionGroupURL.CLASSIC,
      fetch: config.fetch ?? defaultFetch,
    };
  }

  query = async <TResource = unknown>(expression: unknown) => {
    const response = await this.config.fetch(this.config.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.secret}`,
      },
      body: JSON.stringify(wrap(expression)),
    });

    if (!response.ok) {
      const json = (await response.json()) as {
        errors: QueryError['rawErrors'];
      };
      const error = json.errors[0];
      throw new QueryError(error.code, error.description, json.errors);
    }

    const json = (await response.json()) as { resource: TResource };
    return json.resource;
  };
}

export { Client, RegionGroupURL };
