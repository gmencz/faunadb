import { QueryBuilder, SchemaTypes } from './query-builder';

test('Abort', () => {
  expect(new QueryBuilder().Abort('Something went wrong'))
    .toMatchInlineSnapshot(`
      Object {
        "abort": "Something went wrong",
      }
    `);
});

test('Abs', () => {
  expect(new QueryBuilder().Abs(-100)).toMatchInlineSnapshot(`
      Object {
        "abs": -100,
      }
    `);
});

test('AccessProvider', () => {
  expect(new QueryBuilder().AccessProvider('Auth0-myapp'))
    .toMatchInlineSnapshot(`
      Object {
        "access_provider": "Auth0-myapp",
      }
    `);
});

test('AccessProviders', () => {
  const q = new QueryBuilder<{
    Databases: ['child1'];
  }>();

  expect(q.AccessProviders()).toMatchInlineSnapshot(`
      Object {
        "access_providers": null,
      }
    `);

  // TODO: Also test with a child database param.
  expect(q.AccessProviders(q.Database('child1'))).toMatchInlineSnapshot(`
      Object {
        "access_providers": Object {
          "database": "child1",
        },
      }
    `);
});

test('Acos', () => {
  expect(new QueryBuilder().Acos(0.5)).toMatchInlineSnapshot(`
      Object {
        "acos": 0.5,
      }
    `);
});

test('Add', () => {
  expect(new QueryBuilder().Add(1, 3)).toMatchInlineSnapshot(`
      Object {
        "add": Array [
          1,
          3,
        ],
      }
    `);

  expect(new QueryBuilder().Add(2)).toMatchInlineSnapshot(`
      Object {
        "add": 2,
      }
    `);
});

test('All', () => {
  expect(new QueryBuilder().All(1, 3)).toMatchInlineSnapshot(`
      Object {
        "all": Array [
          1,
          3,
        ],
      }
    `);

  expect(new QueryBuilder().All(2)).toMatchInlineSnapshot(`
      Object {
        "all": 2,
      }
    `);
});

test('And', () => {
  expect(new QueryBuilder().And(true, false)).toMatchInlineSnapshot(`
      Object {
        "and": Array [
          true,
          false,
        ],
      }
    `);

  expect(new QueryBuilder().And(true)).toMatchInlineSnapshot(`
      Object {
        "and": true,
      }
    `);
});

test('Any', () => {
  expect(new QueryBuilder().Any(true, false)).toMatchInlineSnapshot(`
      Object {
        "any": Array [
          true,
          false,
        ],
      }
    `);

  expect(new QueryBuilder().Any(true)).toMatchInlineSnapshot(`
      Object {
        "any": true,
      }
    `);
});

test('Append', () => {
  expect(new QueryBuilder().Append([1, 2, 3], [2, 2])).toMatchInlineSnapshot(`
      Object {
        "append": Array [
          1,
          2,
          3,
        ],
        "collection": Array [
          2,
          2,
        ],
      }
    `);

  expect(
    new QueryBuilder().Append(
      [1, 2, 3, { test: true }],
      [2, 2, { test2: true }]
    )
  ).toMatchInlineSnapshot(`
      Object {
        "append": Array [
          1,
          2,
          3,
          Object {
            "object": Object {
              "test": true,
            },
          },
        ],
        "collection": Array [
          2,
          2,
          Object {
            "object": Object {
              "test2": true,
            },
          },
        ],
      }
    `);
});

test('Asin', () => {
  expect(new QueryBuilder().Asin(0.5)).toMatchInlineSnapshot(`
      Object {
        "asin": 0.5,
      }
    `);
});

test('At', () => {
  const q = new QueryBuilder();

  expect(q.At(q.Now(), { b: 7 })).toMatchInlineSnapshot(`
      Object {
        "at": Object {
          "now": null,
        },
        "expr": Object {
          "object": Object {
            "b": 7,
          },
        },
      }
    `);

  expect(
    q.At(
      q.Time('1970-01-01T00:00:00+00:00'),
      q.Let(
        {
          num: 1,
        },
        {
          result: q.Var('num'),
        }
      )
    )
  ).toMatchInlineSnapshot(`
      Object {
        "at": Object {
          "time": "1970-01-01T00:00:00+00:00",
        },
        "expr": Object {
          "in": Object {
            "object": Object {
              "result": Object {
                "var": "num",
              },
            },
          },
          "let": Array [
            Object {
              "num": 1,
            },
          ],
        },
      }
    `);
});

test('Atan', () => {
  expect(new QueryBuilder().Atan(0.5)).toMatchInlineSnapshot(`
      Object {
        "atan": 0.5,
      }
    `);
});

test('BitAnd', () => {
  const q = new QueryBuilder();

  expect(q.BitAnd(7)).toMatchInlineSnapshot(`
      Object {
        "bitand": 7,
      }
    `);

  expect(q.BitAnd(7, 3)).toMatchInlineSnapshot(`
      Object {
        "bitand": Array [
          7,
          3,
        ],
      }
    `);
});

test('BitNot', () => {
  const q = new QueryBuilder();

  expect(q.BitNot(7)).toMatchInlineSnapshot(`
      Object {
        "bitnot": 7,
      }
    `);
});

test('BitOr', () => {
  const q = new QueryBuilder();

  expect(q.BitOr(7)).toMatchInlineSnapshot(`
      Object {
        "bitor": 7,
      }
    `);

  expect(q.BitOr(7, 3)).toMatchInlineSnapshot(`
      Object {
        "bitor": Array [
          7,
          3,
        ],
      }
    `);
});

test('BitXor', () => {
  const q = new QueryBuilder();

  expect(q.BitXor(7)).toMatchInlineSnapshot(`
      Object {
        "bitxor": 7,
      }
    `);

  expect(q.BitXor(7, 3)).toMatchInlineSnapshot(`
      Object {
        "bitxor": Array [
          7,
          3,
        ],
      }
    `);
});

test('Call', () => {
  const q = new QueryBuilder<{
    Databases: ['child1', 'child2'];
    Collections: {};
    Functions: {
      add: [number, number];
      increment: number;
    };
  }>();

  expect(q.Call('add', [2, 3])).toMatchInlineSnapshot(`
      Object {
        "arguments": Array [
          2,
          3,
        ],
        "call": "add",
      }
    `);

  expect(q.Call(q.Function('add'), [2, 3])).toMatchInlineSnapshot(`
      Object {
        "arguments": Array [
          2,
          3,
        ],
        "call": Object {
          "function": "add",
        },
      }
    `);

  expect(q.Call(q.Function('add', q.Database('child1')), [2, 3]))
    .toMatchInlineSnapshot(`
      Object {
        "arguments": Array [
          2,
          3,
        ],
        "call": Object {
          "function": "add",
          "scope": Object {
            "database": "child1",
          },
        },
      }
    `);

  expect(
    q.Call(
      q.Function('add', q.Database('child1', q.Database('child2'))),
      [2, 3]
    )
  ).toMatchInlineSnapshot(`
      Object {
        "arguments": Array [
          2,
          3,
        ],
        "call": Object {
          "function": "add",
          "scope": Object {
            "database": "child1",
            "scope": Object {
              "database": "child2",
            },
          },
        },
      }
    `);

  expect(q.Call('increment', 2)).toMatchInlineSnapshot(`
      Object {
        "arguments": 2,
        "call": "increment",
      }
    `);

  expect(q.Call(q.Function('increment'), 2)).toMatchInlineSnapshot(`
      Object {
        "arguments": 2,
        "call": Object {
          "function": "increment",
        },
      }
    `);
});

test('Casefold', () => {
  const q = new QueryBuilder();

  expect(q.Casefold('Hen Wen')).toMatchInlineSnapshot(`
      Object {
        "casefold": "Hen Wen",
      }
    `);

  expect(q.Casefold('Hen Wen', 'NFKD')).toMatchInlineSnapshot(`
      Object {
        "casefold": "Hen Wen",
        "normalizer": "NFKD",
      }
    `);
});

test('Ceil', () => {
  expect(new QueryBuilder().Ceil(7.0)).toMatchInlineSnapshot(`
      Object {
        "ceil": 7,
      }
    `);
});

test('Collection', () => {
  const q = new QueryBuilder<{
    Databases: ['child1'];
    Functions: {};
    Collections: {
      users: {};
    };
  }>();

  expect(q.Collection('users')).toMatchInlineSnapshot(`
      Object {
        "collection": "users",
      }
    `);

  expect(q.Collection('users', q.Database('child1'))).toMatchInlineSnapshot(`
      Object {
        "collection": "users",
        "scope": Object {
          "database": "child1",
        },
      }
    `);
});

test('Collections', () => {
  const q = new QueryBuilder<{
    Databases: ['child1'];
    Functions: {};
    Collections: {
      users: {};
    };
  }>();

  expect(q.Collections()).toMatchInlineSnapshot(`
      Object {
        "collections": null,
      }
    `);

  expect(q.Collections(q.Database('child1'))).toMatchInlineSnapshot(`
      Object {
        "collections": Object {
          "database": "child1",
        },
      }
    `);
});

test('Concat', () => {
  const q = new QueryBuilder();

  expect(q.Concat(['Hen', 'Wen'], ' ')).toMatchInlineSnapshot(`
      Object {
        "concat": Array [
          "Hen",
          "Wen",
        ],
        "separator": " ",
      }
    `);

  expect(q.Concat(['Hen', 'Wen'])).toMatchInlineSnapshot(`
      Object {
        "concat": Array [
          "Hen",
          "Wen",
        ],
      }
    `);
});

test('ContainsField', () => {
  const q = new QueryBuilder();

  expect(
    q.ContainsField('a', {
      a: 1,
      b: 2,
      c: 3,
    })
  ).toMatchInlineSnapshot(`
      Object {
        "contains_field": "a",
        "in": Object {
          "object": Object {
            "a": 1,
            "b": 2,
            "c": 3,
          },
        },
      }
    `);

  expect(q.ContainsField('0', '0')).toMatchInlineSnapshot(`
      Object {
        "contains_field": "0",
        "in": "0",
      }
    `);
});

test('ContainsPath', () => {
  const q = new QueryBuilder();

  expect(q.ContainsPath([1, 2], [1, ['a', 'b', 'c'], 3]))
    .toMatchInlineSnapshot(`
      Object {
        "contains_path": Array [
          1,
          2,
        ],
        "in": Array [
          1,
          Array [
            "a",
            "b",
            "c",
          ],
          3,
        ],
      }
    `);

  expect(
    q.ContainsPath(['b', 'two'], {
      a: 1,
      b: { two: 2 },
      c: 3,
    })
  ).toMatchInlineSnapshot(`
      Object {
        "contains_path": Array [
          "b",
          "two",
        ],
        "in": Object {
          "object": Object {
            "a": 1,
            "b": Object {
              "object": Object {
                "two": 2,
              },
            },
            "c": 3,
          },
        },
      }
    `);
});

test('ContainsStr', () => {
  expect(new QueryBuilder().ContainsStr('Fauna', 'a')).toMatchInlineSnapshot(`
      Object {
        "containsstr": "Fauna",
        "search": "a",
      }
    `);
});

test('ContainsStrRegex', () => {
  expect(new QueryBuilder().ContainsStrRegex('Fauna', '(Fa|na)'))
    .toMatchInlineSnapshot(`
      Object {
        "containsstrregex": "Fauna",
        "pattern": "(Fa|na)",
      }
    `);
});

test('ContainsValue', () => {
  expect(
    new QueryBuilder().ContainsValue(3, {
      a: 1,
      b: 2,
      c: 3,
    })
  ).toMatchInlineSnapshot(`
      Object {
        "contains_value": 3,
        "in": Object {
          "object": Object {
            "a": 1,
            "b": 2,
            "c": 3,
          },
        },
      }
    `);
});

test('Cos', () => {
  expect(new QueryBuilder().Cos(0.5)).toMatchInlineSnapshot(`
      Object {
        "cos": 0.5,
      }
    `);
});

test('Cosh', () => {
  expect(new QueryBuilder().Cosh(0.5)).toMatchInlineSnapshot(`
      Object {
        "cosh": 0.5,
      }
    `);
});

test('Count', () => {
  expect(new QueryBuilder().Count([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
    .toMatchInlineSnapshot(`
      Object {
        "count": Array [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
        ],
      }
    `);
});

test('Create', () => {
  const q = new QueryBuilder<{
    Databases: [];
    Functions: {};
    Collections: {
      users: {
        id: string;
        name: string;
      };
    };
  }>();

  expect(
    q.Create('users', {
      data: {
        id: '1',
        name: 'John',
      },
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create": "users",
        "params": Object {
          "object": Object {
            "data": Object {
              "object": Object {
                "id": "1",
                "name": "John",
              },
            },
          },
        },
      }
    `);

  expect(
    q.Create(q.Collection('users'), {
      data: {
        id: '1',
        name: 'John',
      },
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create": Object {
          "collection": "users",
        },
        "params": Object {
          "object": Object {
            "data": Object {
              "object": Object {
                "id": "1",
                "name": "John",
              },
            },
          },
        },
      }
    `);

  expect(
    q.Create('users', {
      data: {
        id: '1',
        name: 'John',
        nested: {
          something: true,
        },
      },
      ttl: q.Now(),
      credentials: {
        password: '123',
      },
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create": "users",
        "params": Object {
          "object": Object {
            "credentials": Object {
              "object": Object {
                "password": "123",
              },
            },
            "data": Object {
              "object": Object {
                "id": "1",
                "name": "John",
                "nested": Object {
                  "object": Object {
                    "something": true,
                  },
                },
              },
            },
            "ttl": Object {
              "now": null,
            },
          },
        },
      }
    `);
});

test('CreateAccessProvider', () => {
  const q = new QueryBuilder<{
    Roles: ['admin'];
    AccessProviders: ['Auth0-myapp'];
  }>();

  expect(
    q.CreateAccessProvider({
      name: 'Auth0-myapp',
      issuer: 'https://myapp.auth0.com/',
      jwks_uri: 'https://myapp.auth0.com/.well-known/jwks.json',
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create_access_provider": Object {
          "object": Object {
            "issuer": "https://myapp.auth0.com/",
            "jwks_uri": "https://myapp.auth0.com/.well-known/jwks.json",
            "name": "Auth0-myapp",
          },
        },
      }
    `);

  expect(
    q.CreateAccessProvider({
      name: 'Auth0-myapp',
      issuer: 'https://myapp.auth0.com/',
      jwks_uri: 'https://myapp.auth0.com/.well-known/jwks.json',
      data: {
        something: true,
        nestedSomething: {
          hello: 'world',
        },
      },
      roles: [q.Role('admin')],
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create_access_provider": Object {
          "object": Object {
            "data": Object {
              "object": Object {
                "nestedSomething": Object {
                  "object": Object {
                    "hello": "world",
                  },
                },
                "something": true,
              },
            },
            "issuer": "https://myapp.auth0.com/",
            "jwks_uri": "https://myapp.auth0.com/.well-known/jwks.json",
            "name": "Auth0-myapp",
            "roles": Array [
              Object {
                "role": "admin",
              },
            ],
          },
        },
      }
    `);

  expect(
    q.CreateAccessProvider({
      name: 'Auth0-myapp',
      issuer: 'https://myapp.auth0.com/',
      jwks_uri: 'https://myapp.auth0.com/.well-known/jwks.json',
      data: {
        something: true,
        nestedSomething: {
          hello: 'world',
        },
      },
      roles: [
        {
          role: q.Role('admin'),
          predicate: q.Query(q.Lambda('a', 5)),
        },
      ],
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create_access_provider": Object {
          "object": Object {
            "data": Object {
              "object": Object {
                "nestedSomething": Object {
                  "object": Object {
                    "hello": "world",
                  },
                },
                "something": true,
              },
            },
            "issuer": "https://myapp.auth0.com/",
            "jwks_uri": "https://myapp.auth0.com/.well-known/jwks.json",
            "name": "Auth0-myapp",
            "roles": Array [
              Object {
                "object": Object {
                  "predicate": Object {
                    "query": Object {
                      "expr": 5,
                      "lambda": "a",
                    },
                  },
                  "role": Object {
                    "role": "admin",
                  },
                },
              },
            ],
          },
        },
      }
    `);
});

test('CreateCollection', () => {
  const q = new QueryBuilder<{
    Collections: {
      users: {};
    };
  }>();

  expect(
    q.CreateCollection({
      name: 'users',
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create_collection": Object {
          "object": Object {
            "name": "users",
          },
        },
      }
    `);
});

test('CreateDatabase', () => {
  const q = new QueryBuilder<{
    Databases: ['child1'];
  }>();

  expect(
    q.CreateDatabase({
      name: 'child1',
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create_database": Object {
          "object": Object {
            "name": "child1",
          },
        },
      }
    `);
});

test('CreateIndex', () => {
  let q = new QueryBuilder<{
    Collections: {
      users: {
        name: string;
      };
    };
  }>();

  expect(
    q.CreateIndex({
      name: 'new-index',
      source: q.Collection('users'),
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create_index": Object {
          "object": Object {
            "name": "new-index",
            "source": Object {
              "collection": "users",
            },
          },
        },
      }
    `);

  q = new QueryBuilder<{
    Collections: {
      users: {
        name: string;
      };
    };
  }>();

  expect(
    q.CreateIndex({
      name: 'new-index',
      source: q.Collection('users'),
      unique: true,
      serialized: true,
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create_index": Object {
          "object": Object {
            "name": "new-index",
            "serialized": true,
            "source": Object {
              "collection": "users",
            },
            "unique": true,
          },
        },
      }
    `);

  expect(
    q.CreateIndex({
      name: 'users_by_name',
      source: {
        collection: q.Collection('users'),
        fields: {
          name: q.Query(
            q.Lambda('doc', q.Select(['data', 'name'], q.Var('doc')))
          ),
        },
      },
      terms: [{ binding: 'name' }],
      values: [
        { binding: 'name' },
        { field: ['data', 'name'] },
        { field: ['ref'] },
      ],
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create_index": Object {
          "object": Object {
            "name": "users_by_name",
            "source": Object {
              "object": Object {
                "collection": Object {
                  "collection": "users",
                },
                "fields": Object {
                  "object": Object {
                    "name": Object {
                      "query": Object {
                        "expr": Object {
                          "from": Object {
                            "var": "doc",
                          },
                          "select": Array [
                            "data",
                            "name",
                          ],
                        },
                        "lambda": "doc",
                      },
                    },
                  },
                },
              },
            },
            "terms": Array [
              Object {
                "object": Object {
                  "binding": "name",
                },
              },
            ],
            "values": Array [
              Object {
                "object": Object {
                  "binding": "name",
                },
              },
              Object {
                "object": Object {
                  "field": Array [
                    "data",
                    "name",
                  ],
                },
              },
              Object {
                "object": Object {
                  "field": Array [
                    "ref",
                  ],
                },
              },
            ],
          },
        },
      }
    `);
});

test('CreateKey', () => {
  const q = new QueryBuilder();

  expect(
    q.CreateKey({
      database: q.Database('prydain'),
      role: 'server',
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create_key": Object {
          "object": Object {
            "database": Object {
              "database": "prydain",
            },
            "role": "server",
          },
        },
      }
    `);
});

test('CreateRole', () => {
  const q = new QueryBuilder<{
    Collections: { spells: {} };
    Roles: ['new-role'];
  }>();

  expect(
    q.CreateRole({
      name: 'new-role',
      privileges: [
        {
          resource: q.Collection('spells'),
          actions: { read: true },
        },
      ],
    })
  ).toMatchInlineSnapshot(`
      Object {
        "create_role": Object {
          "object": Object {
            "name": "new-role",
            "privileges": Array [
              Object {
                "object": Object {
                  "actions": Object {
                    "object": Object {
                      "read": true,
                    },
                  },
                  "resource": Object {
                    "collection": "spells",
                  },
                },
              },
            ],
          },
        },
      }
    `);
});

test('Credentials', () => {
  const q = new QueryBuilder();

  expect(q.Credentials()).toMatchInlineSnapshot(`
      Object {
        "credentials": null,
      }
    `);

  expect(q.Credentials(q.Database('db1'))).toMatchInlineSnapshot(`
      Object {
        "credentials": Object {
          "database": "db1",
        },
      }
    `);
});

test('CurrentIdentity', () => {
  expect(new QueryBuilder().CurrentIdentity()).toMatchInlineSnapshot(`
      Object {
        "current_identity": null,
      }
    `);
});

test('CurrentToken', () => {
  expect(new QueryBuilder().CurrentToken()).toMatchInlineSnapshot(`
      Object {
        "current_token": null,
      }
    `);
});

test('Database', () => {
  const q = new QueryBuilder<{
    Databases: ['child1', 'child2', 'child3'];
    Collections: {};
    Functions: {};
  }>();

  expect(q.Database('child1')).toMatchInlineSnapshot(`
      Object {
        "database": "child1",
      }
    `);

  expect(q.Database('child2', q.Database('child2'))).toMatchInlineSnapshot(`
      Object {
        "database": "child2",
        "scope": Object {
          "database": "child2",
        },
      }
    `);

  expect(q.Database('child2', q.Database('child2', q.Database('child3'))))
    .toMatchInlineSnapshot(`
      Object {
        "database": "child2",
        "scope": Object {
          "database": "child2",
          "scope": Object {
            "database": "child3",
          },
        },
      }
    `);
});

test('Databases', () => {
  const q = new QueryBuilder();

  expect(q.Databases()).toMatchInlineSnapshot(`
      Object {
        "databases": null,
      }
    `);

  expect(q.Databases(q.Database('db1'))).toMatchInlineSnapshot(`
      Object {
        "databases": Object {
          "database": "db1",
        },
      }
    `);
});

test('Date', () => {
  expect(new QueryBuilder().Date('1970-01-01')).toMatchInlineSnapshot(`
      Object {
        "date": "1970-01-01",
      }
    `);
});

test('DayOfMonth', () => {
  const q = new QueryBuilder();

  expect(q.DayOfMonth(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "day_of_month": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
});

test('DayOfWeek', () => {
  const q = new QueryBuilder();

  expect(q.DayOfWeek(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "day_of_week": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
});

test('DayOfYear', () => {
  const q = new QueryBuilder();

  expect(q.DayOfYear(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "day_of_year": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
});

test('Degrees', () => {
  const q = new QueryBuilder();

  expect(q.Degrees(0.5)).toMatchInlineSnapshot(`
      Object {
        "degrees": 0.5,
      }
    `);
});

test('Delete', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Delete(q.Ref(q.Collection('spells'), '181388642581742080')))
    .toMatchInlineSnapshot(`
      Object {
        "delete": Object {
          "id": "181388642581742080",
          "ref": Object {
            "collection": "spells",
          },
        },
      }
    `);
});

test('Difference', () => {
  const q = new QueryBuilder();

  expect(q.Difference(['A', 'B', 'C'], ['B', 'C', 'D'])).toMatchInlineSnapshot(`
      Object {
        "difference": Array [
          Array [
            "A",
            "B",
            "C",
          ],
          Array [
            "B",
            "C",
            "D",
          ],
        ],
      }
    `);
});

test('Distinct', () => {
  const q = new QueryBuilder();

  expect(q.Distinct(['A', 'B', 'C'])).toMatchInlineSnapshot(`
      Object {
        "distinct": Array [
          "A",
          "B",
          "C",
        ],
      }
    `);
});

test('Divide', () => {
  const q = new QueryBuilder();

  expect(q.Divide(10, 5, 2)).toMatchInlineSnapshot(`
      Object {
        "divide": Array [
          10,
          5,
          2,
        ],
      }
    `);

  expect(q.Divide(q.Divide(10, 5), 2)).toMatchInlineSnapshot(`
      Object {
        "divide": Array [
          Object {
            "divide": Array [
              10,
              5,
            ],
          },
          2,
        ],
      }
    `);
});

test('Do', () => {
  const q = new QueryBuilder<{
    Collections: { magical_creatures: { name: string } };
  }>();

  expect(
    q.Do(
      q.Create(q.Ref(q.Collection('magical_creatures'), '2'), {
        data: { name: 'Orwen' },
      }),
      q.Select('ref', q.Ref(q.Collection('magical_creatures'), '2'))
    )
  ).toMatchInlineSnapshot(`
      Object {
        "do": Array [
          Object {
            "create": Object {
              "id": "2",
              "ref": Object {
                "collection": "magical_creatures",
              },
            },
            "params": Object {
              "object": Object {
                "data": Object {
                  "object": Object {
                    "name": "Orwen",
                  },
                },
              },
            },
          },
          Object {
            "from": Object {
              "id": "2",
              "ref": Object {
                "collection": "magical_creatures",
              },
            },
            "select": "ref",
          },
        ],
      }
    `);
});

test('Documents', () => {
  const q = new QueryBuilder<{
    Collections: {
      Letters: {};
    };
  }>();

  expect(q.Documents(q.Collection('Letters'))).toMatchInlineSnapshot(`
      Object {
        "documents": Object {
          "collection": "Letters",
        },
      }
    `);
});

test('Drop', () => {
  const q = new QueryBuilder();

  expect(q.Drop(2, [1, 2, 3])).toMatchInlineSnapshot(`
      Object {
        "collection": Array [
          1,
          2,
          3,
        ],
        "drop": 2,
      }
    `);

  expect(q.Drop(q.Var('numberToDrop'), [1, 2, q.Var('something')]))
    .toMatchInlineSnapshot(`
      Object {
        "collection": Array [
          1,
          2,
          Object {
            "var": "something",
          },
        ],
        "drop": Object {
          "var": "numberToDrop",
        },
      }
    `);
});

test('EndsWith', () => {
  const q = new QueryBuilder();

  expect(q.EndsWith('123', '3')).toMatchInlineSnapshot(`
      Object {
        "endswith": "123",
        "search": "3",
      }
    `);
});

test('Epoch', () => {
  const q = new QueryBuilder();

  expect(q.Epoch(0, 'day')).toMatchInlineSnapshot(`
      Object {
        "epoch": 0,
        "unit": "day",
      }
    `);
});

test('Equals', () => {
  const q = new QueryBuilder();

  expect(q.Equals(1, 1)).toMatchInlineSnapshot(`
      Object {
        "equals": Array [
          1,
          1,
        ],
      }
    `);

  expect(q.Equals({ a: true }, { a: true })).toMatchInlineSnapshot(`
      Object {
        "equals": Array [
          Object {
            "object": Object {
              "a": true,
            },
          },
          Object {
            "object": Object {
              "a": true,
            },
          },
        ],
      }
    `);
});

test('Events', () => {
  const q = new QueryBuilder<{ Collections: { posts: {} } }>();

  expect(q.Events(q.Ref(q.Collection('posts'), '233555580689580553')))
    .toMatchInlineSnapshot(`
      Object {
        "events": Object {
          "id": "233555580689580553",
          "ref": Object {
            "collection": "posts",
          },
        },
      }
    `);
});

test('Exists', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Exists(q.Ref(q.Collection('spells'), '181388642046968320')))
    .toMatchInlineSnapshot(`
      Object {
        "exists": Object {
          "id": "181388642046968320",
          "ref": Object {
            "collection": "spells",
          },
        },
      }
    `);

  expect(q.Exists(q.Ref(q.Collection('spells'), '181388642046968320'), 99))
    .toMatchInlineSnapshot(`
      Object {
        "exists": Object {
          "id": "181388642046968320",
          "ref": Object {
            "collection": "spells",
          },
        },
        "ts": 99,
      }
    `);
});

test('Exp', () => {
  const q = new QueryBuilder<{ Collections: { posts: {} } }>();

  expect(q.Exp(1.5)).toMatchInlineSnapshot(`
      Object {
        "exp": 1.5,
      }
    `);
});

test('Filter', () => {
  const q = new QueryBuilder<{ Collections: { posts: {} } }>();

  expect(q.Filter([1, 2, 3], q.Lambda('i', q.Equals(0, q.Var('i')))))
    .toMatchInlineSnapshot(`
      Object {
        "collection": Array [
          1,
          2,
          3,
        ],
        "filter": Object {
          "expr": Object {
            "equals": Array [
              0,
              Object {
                "var": "i",
              },
            ],
          },
          "lambda": "i",
        },
      }
    `);
});

test('FindStr', () => {
  const q = new QueryBuilder();

  expect(q.FindStr('asdsad', 'fgfwear')).toMatchInlineSnapshot(`
      Object {
        "find": "fgfwear",
        "findstr": "asdsad",
      }
    `);

  expect(q.FindStr('asdsad', 'fgfwear', 8)).toMatchInlineSnapshot(`
      Object {
        "find": "fgfwear",
        "findstr": "asdsad",
        "start": 8,
      }
    `);
});

test('FindStrRegex', () => {
  const q = new QueryBuilder();

  expect(q.FindStrRegex('asdsad', 'fgfwear')).toMatchInlineSnapshot(`
      Object {
        "find": "fgfwear",
        "findstrregex": "asdsad",
      }
    `);

  expect(q.FindStrRegex('asdsad', 'fgfwear', 8)).toMatchInlineSnapshot(`
      Object {
        "find": "fgfwear",
        "findstrregex": "asdsad",
        "start": 8,
      }
    `);

  expect(q.FindStrRegex('asdsad', 'fgfwear', 8, 12)).toMatchInlineSnapshot(`
      Object {
        "find": "fgfwear",
        "findstrregex": "asdsad",
        "num_results": 12,
        "start": 8,
      }
    `);
});

test('Floor', () => {
  const q = new QueryBuilder();

  expect(q.Floor(1.0)).toMatchInlineSnapshot(`
      Object {
        "floor": 1,
      }
    `);
});

test('Foreach', () => {
  const q = new QueryBuilder();

  expect(q.Foreach([1, 2, 3], q.Lambda('i', q.Var('i'))))
    .toMatchInlineSnapshot(`
      Object {
        "collection": Array [
          1,
          2,
          3,
        ],
        "foreach": Object {
          "expr": Object {
            "var": "i",
          },
          "lambda": "i",
        },
      }
    `);
});

test('Floor', () => {
  const q = new QueryBuilder();

  expect(q.Floor(1.0)).toMatchInlineSnapshot(`
      Object {
        "floor": 1,
      }
    `);
});

test('Foreach', () => {
  const q = new QueryBuilder<{ Collections: { spellbooks: {} } }>();

  expect(
    q.Foreach(
      q.Paginate(q.Match(q.Index('spells_by_element'), 'fire')),
      q.Lambda(
        'spell',
        q.Update(q.Var('spell'), {
          data: {
            spellbook: q.Ref(q.Collection('spellbooks'), '181388642139243008'),
          },
        })
      )
    )
  ).toMatchInlineSnapshot(`
      Object {
        "collection": Object {
          "paginate": Object {
            "match": Object {
              "index": "spells_by_element",
            },
            "terms": "fire",
          },
        },
        "foreach": Object {
          "expr": Object {
            "params": Object {
              "object": Object {
                "data": Object {
                  "object": Object {
                    "spellbook": Object {
                      "id": "181388642139243008",
                      "ref": Object {
                        "collection": "spellbooks",
                      },
                    },
                  },
                },
              },
            },
            "update": Object {
              "var": "spell",
            },
          },
          "lambda": "spell",
        },
      }
    `);
});

test('Format', () => {
  const q = new QueryBuilder();

  expect(q.Format('%nDecimals:')).toMatchInlineSnapshot(`
      Object {
        "format": "%nDecimals:",
        "values": Array [],
      }
    `);

  expect(q.Format('%nDecimals:', { a: true })).toMatchInlineSnapshot(`
      Object {
        "format": "%nDecimals:",
        "values": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);

  expect(q.Format('%nDecimals:', { a: true }, { b: true }))
    .toMatchInlineSnapshot(`
      Object {
        "format": "%nDecimals:",
        "values": Array [
          Object {
            "object": Object {
              "a": true,
            },
          },
          Object {
            "object": Object {
              "b": true,
            },
          },
        ],
      }
    `);
});

test('Function', () => {
  const q = new QueryBuilder<{
    Databases: ['child1', 'child2'];
    Collections: {};
    Functions: {
      add: [number, number];
    };
  }>();

  expect(q.Function('add')).toMatchInlineSnapshot(`
      Object {
        "function": "add",
      }
    `);

  expect(q.Function('add', q.Database('child1'))).toMatchInlineSnapshot(`
      Object {
        "function": "add",
        "scope": Object {
          "database": "child1",
        },
      }
    `);

  expect(q.Function('add', q.Database('child1', q.Database('child2'))))
    .toMatchInlineSnapshot(`
      Object {
        "function": "add",
        "scope": Object {
          "database": "child1",
          "scope": Object {
            "database": "child2",
          },
        },
      }
    `);
});

test('Functions', () => {
  const q = new QueryBuilder();

  expect(q.Functions()).toMatchInlineSnapshot(`
      Object {
        "functions": null,
      }
    `);

  expect(q.Functions(q.Database('db1'))).toMatchInlineSnapshot(`
      Object {
        "functions": Object {
          "database": "db1",
        },
      }
    `);
});

test('GT', () => {
  const q = new QueryBuilder();

  expect(q.GT(1)).toMatchInlineSnapshot(`
      Object {
        "gt": 1,
      }
    `);

  expect(q.GT(3, 2, 1)).toMatchInlineSnapshot(`
      Object {
        "gt": Array [
          3,
          2,
          1,
        ],
      }
    `);
});

test('GTE', () => {
  const q = new QueryBuilder();

  expect(q.GTE(1)).toMatchInlineSnapshot(`
      Object {
        "gte": 1,
      }
    `);
  expect(q.GTE(3, 2, 1)).toMatchInlineSnapshot(`
      Object {
        "gte": Array [
          3,
          2,
          1,
        ],
      }
    `);
});

test('Get', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Get(q.Ref(q.Collection('spells'), '181388642046968320')))
    .toMatchInlineSnapshot(`
      Object {
        "get": Object {
          "id": "181388642046968320",
          "ref": Object {
            "collection": "spells",
          },
        },
      }
    `);
});

test('HasCurrentIdentity', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.HasCurrentIdentity()).toMatchInlineSnapshot(`
      Object {
        "has_current_identity": null,
      }
    `);
});

test('HasCurrentToken', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.HasCurrentToken()).toMatchInlineSnapshot(`
      Object {
        "has_current_token": null,
      }
    `);
});

test('Hour', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Hour(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "hour": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
});

test('Hypot', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Hypot(3.0)).toMatchInlineSnapshot(`
      Object {
        "hypot": 3,
      }
    `);
  expect(q.Hypot(3.5, 5.5)).toMatchInlineSnapshot(`
      Object {
        "b": 5.5,
        "hypot": 3.5,
      }
    `);
});

test('Identify', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(
    q.Identify(
      q.Ref(q.Collection('spells'), '181388642114077184'),
      'abracadabra'
    )
  ).toMatchInlineSnapshot(`
      Object {
        "identify": Object {
          "id": "181388642114077184",
          "ref": Object {
            "collection": "spells",
          },
        },
        "password": "abracadabra",
      }
    `);
});

test('If', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.If(true, 'was true', 'was false')).toMatchInlineSnapshot(`
      Object {
        "else": "was false",
        "if": true,
        "then": "was true",
      }
    `);
});

test('Index', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Index('spells_by_element')).toMatchInlineSnapshot(`
      Object {
        "index": "spells_by_element",
      }
    `);
  expect(q.Index('spells_by_element', q.Database('child_db')))
    .toMatchInlineSnapshot(`
      Object {
        "index": "spells_by_element",
        "scope": Object {
          "database": "child_db",
        },
      }
    `);
});

test('Indexes', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Paginate(q.Indexes())).toMatchInlineSnapshot(`
      Object {
        "paginate": Object {
          "indexes": null,
        },
      }
    `);
});

test('Insert', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(
    q.Insert(q.Ref(q.Collection('spells'), '181388642581742080'), 1, 'create', {
      data: {
        name: "Mountain's Thunder",
        cost: 10,
        element: ['air', 'earth'],
      },
    })
  ).toMatchInlineSnapshot(`
      Object {
        "action": "create",
        "insert": Object {
          "id": "181388642581742080",
          "ref": Object {
            "collection": "spells",
          },
        },
        "params": Object {
          "object": Object {
            "data": Object {
              "object": Object {
                "cost": 10,
                "element": Array [
                  "air",
                  "earth",
                ],
                "name": "Mountain's Thunder",
              },
            },
          },
        },
        "ts": 1,
      }
    `);
});

test('Intersection', () => {
  const q = new QueryBuilder();

  expect(q.Intersection(['A', 'B'], ['C', 'D'])).toMatchInlineSnapshot(`
      Object {
        "intersection": Array [
          Array [
            "A",
            "B",
          ],
          Array [
            "C",
            "D",
          ],
        ],
      }
    `);

  expect(q.Intersection(['A', 'B'], ['C', 'D', { a: true }]))
    .toMatchInlineSnapshot(`
      Object {
        "intersection": Array [
          Array [
            "A",
            "B",
          ],
          Array [
            "C",
            "D",
            Object {
              "object": Object {
                "a": true,
              },
            },
          ],
        ],
      }
    `);
});

test('IsArray', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsArray(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_array": Array [
          "array",
        ],
      }
    `);
  expect(q.IsArray({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_array": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsBoolean', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsBoolean(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_boolean": Array [
          "array",
        ],
      }
    `);
  expect(q.IsBoolean({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_boolean": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsBytes', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsBytes(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_bytes": Array [
          "array",
        ],
      }
    `);
  expect(q.IsBytes({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_bytes": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsCollection', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsCollection(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_collection": Array [
          "array",
        ],
      }
    `);
  expect(q.IsCollection({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_collection": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsCredentials', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsCredentials(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_credentials": Array [
          "array",
        ],
      }
    `);
  expect(q.IsCredentials({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_credentials": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsDatabase', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsDatabase(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_database": Array [
          "array",
        ],
      }
    `);
  expect(q.IsDatabase({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_database": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsDate', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsDate(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_date": Array [
          "array",
        ],
      }
    `);
  expect(q.IsDate({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_date": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsDoc', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsDoc(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_doc": Array [
          "array",
        ],
      }
    `);
  expect(q.IsDoc({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_doc": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsDouble', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsDouble(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_double": Array [
          "array",
        ],
      }
    `);
  expect(q.IsDouble({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_double": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsEmpty', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsEmpty(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_empty": Array [
          "array",
        ],
      }
    `);
});

test('IsFunction', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsFunction(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_function": Array [
          "array",
        ],
      }
    `);
  expect(q.IsFunction({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_function": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsIndex', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsIndex(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_index": Array [
          "array",
        ],
      }
    `);
  expect(q.IsIndex({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_index": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsInteger', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsInteger(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_integer": Array [
          "array",
        ],
      }
    `);
  expect(q.IsInteger({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_integer": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsKey', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsKey(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_key": Array [
          "array",
        ],
      }
    `);
  expect(q.IsKey({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_key": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsLambda', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsLambda(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_lambda": Array [
          "array",
        ],
      }
    `);
  expect(q.IsLambda({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_lambda": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsNonEmpty', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsNonEmpty(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_nonempty": Array [
          "array",
        ],
      }
    `);
});

test('IsNull', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsNull(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_null": Array [
          "array",
        ],
      }
    `);
  expect(q.IsNull({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_null": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsNumber', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsNumber(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_number": Array [
          "array",
        ],
      }
    `);
  expect(q.IsNumber({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_number": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsObject', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsObject(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_object": Array [
          "array",
        ],
      }
    `);
  expect(q.IsObject({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_object": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsRef', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsRef(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_ref": Array [
          "array",
        ],
      }
    `);
  expect(q.IsRef({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_ref": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsRole', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsRole(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_role": Array [
          "array",
        ],
      }
    `);
  expect(q.IsRole({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_role": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsSet', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsSet(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_set": Array [
          "array",
        ],
      }
    `);
  expect(q.IsSet({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_set": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsString', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsString(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_string": Array [
          "array",
        ],
      }
    `);
  expect(q.IsString({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_string": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsTimestamp', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsTimestamp(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_timestamp": Array [
          "array",
        ],
      }
    `);
  expect(q.IsTimestamp({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_timestamp": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('IsToken', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.IsToken(['array'])).toMatchInlineSnapshot(`
      Object {
        "is_token": Array [
          "array",
        ],
      }
    `);
  expect(q.IsToken({ a: true })).toMatchInlineSnapshot(`
      Object {
        "is_token": Object {
          "object": Object {
            "a": true,
          },
        },
      }
    `);
});

test('Join', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(
    q.Join(
      q.Match(
        q.Index('products_by_store'),
        q.Ref(q.Collection('spells'), '301')
      ),
      q.Lambda(
        ['name', 'description', 'price'],
        q.Match(q.Index('inventory_by_product'), q.Var('name'))
      )
    )
  ).toMatchInlineSnapshot(`
      Object {
        "join": Object {
          "match": Object {
            "index": "products_by_store",
          },
          "terms": Object {
            "id": "301",
            "ref": Object {
              "collection": "spells",
            },
          },
        },
        "with": Object {
          "expr": Object {
            "match": Object {
              "index": "inventory_by_product",
            },
            "terms": Object {
              "var": "name",
            },
          },
          "lambda": Array [
            "name",
            "description",
            "price",
          ],
        },
      }
    `);
});

test('KeyFromSecret', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.KeyFromSecret('123')).toMatchInlineSnapshot(`
      Object {
        "key_from_secret": "123",
      }
    `);
});

test('Keys', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Keys()).toMatchInlineSnapshot(`
      Object {
        "keys": null,
      }
    `);

  expect(q.Keys(q.Database('child_db'))).toMatchInlineSnapshot(`
      Object {
        "keys": Object {
          "database": "child_db",
        },
      }
    `);
});

test('LT', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.LT(1, 3)).toMatchInlineSnapshot(`
      Object {
        "lt": Array [
          1,
          3,
        ],
      }
    `);
  expect(q.LT(3)).toMatchInlineSnapshot(`
      Object {
        "lt": 3,
      }
    `);
});

test('LTE', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.LTE(1, 3)).toMatchInlineSnapshot(`
      Object {
        "lte": Array [
          1,
          3,
        ],
      }
    `);
  expect(q.LTE(1)).toMatchInlineSnapshot(`
      Object {
        "lte": 1,
      }
    `);
});

test('LTrim', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.LTrim(' Fire')).toMatchInlineSnapshot(`
      Object {
        "ltrim": " Fire",
      }
    `);
});

test('Lambda', () => {
  const q = new QueryBuilder();

  expect(q.Query(q.Lambda('a', 5))).toMatchInlineSnapshot(`
      Object {
        "query": Object {
          "expr": 5,
          "lambda": "a",
        },
      }
    `);

  expect(q.Lambda('name', q.Concat([q.Var('name'), 'Wen'])))
    .toMatchInlineSnapshot(`
      Object {
        "expr": Object {
          "concat": Array [
            Object {
              "var": "name",
            },
            "Wen",
          ],
        },
        "lambda": "name",
      }
    `);

  expect(q.Lambda(['f', 'l'], q.Concat([q.Var('f'), q.Var('l')], ' ')))
    .toMatchInlineSnapshot(`
      Object {
        "expr": Object {
          "concat": Array [
            Object {
              "var": "f",
            },
            Object {
              "var": "l",
            },
          ],
          "separator": " ",
        },
        "lambda": Array [
          "f",
          "l",
        ],
      }
    `);
});

test('Length', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Length('fire')).toMatchInlineSnapshot(`
      Object {
        "length": "fire",
      }
    `);
});

test('Let & Var', () => {
  const q = new QueryBuilder<SchemaTypes>();

  expect(
    q.Let(
      {
        testVar: '2',
        testVar2: '3',
        testVar3: ['4', '5'],
        testVar4: {
          a: 3,
          b: 5,
        },
      },

      null
    )
  ).toMatchInlineSnapshot(`
      Object {
        "in": null,
        "let": Array [
          Object {
            "testVar": "2",
          },
          Object {
            "testVar2": "3",
          },
          Object {
            "testVar3": Array [
              "4",
              "5",
            ],
          },
          Object {
            "testVar4": Object {
              "object": Object {
                "a": 3,
                "b": 5,
              },
            },
          },
        ],
      }
    `);

  expect(
    q.Let(
      {
        testVar: '2',
        testVar2: '3',
        testVar3: ['4', '5'],
        testVar4: {
          a: 3,
          b: 5,
        },
      },

      {
        testValue: q.Var('testVar'),
        testValue2: q.Var('testVar2'),
        testValue3: {
          v: q.Var('testVar3'),
        },
      }
    )
  ).toMatchInlineSnapshot(`
      Object {
        "in": Object {
          "object": Object {
            "testValue": Object {
              "var": "testVar",
            },
            "testValue2": Object {
              "var": "testVar2",
            },
            "testValue3": Object {
              "object": Object {
                "v": Object {
                  "var": "testVar3",
                },
              },
            },
          },
        },
        "let": Array [
          Object {
            "testVar": "2",
          },
          Object {
            "testVar2": "3",
          },
          Object {
            "testVar3": Array [
              "4",
              "5",
            ],
          },
          Object {
            "testVar4": Object {
              "object": Object {
                "a": 3,
                "b": 5,
              },
            },
          },
        ],
      }
    `);

  expect(
    q.Let(
      {
        testVar: '2',
        testVar2: '3',
        testVar3: ['4', '5'],
        testVar4: {
          a: 3,
          b: 5,
          c: {
            f: 6,
          },
        },
      },

      {
        testValue: q.Var('testVar'),
        testValue2: q.Var('testVar2'),
        testValue3: {
          v: q.Var('testVar3'),
        },
      }
    )
  ).toMatchInlineSnapshot(`
      Object {
        "in": Object {
          "object": Object {
            "testValue": Object {
              "var": "testVar",
            },
            "testValue2": Object {
              "var": "testVar2",
            },
            "testValue3": Object {
              "object": Object {
                "v": Object {
                  "var": "testVar3",
                },
              },
            },
          },
        },
        "let": Array [
          Object {
            "testVar": "2",
          },
          Object {
            "testVar2": "3",
          },
          Object {
            "testVar3": Array [
              "4",
              "5",
            ],
          },
          Object {
            "testVar4": Object {
              "object": Object {
                "a": 3,
                "b": 5,
                "c": Object {
                  "object": Object {
                    "f": 6,
                  },
                },
              },
            },
          },
        ],
      }
    `);
});

test('Ln', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Ln(0.5)).toMatchInlineSnapshot(`
      Object {
        "ln": 0.5,
      }
    `);
});

test('Log', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Log(0.5)).toMatchInlineSnapshot(`
      Object {
        "log": 0.5,
      }
    `);
});

test('Login', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(
    q.Login(q.Ref(q.Collection('spells'), '181388642114077184'), {
      password: 'abracadabra',
    })
  ).toMatchInlineSnapshot(`
      Object {
        "login": Object {
          "id": "181388642114077184",
          "ref": Object {
            "collection": "spells",
          },
        },
        "params": Object {
          "object": Object {
            "password": "abracadabra",
          },
        },
      }
    `);
});

test('Logout', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Logout(true)).toMatchInlineSnapshot(`
      Object {
        "logout": true,
      }
    `);
});

test('LowerCase', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.LowerCase('FiRe')).toMatchInlineSnapshot(`
      Object {
        "lowercase": "FiRe",
      }
    `);
});

test('Map', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Map([1, 2, 3], q.Lambda('x', q.Add(q.Var('x'), 1))))
    .toMatchInlineSnapshot(`
      Object {
        "collection": Array [
          1,
          2,
          3,
        ],
        "map": Object {
          "expr": Object {
            "add": Array [
              Object {
                "var": "x",
              },
              1,
            ],
          },
          "lambda": "x",
        },
      }
    `);
});

test('Match', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Match(q.Index('spells_by_element'), 'fire')).toMatchInlineSnapshot(`
      Object {
        "match": Object {
          "index": "spells_by_element",
        },
        "terms": "fire",
      }
    `);
});

test('Max', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Max(1, 5, 22)).toMatchInlineSnapshot(`
      Object {
        "max": Array [
          1,
          5,
          22,
        ],
      }
    `);
});

test('Mean', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Mean([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toMatchInlineSnapshot(`
      Object {
        "mean": Array [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
        ],
      }
    `);
});

test('Merge', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Merge({ a: 'Apple', b: 'Banana' }, { x: 'width', y: 'height' }))
    .toMatchInlineSnapshot(`
      Object {
        "merge": Object {
          "object": Object {
            "a": "Apple",
            "b": "Banana",
          },
        },
        "with": Object {
          "object": Object {
            "x": "width",
            "y": "height",
          },
        },
      }
    `);
});

test('Min', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Min(1, 0, 3, -1)).toMatchInlineSnapshot(`
      Object {
        "min": Array [
          1,
          0,
          3,
          -1,
        ],
      }
    `);
});

test('Minute', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Minute(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "minute": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
});

test('Modulo', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Modulo(10, 5, 2)).toMatchInlineSnapshot(`
      Object {
        "modulo": Array [
          10,
          5,
          2,
        ],
      }
    `);
});

test('Month', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Month(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "month": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
});

test('MoveDatabase', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.MoveDatabase(q.Database('a'), q.Database('b')))
    .toMatchInlineSnapshot(`
      Object {
        "move_database": Object {
          "database": "a",
        },
        "to": Object {
          "database": "b",
        },
      }
    `);
});

test('Multiply', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Multiply(100, 10)).toMatchInlineSnapshot(`
      Object {
        "multiply": Array [
          100,
          10,
        ],
      }
    `);
});

test('NewId', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.NewId()).toMatchInlineSnapshot(`
      Object {
        "new_id": null,
      }
    `);
});

test('Not', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Not(true)).toMatchInlineSnapshot(`
      Object {
        "not": true,
      }
    `);
});

test('Now', () => {
  expect(new QueryBuilder().Now()).toMatchInlineSnapshot(`
      Object {
        "now": null,
      }
    `);
});

test('Or', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Or(true, true, false)).toMatchInlineSnapshot(`
      Object {
        "or": Array [
          true,
          true,
          false,
        ],
      }
    `);
});

test('Paginate', () => {
  const q = new QueryBuilder<{ Collections: { Letters: {} } }>();

  expect(
    q.Paginate(
      q.Documents(q.Collection(q.Var('collection'))),
      q.Var('paginate_options')
    )
  ).toMatchInlineSnapshot(`
      Object {
        "paginate": Object {
          "documents": Object {
            "collection": Object {
              "var": "collection",
            },
          },
        },
        "raw": Object {
          "object": Object {
            "var": "paginate_options",
          },
        },
      }
    `);

  expect(q.Paginate(q.Documents(q.Collection('Letters')), { size: 3 }))
    .toMatchInlineSnapshot(`
      Object {
        "paginate": Object {
          "documents": Object {
            "collection": "Letters",
          },
        },
        "size": 3,
      }
    `);

  expect(
    q.Let(
      {
        collection: 'foo',
        paginate_options: { size: 3, events: true },
      },
      q.Paginate(
        q.Documents(q.Collection(q.Var('collection'))),
        q.Select(['hi'], { hi: {} })
      )
    )
  ).toMatchInlineSnapshot(`
      Object {
        "in": Object {
          "paginate": Object {
            "documents": Object {
              "collection": Object {
                "var": "collection",
              },
            },
          },
          "raw": Object {
            "object": Object {
              "from": Object {
                "object": Object {
                  "hi": Object {
                    "object": Object {},
                  },
                },
              },
              "select": Array [
                "hi",
              ],
            },
          },
        },
        "let": Array [
          Object {
            "collection": "foo",
          },
          Object {
            "paginate_options": Object {
              "object": Object {
                "events": true,
                "size": 3,
              },
            },
          },
        ],
      }
    `);
});

test('Pow', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Pow(2, 3)).toMatchInlineSnapshot(`
      Object {
        "exp": 3,
        "pow": 2,
      }
    `);
});

test('Prepend', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Prepend([1, 2, 3], [4, 5, 6])).toMatchInlineSnapshot(`
      Object {
        "collection": Array [
          4,
          5,
          6,
        ],
        "prepend": Array [
          1,
          2,
          3,
        ],
      }
    `);
});

test('QueryBuilder', () => {
  const q = new QueryBuilder();

  expect(q.Query(q.Lambda('X', q.Var('X')))).toMatchInlineSnapshot(`
      Object {
        "query": Object {
          "expr": Object {
            "var": "X",
          },
          "lambda": "X",
        },
      }
    `);

  expect(
    q.Query(
      q.Lambda(['a', 'b'], {
        a: q.Var('a'),
        b: q.Var('b'),
      })
    )
  ).toMatchInlineSnapshot(`
      Object {
        "query": Object {
          "expr": Object {
            "object": Object {
              "a": Object {
                "var": "a",
              },
              "b": Object {
                "var": "b",
              },
            },
          },
          "lambda": Array [
            "a",
            "b",
          ],
        },
      }
    `);
});

test('RTrim', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.RTrim('Fire\n\n\t\t  ')).toMatchInlineSnapshot(`
      Object {
        "rtrim": "Fire

      		  ",
      }
    `);
});

test('Radians', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Radians(2)).toMatchInlineSnapshot(`
      Object {
        "radians": 2,
      }
    `);
});

test('Range', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Range(q.Match(q.Index('letters')), 'F', 'M')).toMatchInlineSnapshot(`
      Object {
        "from": "F",
        "range": Object {
          "match": Object {
            "index": "letters",
          },
          "terms": Array [],
        },
        "to": "M",
      }
    `);
});

test('Reduce', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(
    q.Reduce(
      q.Lambda(['acc', 'value'], q.Add(q.Var('acc'), 1)),
      0,
      [1, 2, 3, 4, 5]
    )
  ).toMatchInlineSnapshot(`
      Object {
        "arrayOrSet": Array [
          1,
          2,
          3,
          4,
          5,
        ],
        "initial": 0,
        "reduce": Object {
          "expr": Object {
            "add": Array [
              Object {
                "var": "acc",
              },
              1,
            ],
          },
          "lambda": Array [
            "acc",
            "value",
          ],
        },
      }
    `);

  expect(
    q.Reduce(
      q.Lambda(
        ['acc', 'value'],
        q.Let(
          {
            count: q.Add(q.Select('count', q.Var('acc')), 1),
            total: q.Add(q.Select('total', q.Var('acc')), q.Var('value')),
            min: q.Select('min', q.Var('acc')),
            max: q.Select('max', q.Var('acc')),
          },
          {
            count: q.Var('count'),
            total: q.Var('total'),
            min: q.If(
              q.LTE(q.Var('value'), q.Var('min')),
              q.Var('value'),
              q.Var('min')
            ),
            max: q.If(
              q.GTE(q.Var('value'), q.Var('max')),
              q.Var('value'),
              q.Var('max')
            ),
            avg: q.Divide(q.Var('total'), q.Var('count')),
          }
        )
      ),
      {
        count: 0,
        total: 0,
        min: 999999,
        max: -999999,
        avg: 0,
      },
      [1, 2, 3, 4, 5]
    )
  ).toMatchInlineSnapshot(`
      Object {
        "arrayOrSet": Array [
          1,
          2,
          3,
          4,
          5,
        ],
        "initial": Object {
          "avg": 0,
          "count": 0,
          "max": -999999,
          "min": 999999,
          "total": 0,
        },
        "reduce": Object {
          "expr": Object {
            "in": Object {
              "object": Object {
                "avg": Object {
                  "divide": Array [
                    Object {
                      "var": "total",
                    },
                    Object {
                      "var": "count",
                    },
                  ],
                },
                "count": Object {
                  "var": "count",
                },
                "max": Object {
                  "else": Object {
                    "var": "max",
                  },
                  "if": Object {
                    "gte": Array [
                      Object {
                        "var": "value",
                      },
                      Object {
                        "var": "max",
                      },
                    ],
                  },
                  "then": Object {
                    "var": "value",
                  },
                },
                "min": Object {
                  "else": Object {
                    "var": "min",
                  },
                  "if": Object {
                    "lte": Array [
                      Object {
                        "var": "value",
                      },
                      Object {
                        "var": "min",
                      },
                    ],
                  },
                  "then": Object {
                    "var": "value",
                  },
                },
                "total": Object {
                  "var": "total",
                },
              },
            },
            "let": Array [
              Object {
                "count": Object {
                  "add": Array [
                    Object {
                      "from": Object {
                        "var": "acc",
                      },
                      "select": "count",
                    },
                    1,
                  ],
                },
              },
              Object {
                "total": Object {
                  "add": Array [
                    Object {
                      "from": Object {
                        "var": "acc",
                      },
                      "select": "total",
                    },
                    Object {
                      "var": "value",
                    },
                  ],
                },
              },
              Object {
                "min": Object {
                  "from": Object {
                    "var": "acc",
                  },
                  "select": "min",
                },
              },
              Object {
                "max": Object {
                  "from": Object {
                    "var": "acc",
                  },
                  "select": "max",
                },
              },
            ],
          },
          "lambda": Array [
            "acc",
            "value",
          ],
        },
      }
    `);
});

test('Ref', () => {
  const q = new QueryBuilder<{ Collections: { spells: string } }>();

  expect(q.Ref(q.Collection('spells'), '181388642046968320'))
    .toMatchInlineSnapshot(`
      Object {
        "id": "181388642046968320",
        "ref": Object {
          "collection": "spells",
        },
      }
    `);
});

test('RegexEscape', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.RegexEscape('.Fa*[un]a{1,}')).toMatchInlineSnapshot(`
      Object {
        "regexescape": ".Fa*[un]a{1,}",
      }
    `);
});

test('Remove', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(
    q.Remove(q.Ref(q.Collection('spells'), '181388642581742080'), 1, 'create')
  ).toMatchInlineSnapshot(`
      Object {
        "action": "create",
        "remove": Object {
          "id": "181388642581742080",
          "ref": Object {
            "collection": "spells",
          },
        },
        "ts": 1,
      }
    `);
});

test('Repeat', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Repeat('Yes')).toMatchInlineSnapshot(`
      Object {
        "repeat": "Yes",
      }
    `);
  expect(q.Repeat('Yes! ', 3)).toMatchInlineSnapshot(`
      Object {
        "number": 3,
        "repeat": "Yes! ",
      }
    `);
});

test('Replace', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(
    q.Replace(q.Ref(q.Collection('spells'), '181388642581742080'), {
      data: {
        name: "Mountain's Thunder",
        element: ['air', 'earth'],
      },
    })
  ).toMatchInlineSnapshot(`
      Object {
        "params": Object {
          "object": Object {
            "data": Object {
              "object": Object {
                "element": Array [
                  "air",
                  "earth",
                ],
                "name": "Mountain's Thunder",
              },
            },
          },
        },
        "replace": Object {
          "id": "181388642581742080",
          "ref": Object {
            "collection": "spells",
          },
        },
      }
    `);
});

test('ReplaceStr', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ReplaceStr('One Fish Two Fish', 'Two', 'Blue'))
    .toMatchInlineSnapshot(`
      Object {
        "find": "Two",
        "replace": "Blue",
        "replacestr": "One Fish Two Fish",
      }
    `);
});

test('ReplaceStrRegex', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ReplaceStrRegex('One Fish Two Fish', 'Two', 'Blue'))
    .toMatchInlineSnapshot(`
      Object {
        "pattern": "Two",
        "replace": "Blue",
        "replacestrregex": "One Fish Two Fish",
      }
    `);
  expect(q.ReplaceStrRegex('One Fish Two Fish', 'Two', 'Blue', true))
    .toMatchInlineSnapshot(`
      Object {
        "first": true,
        "pattern": "Two",
        "replace": "Blue",
        "replacestrregex": "One Fish Two Fish",
      }
    `);
});

test('Reverse', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Reverse(['a', 'b', 'c', 1, 2, 3])).toMatchInlineSnapshot(`
      Object {
        "reverse": Array [
          "a",
          "b",
          "c",
          1,
          2,
          3,
        ],
      }
    `);
});

test('Role', () => {
  const q = new QueryBuilder<{
    Roles: ['moderator'];
    Databases: ['db1'];
  }>();

  expect(q.Role('moderator')).toMatchInlineSnapshot(`
      Object {
        "role": "moderator",
      }
    `);

  expect(q.Role('moderator', q.Database('db1'))).toMatchInlineSnapshot(`
      Object {
        "role": "moderator",
        "scope": Object {
          "database": "db1",
        },
      }
    `);
});

test('Roles', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Roles()).toMatchInlineSnapshot(`
      Object {
        "roles": null,
      }
    `);
  expect(q.Roles(q.Database('child_db'))).toMatchInlineSnapshot(`
      Object {
        "roles": Object {
          "database": "child_db",
        },
      }
    `);
});

test('Round', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Round(1234.5678)).toMatchInlineSnapshot(`
      Object {
        "round": 1234.5678,
      }
    `);
  expect(q.Round(1234.5678, 2)).toMatchInlineSnapshot(`
      Object {
        "precision": 2,
        "round": 1234.5678,
      }
    `);
});

test('Second', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Second(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "second": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
});

test('Select', () => {
  const q = new QueryBuilder();

  expect(q.Select(0, [1, 2])).toMatchInlineSnapshot(`
      Object {
        "from": Array [
          1,
          2,
        ],
        "select": 0,
      }
    `);

  expect(q.Select([0], [1, 2])).toMatchInlineSnapshot(`
      Object {
        "from": Array [
          1,
          2,
        ],
        "select": Array [
          0,
        ],
      }
    `);

  expect(q.Select([1], [1, 2])).toMatchInlineSnapshot(`
      Object {
        "from": Array [
          1,
          2,
        ],
        "select": Array [
          1,
        ],
      }
    `);

  expect(q.Select(['key1'], { key1: 'test' })).toMatchInlineSnapshot(`
      Object {
        "from": Object {
          "object": Object {
            "key1": "test",
          },
        },
        "select": Array [
          "key1",
        ],
      }
    `);

  expect(q.Select(['key2'], { key2: 'test' }, 'test')).toMatchInlineSnapshot(`
      Object {
        "default": "test",
        "from": Object {
          "object": Object {
            "key2": "test",
          },
        },
        "select": Array [
          "key2",
        ],
      }
    `);

  expect(
    q.Select(
      ['var1'],

      q.Let(
        {
          var1: 1,
        },
        {
          var1: q.Var('var1'),
        }
      )
    )
  ).toMatchInlineSnapshot(`
      Object {
        "from": Object {
          "in": Object {
            "object": Object {
              "var1": Object {
                "var": "var1",
              },
            },
          },
          "let": Array [
            Object {
              "var1": 1,
            },
          ],
        },
        "select": Array [
          "var1",
        ],
      }
    `);
});

test('Sign', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Sign(3)).toMatchInlineSnapshot(`
      Object {
        "sign": 3,
      }
    `);
});

test('Sin', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Sin(0.5)).toMatchInlineSnapshot(`
      Object {
        "sin": 0.5,
      }
    `);
});

test('Singleton', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Singleton(q.Ref(q.Collection('spells'), '233286601218720256')))
    .toMatchInlineSnapshot(`
      Object {
        "singleton": Object {
          "id": "233286601218720256",
          "ref": Object {
            "collection": "spells",
          },
        },
      }
    `);
});

test('Sinh', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Sinh(0.5)).toMatchInlineSnapshot(`
      Object {
        "sinh": 0.5,
      }
    `);
});

test('Space', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Space(20)).toMatchInlineSnapshot(`
      Object {
        "space": 20,
      }
    `);
});

test('Sqrt', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Sqrt(16)).toMatchInlineSnapshot(`
      Object {
        "sqrt": 16,
      }
    `);
});

test('StartsWith', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.StartsWith('Fauna', 'F')).toMatchInlineSnapshot(`
      Object {
        "search": "F",
        "startswith": "Fauna",
      }
    `);
});

test('SubString', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.SubString('ABCDEFGHIJK', -4)).toMatchInlineSnapshot(`
      Object {
        "start": -4,
        "substring": "ABCDEFGHIJK",
      }
    `);
  expect(q.SubString('ABCDEFGHIJK', 2, 3)).toMatchInlineSnapshot(`
      Object {
        "length": 3,
        "start": 2,
        "substring": "ABCDEFGHIJK",
      }
    `);
});

test('Subtract', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Subtract(100, 10)).toMatchInlineSnapshot(`
      Object {
        "subtract": Array [
          100,
          10,
        ],
      }
    `);
});

test('Sum', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Sum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toMatchInlineSnapshot(`
      Object {
        "sum": Array [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
        ],
      }
    `);
});

test('Take', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Take(2, [1, 2, 3])).toMatchInlineSnapshot(`
      Object {
        "collection": Array [
          1,
          2,
          3,
        ],
        "take": 2,
      }
    `);
});

test('Tan', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Tan(0.5)).toMatchInlineSnapshot(`
      Object {
        "tan": 0.5,
      }
    `);
});

test('Tanh', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Tanh(0.5)).toMatchInlineSnapshot(`
      Object {
        "tanh": 0.5,
      }
    `);
});

test('Time', () => {
  const q = new QueryBuilder();

  expect(q.Time('1970-01-01T00:00:00+00:00')).toMatchInlineSnapshot(`
      Object {
        "time": "1970-01-01T00:00:00+00:00",
      }
    `);

  expect(q.Time('now')).toMatchInlineSnapshot(`
      Object {
        "time": "now",
      }
    `);
});

test('TimeAdd', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.TimeAdd(q.Epoch(0, 'second'), 1, 'day')).toMatchInlineSnapshot(`
      Object {
        "offset": 1,
        "time_add": Object {
          "epoch": 0,
          "unit": "second",
        },
        "unit": "day",
      }
    `);
});

test('TimeDiff', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(
    q.Let(
      {
        start: q.Time('1970-01-01T00:00:00+00:00'),
        finish: q.Time('2020-07-06T12:34:56.789Z'),
      },
      [
        q.TimeDiff(q.Var('start'), q.Var('finish'), 'days'),
        q.TimeDiff(q.Var('start'), q.Var('finish'), 'half days'),
        q.TimeDiff(q.Var('start'), q.Var('finish'), 'hours'),
        q.TimeDiff(q.Var('start'), q.Var('finish'), 'minutes'),
        q.TimeDiff(q.Var('start'), q.Var('finish'), 'seconds'),
        q.TimeDiff(q.Var('start'), q.Var('finish'), 'milliseconds'),
      ]
    )
  ).toMatchInlineSnapshot(`
      Object {
        "in": Array [
          Object {
            "other": Object {
              "var": "finish",
            },
            "time_diff": Object {
              "var": "start",
            },
            "unit": "days",
          },
          Object {
            "other": Object {
              "var": "finish",
            },
            "time_diff": Object {
              "var": "start",
            },
            "unit": "half days",
          },
          Object {
            "other": Object {
              "var": "finish",
            },
            "time_diff": Object {
              "var": "start",
            },
            "unit": "hours",
          },
          Object {
            "other": Object {
              "var": "finish",
            },
            "time_diff": Object {
              "var": "start",
            },
            "unit": "minutes",
          },
          Object {
            "other": Object {
              "var": "finish",
            },
            "time_diff": Object {
              "var": "start",
            },
            "unit": "seconds",
          },
          Object {
            "other": Object {
              "var": "finish",
            },
            "time_diff": Object {
              "var": "start",
            },
            "unit": "milliseconds",
          },
        ],
        "let": Array [
          Object {
            "start": Object {
              "time": "1970-01-01T00:00:00+00:00",
            },
          },
          Object {
            "finish": Object {
              "time": "2020-07-06T12:34:56.789Z",
            },
          },
        ],
      }
    `);
});

test('TimeSubtract', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.TimeSubtract(q.Now(), 5, 'seconds')).toMatchInlineSnapshot(`
      Object {
        "offset": 5,
        "time_subtract": Object {
          "now": null,
        },
        "unit": "seconds",
      }
    `);
});

test('TitleCase', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.TitleCase('JOHN the FiReMan')).toMatchInlineSnapshot(`
      Object {
        "titlecase": "JOHN the FiReMan",
      }
    `);
});

test('ToArray', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ToArray({ name: 'Dennis', age: 37 })).toMatchInlineSnapshot(`
      Object {
        "to_array": Object {
          "object": Object {
            "age": 37,
            "name": "Dennis",
          },
        },
      }
    `);
});

test('ToDate', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ToDate('2018-06-06')).toMatchInlineSnapshot(`
      Object {
        "to_date": "2018-06-06",
      }
    `);
});

test('ToDouble', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ToDouble(1234.5678)).toMatchInlineSnapshot(`
      Object {
        "to_double": 1234.5678,
      }
    `);
});

test('ToInteger', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ToInteger(1234.5678)).toMatchInlineSnapshot(`
      Object {
        "to_integer": 1234.5678,
      }
    `);
});

test('ToMicros', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ToMicros(q.Epoch(1, 'second'))).toMatchInlineSnapshot(`
      Object {
        "to_micros": Object {
          "epoch": 1,
          "unit": "second",
        },
      }
    `);
});

test('ToMillis', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ToMillis(q.Epoch(1, 'second'))).toMatchInlineSnapshot(`
      Object {
        "to_millis": Object {
          "epoch": 1,
          "unit": "second",
        },
      }
    `);
});

test('ToNumber', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ToNumber(1234.5678)).toMatchInlineSnapshot(`
      Object {
        "to_number": 1234.5678,
      }
    `);
});

test('ToObject', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(
    q.ToObject([
      ['name', 'Dennis'],
      ['age', 37],
    ])
  ).toMatchInlineSnapshot(`
      Object {
        "to_object": Array [
          Array [
            "name",
            "Dennis",
          ],
          Array [
            "age",
            37,
          ],
        ],
      }
    `);
});

test('ToSeconds', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ToSeconds(q.Epoch(1, 'second'))).toMatchInlineSnapshot(`
      Object {
        "to_seconds": Object {
          "epoch": 1,
          "unit": "second",
        },
      }
    `);
});

test('ToString', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ToString(1234.5678)).toMatchInlineSnapshot(`
      Object {
        "to_string": 1234.5678,
      }
    `);
});

test('ToTime', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.ToTime('2020-07-06T12:34:56.789Z')).toMatchInlineSnapshot(`
      Object {
        "to_time": "2020-07-06T12:34:56.789Z",
      }
    `);
});

test('Tokens', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Create(q.Tokens(), { instance: q.Ref(q.Collection('spells'), '1') }))
    .toMatchInlineSnapshot(`
      Object {
        "create": Object {
          "tokens": null,
        },
        "params": Object {
          "object": Object {
            "instance": Object {
              "id": "1",
              "ref": Object {
                "collection": "spells",
              },
            },
          },
        },
      }
    `);
});

test('Trim', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Trim('    Fire    ')).toMatchInlineSnapshot(`
      Object {
        "trim": "    Fire    ",
      }
    `);
});

test('Trunc', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Trunc(1234.5678)).toMatchInlineSnapshot(`
      Object {
        "trunc": 1234.5678,
      }
    `);
  expect(q.Trunc(1234, -2)).toMatchInlineSnapshot(`
      Object {
        "precision": -2,
        "trunc": 1234,
      }
    `);
});

test('Trim', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Trim('    Fire    ')).toMatchInlineSnapshot(`
      Object {
        "trim": "    Fire    ",
      }
    `);
});

test('Union', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect([
    q.Union(['A', 'B'], ['C', 'D']),
    q.Union(['A', 'B'], ['B', 'C']),
    q.Union(['A', 'B', 'C'], ['B', 'C'], ['B', 'C', 'D']),
    q.Union(['A', 'B', 'C'], ['B', 'B'], ['B']),
  ]).toMatchInlineSnapshot(`
      Array [
        Object {
          "union": Array [
            Array [
              "A",
              "B",
            ],
            Array [
              "C",
              "D",
            ],
          ],
        },
        Object {
          "union": Array [
            Array [
              "A",
              "B",
            ],
            Array [
              "B",
              "C",
            ],
          ],
        },
        Object {
          "union": Array [
            Array [
              "A",
              "B",
              "C",
            ],
            Array [
              "B",
              "C",
            ],
            Array [
              "B",
              "C",
              "D",
            ],
          ],
        },
        Object {
          "union": Array [
            Array [
              "A",
              "B",
              "C",
            ],
            Array [
              "B",
              "B",
            ],
            Array [
              "B",
            ],
          ],
        },
      ]
    `);
});

test('Update', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(
    q.Update(q.Ref(q.Collection('spells'), '181388642581742080'), {
      data: {
        name: "Mountain's Thunder",
        cost: null,
      },
    })
  ).toMatchInlineSnapshot(`
      Object {
        "params": Object {
          "object": Object {
            "data": Object {
              "object": Object {
                "cost": null,
                "name": "Mountain's Thunder",
              },
            },
          },
        },
        "update": Object {
          "id": "181388642581742080",
          "ref": Object {
            "collection": "spells",
          },
        },
      }
    `);
});

test('UpperCase', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect([q.UpperCase('FiRe'), q.UpperCase('Fire And FireMan')])
    .toMatchInlineSnapshot(`
      Array [
        Object {
          "uppercase": "FiRe",
        },
        Object {
          "uppercase": "Fire And FireMan",
        },
      ]
    `);
});

test('Year', () => {
  const q = new QueryBuilder<{ Collections: { spells: {} } }>();

  expect(q.Year(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "year": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
});
