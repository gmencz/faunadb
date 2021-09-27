<p align="center">
  <a aria-label="CI workflow status" href="https://github.com/gmencz/faunadb/actions/workflows/main.yml">
    <img alt="" src="https://github.com/gmencz/faunadb/actions/workflows/main.yml/badge.svg">
  </a>
  
  <a aria-label="Semantic release" href="https://github.com/semantic-release/semantic-release">
    <img alt="" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a>

  <a aria-label="NPM version" href="https://www.npmjs.com/package/@gmencz/faunadb">
    <img alt="" src="https://badgen.net/npm/v/@gmencz/faunadb">
  </a>

  <a aria-label="Package size" href="https://bundlephobia.com/result?p=@gmencz/faunadb">
    <img alt="" src="https://badgen.net/bundlephobia/minzip/@gmencz/faunadb">
  </a>

  <a aria-label="License" href="https://github.com/gmencz/faunadb/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@gmencz/faunadb">
  </a>
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [Client configuration](#client-configuration)
    - [secret](#secret)
    - [url](#url)
    - [fetch](#fetch)
  - [Schema](#schema)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [LICENSE](#license)

## Introduction

TypeScript-first FaunaDB client with static type inference. You declare what your FaunaDB schema looks like and the client will ensure your queries are written correctly.

One of the main focuses of the library is to keep the bundle size as small as possible due to FaunaDB being used the most in serverless environments where script size is limited.

## Installation

```
npm install @gmencz/faunadb
```

## Usage

```ts
import { Client, QueryBuilder, SchemaTypes } from '@gmencz/faunadb';

// Create a new FaunaDB client with your credentials.
// Get them from your dashboard (https://dashboard.fauna.com/).
const client = new Client({
  secret: 'your-faunadb-key-secret',
});

// Define your FaunaDB schema. Your schema type should follow the base type of `SchemaTypes`, you can hover over `SchemaTypes` or go to definition to see what it looks like. This will help the `QueryBuilder` validate your queries.
type Schema = SchemaTypes & {
  Collections: {
    countries: {
      name: string;
    };
  };

  Indexes: ['all_countries'];
};

// Create a new `QueryBuilder` and provide your schema as a generic. A `QueryBuilder` helps you build queries using FQL (https://docs.fauna.com/fauna/current/api/fql/), all non-deprecated FQL built-in functions are available and the API of every function is identical to the API described in the docs so you should look at the official FaunaDB docs for learning about a function. That's all! Now you can run your queries in a type-safe way:
const q = new QueryBuilder<Schema>();

type CountriesQuery = Schema['Collections']['countries'][];

// The `query()` method accepts a generic which allows you to tell the client what you're expecting back to be returned from the query.
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

console.log(countries);
```

### Client configuration

#### secret

Opaque bearer token, associated with a token document or key document
within Fauna, that provides access to a specific database.
A secret is displayed only once at creation time; it should be stored
securely, and needs to be revoked and recreated if lost.

#### url

The URL where your database is located. It's common to use `http://localhost:8443`
in development for accesing a local FaunaDB database. For production, you can use
one of the region groups's URL. Learn more about region groups here: https://docs.fauna.com/fauna/current/api/fql/region_groups.
Defaults to the classic region group URL `https://db.fauna.com`. A `RegionGroupURL` enum is exported with the URLs for each region group.

For example, if you chose the EU region group, you could set it up like this:

```ts
import { Client, RegionGroupURL } from '@gmencz/faunadb';

const client = new Client({
  // other config...
  url: RegionGroupURL.EU,
});
```

#### fetch

A custom `fetch` implementation, this is useful where your runtime implements a custom version of `fetch` like when using Cloudflare Workers.

Cloudflare Workers example:

```ts
import { Client, RegionGroupURL } from '@gmencz/faunadb';

const client = new Client({
  // other config...
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
```

### Schema

These are the parts of your schema you can define:

```ts
AccessProviders?: string[] | undefined;
Collections?: Record<string, unknown> | undefined;
Databases?: string[] | undefined;
Functions?: Record<string, unknown> | undefined;
Indexes?: string[] | undefined;
Roles?: string[] | undefined;
```

## Issues

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**](https://github.com/gmencz/faunadb/issues?utf8=%e2%9c%93&q=is%3aissue+is%3aopen+sort%3acreated-desc+label%3abug)

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**](https://github.com/gmencz/faunadb/issues?utf8=%e2%9c%93&q=is%3aissue+is%3aopen+sort%3areactions-%2b1-desc+label%3aenhancement)

## LICENSE

MIT
