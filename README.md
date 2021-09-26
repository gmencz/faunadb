<div align="center">
<h1>@gmencz/faunadb ⚡</h1>

<p>TypeScript-first FaunaDB client with static type inference.</p>
</div>

## The problem

The official [FaunaDB client](https://github.com/fauna/faunadb-js) doesn't have great TypeScript support, it's not tree-shakable
and the bundle size is way bigger than it should be ([20.6KB minified + gzipped](https://bundlephobia.com/package/faunadb)) considering FaunaDB is often used in serverless environments where the script size is limited.

## This solution

This client is fully written in TypeScript with a focus on type-safety which is achieved with static type inference. You declare what your FaunaDB schema looks like and the client will ensure your queries are correctly written.

I also try to avoid dependencies where possible to keep the bundle size as small as possible, currently the bundle size is under [4KB minified + gzipped](https://bundlephobia.com/package/@gmencz/faunadb).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Todo](#todo)
- [Inspiration](#inspiration)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [LICENSE](#license)

## Installation

This module is distributed via npm and should be installed as one of your project's `dependencies`:

```
npm install @gmencz/faunadb
```

Or with yarn:

```
yarn add @gmencz/faunadb
```

## Usage

### Todo

## Inspiration

As I was working on a Cloudflare Workers API which was entirely written in TypeScript and used FaunaDB for the database, I found
that the official client could be better so I made this.

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][https://github.com/gmencz/faunadb/issues?utf8=%e2%9c%93&q=is%3aissue+is%3aopen+sort%3acreated-desc+label%3abug]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][https://github.com/gmencz/faunadb/issues?utf8=%e2%9c%93&q=is%3aissue+is%3aopen+sort%3areactions-%2b1-desc+label%3aenhancement]

## LICENSE

MIT
