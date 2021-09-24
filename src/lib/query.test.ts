import { Query, QuerySchema } from './query';

describe('Functions', () => {
  test('Abort', () => {
    expect(new Query().Abort('Something went wrong')).toMatchInlineSnapshot(`
      Object {
        "abort": "Something went wrong",
      }
    `);
  });

  test('Abs', () => {
    expect(new Query().Abs(-100)).toMatchInlineSnapshot(`
      Object {
        "abs": -100,
      }
    `);
  });

  test('AccessProvider', () => {
    expect(new Query().AccessProvider('Auth0-myapp')).toMatchInlineSnapshot(`
      Object {
        "access_provider": "Auth0-myapp",
      }
    `);
  });

  test('AccessProviders', () => {
    const q = new Query<{
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
    expect(new Query().Acos(0.5)).toMatchInlineSnapshot(`
      Object {
        "acos": 0.5,
      }
    `);
  });

  test('Add', () => {
    expect(new Query().Add(1, 3)).toMatchInlineSnapshot(`
      Object {
        "add": Array [
          1,
          3,
        ],
      }
    `);

    expect(new Query().Add(2)).toMatchInlineSnapshot(`
      Object {
        "add": 2,
      }
    `);
  });

  test('All', () => {
    expect(new Query().All(1, 3)).toMatchInlineSnapshot(`
      Object {
        "all": Array [
          1,
          3,
        ],
      }
    `);

    expect(new Query().All(2)).toMatchInlineSnapshot(`
      Object {
        "all": 2,
      }
    `);
  });

  test('And', () => {
    expect(new Query().And(true, false)).toMatchInlineSnapshot(`
      Object {
        "and": Array [
          true,
          false,
        ],
      }
    `);

    expect(new Query().And(true)).toMatchInlineSnapshot(`
      Object {
        "and": true,
      }
    `);
  });

  test('Any', () => {
    expect(new Query().Any(true, false)).toMatchInlineSnapshot(`
      Object {
        "any": Array [
          true,
          false,
        ],
      }
    `);

    expect(new Query().Any(true)).toMatchInlineSnapshot(`
      Object {
        "any": true,
      }
    `);
  });

  test('Append', () => {
    expect(new Query().Append([1, 2, 3], [2, 2])).toMatchInlineSnapshot(`
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
      new Query().Append([1, 2, 3, { test: true }], [2, 2, { test2: true }])
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
    expect(new Query().Asin(0.5)).toMatchInlineSnapshot(`
      Object {
        "asin": 0.5,
      }
    `);
  });

  test('At', () => {
    const q = new Query();

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
    expect(new Query().Atan(0.5)).toMatchInlineSnapshot(`
      Object {
        "atan": 0.5,
      }
    `);
  });

  test('BitAnd', () => {
    const q = new Query();

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
    const q = new Query();

    expect(q.BitNot(7)).toMatchInlineSnapshot(`
      Object {
        "bitnot": 7,
      }
    `);
  });

  test('BitOr', () => {
    const q = new Query();

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
    const q = new Query();

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
    const q = new Query<{
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
      q.Call(q.Function('add', q.Database('child1', q.Database('child2'))), [
        2,
        3,
      ])
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
    const q = new Query();

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
    expect(new Query().Ceil(7.0)).toMatchInlineSnapshot(`
      Object {
        "ceil": 7,
      }
    `);
  });

  test('Collection', () => {
    const q = new Query<{
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
    const q = new Query<{
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
    const q = new Query();

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
    const q = new Query();

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
    const q = new Query();

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
    expect(new Query().ContainsStr('Fauna', 'a')).toMatchInlineSnapshot(`
      Object {
        "containsstr": "Fauna",
        "search": "a",
      }
    `);
  });

  test('ContainsStrRegex', () => {
    expect(new Query().ContainsStrRegex('Fauna', '(Fa|na)'))
      .toMatchInlineSnapshot(`
      Object {
        "containsstrregex": "Fauna",
        "pattern": "(Fa|na)",
      }
    `);
  });

  test('ContainsValue', () => {
    expect(
      new Query().ContainsValue(3, {
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
    expect(new Query().Cos(0.5)).toMatchInlineSnapshot(`
      Object {
        "cos": 0.5,
      }
    `);
  });

  test('Cosh', () => {
    expect(new Query().Cosh(0.5)).toMatchInlineSnapshot(`
      Object {
        "cosh": 0.5,
      }
    `);
  });

  test('Count', () => {
    expect(new Query().Count([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
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
    const q = new Query<{
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
    const q = new Query<{
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
    const q = new Query<{
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
    const q = new Query<{
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
    let q = new Query<{
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

    q = new Query<{
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
    const q = new Query();

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
    const q = new Query<{ Collections: { spells: {} }; Roles: ['new-role'] }>();

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
    const q = new Query();

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
    expect(new Query().CurrentIdentity()).toMatchInlineSnapshot(`
      Object {
        "current_identity": null,
      }
    `);
  });

  test('CurrentToken', () => {
    expect(new Query().CurrentToken()).toMatchInlineSnapshot(`
      Object {
        "current_token": null,
      }
    `);
  });

  test('Database', () => {
    const q = new Query<{
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
    const q = new Query();

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
    expect(new Query().Date('1970-01-01')).toMatchInlineSnapshot(`
      Object {
        "date": "1970-01-01",
      }
    `);
  });

  test('DayOfMonth', () => {
    const q = new Query();

    expect(q.DayOfMonth(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "day_of_month": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
  });

  test('DayOfWeek', () => {
    const q = new Query();

    expect(q.DayOfWeek(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "day_of_week": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
  });

  test('DayOfYear', () => {
    const q = new Query();

    expect(q.DayOfYear(q.Time('2019-04-29T12:51:17Z'))).toMatchInlineSnapshot(`
      Object {
        "day_of_year": Object {
          "time": "2019-04-29T12:51:17Z",
        },
      }
    `);
  });

  test('Degrees', () => {
    const q = new Query();

    expect(q.Degrees(0.5)).toMatchInlineSnapshot(`
      Object {
        "degrees": 0.5,
      }
    `);
  });

  test('Delete', () => {
    const q = new Query<{ Collections: { spells: {} } }>();

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
    const q = new Query();

    expect(q.Difference(['A', 'B', 'C'], ['B', 'C', 'D']))
      .toMatchInlineSnapshot(`
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
    const q = new Query();

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
    const q = new Query();

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
    const q = new Query<{
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
    const q = new Query<{
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
    const q = new Query();

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
    const q = new Query();

    expect(q.EndsWith('123', '3')).toMatchInlineSnapshot(`
      Object {
        "endswith": "123",
        "search": "3",
      }
    `);
  });

  test('Epoch', () => {
    const q = new Query();

    expect(q.Epoch(0, 'day')).toMatchInlineSnapshot(`
      Object {
        "epoch": 0,
        "unit": "day",
      }
    `);
  });

  test('Equals', () => {
    const q = new Query();

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
    const q = new Query<{ Collections: { posts: {} } }>();

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
    const q = new Query<{ Collections: { spells: {} } }>();

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
    const q = new Query<{ Collections: { posts: {} } }>();

    expect(q.Exp(1.5)).toMatchInlineSnapshot(`
      Object {
        "exp": 1.5,
      }
    `);
  });

  test('Filter', () => {
    const q = new Query<{ Collections: { posts: {} } }>();

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
    const q = new Query();

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
    const q = new Query();

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
    const q = new Query();

    expect(q.Floor(1.0)).toMatchInlineSnapshot(`
      Object {
        "floor": 1,
      }
    `);
  });

  test('Foreach', () => {
    const q = new Query();

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
    const q = new Query();

    expect(q.Floor(1.0)).toMatchInlineSnapshot(`
      Object {
        "floor": 1,
      }
    `);
  });

  test('Format', () => {
    const q = new Query();

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
    const q = new Query<{
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
    const q = new Query();

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

  test('Lambda', () => {
    const q = new Query();

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

  test('Let & Var', () => {
    const q = new Query<
      QuerySchema,
      {
        testVar: string;
        testVar2: string;
        testVar3: string[];
        testVar4: Record<string, unknown>;
      }
    >();

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

  test('Now', () => {
    expect(new Query().Now()).toMatchInlineSnapshot(`
      Object {
        "now": null,
      }
    `);
  });

  test('Query', () => {
    const q = new Query();

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

  test('Ref', () => {
    const q = new Query<{ Collections: { spells: string } }>();

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

  test('Role', () => {
    const q = new Query<{
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

  test('Select', () => {
    const q = new Query();

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

  test('Time', () => {
    const q = new Query();

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
});
