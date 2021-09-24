import { O } from 'ts-toolbelt';
import { Expression, wrap } from './expression';

type QuerySchema = {
  AccessProviders?: string[];
  Collections?: Record<string, unknown>;
  Databases?: string[];
  Functions?: Record<string, unknown>;
  Indexes?: string[];
  Roles?: string[];
};

type QueryVariables = Record<string, unknown>;

type DatabaseWithoutScopeReturnType<TDatabaseName> = {
  database: TDatabaseName;
};

type DatabaseWithScopeReturnType<TDatabaseName> = {
  database: TDatabaseName;
  scope: DatabaseWithoutScopeReturnType<TDatabaseName>;
};

type DatabaseReturnType<TDatabaseName> =
  | DatabaseWithoutScopeReturnType<TDatabaseName>
  | DatabaseWithScopeReturnType<TDatabaseName>;

type FunctionWithoutScopeReturnType<TFunctionName> = {
  function: TFunctionName;
};

type FunctionWithScopeReturnType<TFunctionName, TDatabaseName> = {
  function: TFunctionName;
  scope: DatabaseWithoutScopeReturnType<TDatabaseName>;
};

type FunctionReturnType<TFunctionName, TDatabaseName> =
  | FunctionWithoutScopeReturnType<TFunctionName>
  | FunctionWithScopeReturnType<TFunctionName, TDatabaseName>;

type RoleWithoutScopeReturnType<TRoleName> = {
  role: TRoleName;
};

type RoleWithScopeReturnType<TRoleName, TDatabaseName> = {
  role: TRoleName;
  scope: DatabaseWithoutScopeReturnType<TDatabaseName>;
};

type RoleReturnType<TRoleName, TDatabaseName> =
  | RoleWithoutScopeReturnType<TRoleName>
  | RoleWithScopeReturnType<TRoleName, TDatabaseName>;

type CollectionWithoutScopeReturnType<TCollectionName> = {
  collection: TCollectionName;
};

type CollectionWithScopeReturnType<TCollectionName, TDatabaseName> = {
  collection: TCollectionName;
  database: DatabaseReturnType<TDatabaseName>;
};

type CollectionReturnType<TCollectionName, TDatabaseName> =
  | CollectionWithoutScopeReturnType<TCollectionName>
  | CollectionWithScopeReturnType<TCollectionName, TDatabaseName>;

type LambdaReturnType = {
  lambda: string | string[];
  expr: unknown;
};

type QueryReturnType = {
  query: Expression<LambdaReturnType>;
};

type Timestamp = { time: string } | { now: null };

type Normalizer = 'NFKCCaseFold' | 'NFC' | 'NFD' | 'NFKC' | 'NFKD';

type CreateParams<TData extends unknown> = {
  data: TData;
  credentials?: { password: string } & Record<string, unknown>;
  ttl?: Expression<Timestamp>;
};

type CreateAccessProviderParams<
  TAccessProviderName extends string,
  TRoles extends QuerySchema['Roles'],
  TDatabases extends QuerySchema['Databases']
> = {
  name: TAccessProviderName;
  issuer: string;
  jwks_uri: string;
  roles?:
    | Expression<
        RoleReturnType<
          TRoles extends string[] ? TRoles[number] : string,
          TDatabases extends string[] ? TDatabases[number] : string
        >
      >[]
    | {
        role: Expression<
          RoleReturnType<
            TRoles extends string[] ? TRoles[number] : string,
            TDatabases extends string[] ? TDatabases[number] : string
          >
        >;
        predicate: Expression<QueryReturnType>;
      }[];
  data?: Record<string, unknown>;
};

type CreateCollectionParams<
  TSchema extends QuerySchema,
  TCollectionName extends keyof TSchema['Collections']
> = {
  name: TCollectionName;
  data?: Record<string, unknown>;
  history_days?: number | null;
  ttl_days?: number | null;
};

type CreateDatabaseParams<TDatabaseName extends string> = {
  name: TDatabaseName;
  data?: Record<string, unknown>;
};

type BuiltInRole = 'admin' | 'server' | 'server-readonly' | 'client';

type CreateFunctionParams<
  TFunctionName extends string,
  TRoles extends QuerySchema['Roles'],
  TDatabases extends QuerySchema['Databases']
> = {
  name: TFunctionName;
  body: Expression<QueryReturnType>;
  data?: Record<string, unknown>;
  role?:
    | BuiltInRole
    | Expression<
        RoleReturnType<
          TRoles extends string[] ? TRoles[number] : string,
          TDatabases extends string[] ? TDatabases[number] : string
        >
      >;
};

type SourceObject<
  TCollections extends QuerySchema['Collections'],
  TDatabases extends QuerySchema['Databases']
> = {
  collection: Expression<
    CollectionReturnType<
      TCollections extends string[] ? TCollections[number] : string,
      TDatabases extends string[] ? TDatabases[number] : string
    >
  >;
  fields: Record<string, Expression<QueryReturnType>>;
};

type TermObject = {
  field?: string | string[];
  binding?: string;
};

type ValueObject = {
  field?: string | string[];
  binding?: string;
  reverse?: boolean;
};

type CreateIndexParams<
  TIndexName extends string,
  TCollections extends QuerySchema['Collections'],
  TDatabases extends QuerySchema['Databases']
> = {
  name: TIndexName;
  source:
    | Expression<
        CollectionReturnType<
          TCollections extends string[] ? TCollections[number] : string,
          TDatabases extends string[] ? TDatabases[number] : string
        >
      >
    | SourceObject<TCollections, TDatabases>;
  terms?: TermObject[];
  values?: ValueObject[];
  unique?: boolean;
  serialized?: boolean;
  data?: Record<string, unknown>;
};

class Query<
  TSchema extends QuerySchema = QuerySchema,
  TVariables extends QueryVariables = QueryVariables
> {
  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/abort
   */
  Abort = (message: string) => {
    return new Expression({ abort: message });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/abs
   */
  Abs = (value: number) => {
    return new Expression({ abs: value });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/accessprovider
   */
  AccessProvider = <
    TAccessProviderName extends TSchema['AccessProviders'] extends string[]
      ? TSchema['AccessProviders'][number]
      : string = TSchema['AccessProviders'] extends string[]
      ? TSchema['AccessProviders'][number]
      : string
  >(
    name: TAccessProviderName
  ) => {
    return new Expression({ access_provider: name });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/accessproviders
   */
  AccessProviders = <
    TDatabaseName extends TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string = TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string
  >(
    database?: Expression<DatabaseReturnType<TDatabaseName>>
  ) => {
    if (!database) {
      return new Expression({ access_providers: null });
    }

    return new Expression({ access_providers: database });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/acos
   */
  Acos = (value: number) => {
    return new Expression({ acos: value });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/add
   */
  Add = (...values: number[]) => {
    if (values.length === 1) {
      return new Expression({ add: values[0] });
    }

    return new Expression({ add: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/all
   */
  All = (...values: number[]) => {
    if (values.length === 1) {
      return new Expression({ all: values[0] });
    }

    return new Expression({ all: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/and
   */
  And = (...values: boolean[]) => {
    if (values.length === 1) {
      return new Expression({ and: values[0] });
    }

    return new Expression({ and: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/any
   */
  Any = (...values: boolean[]) => {
    if (values.length === 1) {
      return new Expression({ any: values[0] });
    }

    return new Expression({ any: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/append
   */
  Append = (base: unknown[], elems: unknown[]) => {
    return new Expression({
      append: wrap(base),
      collection: wrap(elems),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/asin
   */
  Asin = (value: number) => {
    return new Expression({ asin: value });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/at
   */
  At = (timestamp: Expression<Timestamp>, expression: unknown) => {
    return new Expression({ at: timestamp, expr: wrap(expression) });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/atan
   */
  Atan = (value: number) => {
    return new Expression({ atan: value });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/bitand
   */
  BitAnd = (...values: number[]) => {
    if (values.length === 1) {
      return new Expression({ bitand: values[0] });
    }

    return new Expression({ bitand: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/bitnot
   */
  BitNot = (value: number) => {
    return new Expression({ bitnot: value });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/bitor
   */
  BitOr = (...values: number[]) => {
    if (values.length === 1) {
      return new Expression({ bitor: values[0] });
    }

    return new Expression({ bitor: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/bitxor
   */
  BitXor = (...values: number[]) => {
    if (values.length === 1) {
      return new Expression({ bitxor: values[0] });
    }

    return new Expression({ bitxor: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/call
   */
  Call = <
    TFunctionName extends keyof TSchema['Functions'] = keyof TSchema['Functions'],
    TDatabaseName extends TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string = TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string,
    TArgs extends TSchema['Functions'][TFunctionName] = TSchema['Functions'][TFunctionName]
  >(
    fn:
      | TFunctionName
      | Expression<FunctionReturnType<TFunctionName, TDatabaseName>>,
    args: TArgs
  ) => {
    return new Expression({
      call: fn,
      arguments: wrap(args),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/casefold
   */
  Casefold = (value: string, normalizer?: Normalizer) => {
    if (normalizer) {
      return new Expression({
        casefold: value,
        normalizer,
      });
    }

    return new Expression({
      casefold: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/ceil
   */
  Ceil = (value: number) => {
    return new Expression({
      ceil: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/collection
   */
  Collection = <
    TCollectionName extends keyof TSchema['Collections'] = keyof TSchema['Collections'],
    TDatabaseName extends TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string = TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string
  >(
    name: TCollectionName,
    database?: Expression<DatabaseReturnType<TDatabaseName>>
  ) => {
    if (database) {
      return new Expression({
        collection: name,
        scope: database,
      });
    }

    return new Expression({
      collection: name,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/collections
   */
  Collections = <
    TDatabaseName extends TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string = TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string
  >(
    database?: Expression<DatabaseReturnType<TDatabaseName>>
  ) => {
    if (database) {
      return new Expression({
        collections: database,
      });
    }

    return new Expression({
      collections: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/concat
   */
  Concat = (value: string[], separator?: string) => {
    if (separator) {
      return new Expression({
        concat: value,
        separator,
      });
    }

    return new Expression({
      concat: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/containsfield
   */
  ContainsField = (field: string, value: unknown) => {
    return new Expression({
      contains_field: field,
      in: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/containspath
   */
  ContainsPath = (path: (string | number)[], value: unknown) => {
    return new Expression({
      contains_path: path,
      in: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/containsstr
   */
  ContainsStr = (value: string, search: string) => {
    return new Expression({
      containsstr: value,
      search,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/containsstrregex
   */
  ContainsStrRegex = (value: string, pattern: string) => {
    return new Expression({
      containsstrregex: value,
      pattern,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/containsvalue
   */
  ContainsValue = (value: unknown, inValue: unknown) => {
    return new Expression({
      contains_value: wrap(value),
      in: wrap(inValue),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/cos
   */
  Cos = (value: number) => {
    return new Expression({
      cos: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/cosh
   */
  Cosh = (value: number) => {
    return new Expression({
      cosh: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/count
   */
  Count = (arrayOrSet: unknown[] | Expression) => {
    return new Expression({
      count: wrap(arrayOrSet),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/create
   */
  Create = <
    TCollectionName extends keyof TSchema['Collections'] = keyof TSchema['Collections'],
    TDatabaseName extends TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string = TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string,
    TData extends TSchema['Collections'][TCollectionName] = TSchema['Collections'][TCollectionName]
  >(
    collection:
      | TCollectionName
      | Expression<CollectionReturnType<TCollectionName, TDatabaseName>>,
    params: CreateParams<TData>
  ) => {
    return new Expression({
      create: collection,
      params: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/createaccessprovider
   */
  CreateAccessProvider = <
    TAccessProviderName extends TSchema['AccessProviders'] extends string[]
      ? TSchema['AccessProviders'][number]
      : string = TSchema['AccessProviders'] extends string[]
      ? TSchema['AccessProviders'][number]
      : string
  >(
    params: CreateAccessProviderParams<
      TAccessProviderName,
      TSchema['Roles'],
      TSchema['Databases']
    >
  ) => {
    return new Expression({
      create_access_provider: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/createcollection
   */
  CreateCollection = (
    params: CreateCollectionParams<TSchema, keyof TSchema['Collections']>
  ) => {
    return new Expression({
      create_collection: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/createdatabase
   */
  CreateDatabase = <
    TDatabaseName extends TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string = TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string
  >(
    params: CreateDatabaseParams<TDatabaseName>
  ) => {
    return new Expression({
      create_database: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/createfunction
   */
  CreateFunction = <
    TFunctionName extends TSchema['Functions'] extends string[]
      ? TSchema['Functions'][number]
      : string = TSchema['Functions'] extends string[]
      ? TSchema['Functions'][number]
      : string
  >(
    params: CreateFunctionParams<
      TFunctionName,
      TSchema['Roles'],
      TSchema['Databases']
    >
  ) => {
    return new Expression({
      create_function: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/createindex
   */
  CreateIndex = <
    TIndexName extends TSchema['Indexes'] extends string[]
      ? TSchema['Indexes'][number]
      : string = TSchema['Indexes'] extends string[]
      ? TSchema['Indexes'][number]
      : string
  >(
    params: CreateIndexParams<
      TIndexName,
      TSchema['Collections'],
      TSchema['Databases']
    >
  ) => {
    return new Expression({
      create_index: wrap(params),
    });
  };

  CreateKey = () => {
    // TODO
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/database
   */
  Database = <
    TDatabaseName extends TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string = TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string
  >(
    name: TDatabaseName,
    database?: Expression<DatabaseReturnType<TDatabaseName>>
  ): Expression<DatabaseReturnType<TDatabaseName>> => {
    if (database) {
      return new Expression({ database: name, scope: database });
    }

    return new Expression({ database: name });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/function
   */
  Function = <
    TFunctionName extends keyof TSchema['Functions'] = keyof TSchema['Functions'],
    TDatabaseName extends TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string = TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string
  >(
    name: TFunctionName,
    database?: Expression<DatabaseReturnType<TDatabaseName>>
  ): Expression<FunctionReturnType<TFunctionName, TDatabaseName>> => {
    if (database) {
      return new Expression({ function: name, scope: database });
    }

    return new Expression({ function: name });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/lambda
   */
  Lambda = (
    params: string | string[],
    expression: unknown
  ): Expression<LambdaReturnType> => {
    return new Expression({
      lambda: params,
      expr: wrap(expression),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/let
   */
  Let = (variables: TVariables, expression: unknown) => {
    const variablesExpression = Object.keys(variables).map(variable => ({
      [variable]: wrap(variables[variable]),
    }));

    return new Expression({
      let: variablesExpression,
      in: wrap(expression),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/now
   */
  Now = (): Expression<Timestamp> => {
    return new Expression({ now: null });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/query
   */
  Query = (
    lambda: Expression<LambdaReturnType>
  ): Expression<QueryReturnType> => {
    return new Expression({ query: lambda });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/role
   */
  Role = <
    TRoleName extends TSchema['Roles'] extends string[]
      ? TSchema['Roles'][number]
      : string = TSchema['Roles'] extends string[]
      ? TSchema['Roles'][number]
      : string,
    TDatabaseName extends TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string = TSchema['Databases'] extends string[]
      ? TSchema['Databases'][number]
      : string
  >(
    name: TRoleName,
    database?: Expression<DatabaseReturnType<TDatabaseName>>
  ): Expression<RoleReturnType<TRoleName, TDatabaseName>> => {
    if (database) {
      return new Expression({
        role: name,
        scope: database,
      });
    }

    return new Expression({
      role: name,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/select
   */
  Select = <
    TFromArray extends unknown = unknown,
    TFrom extends Expression | Record<string, unknown> | TFromArray[] = any
  >(
    path: TFrom extends Expression
      ? string | number | (string | number)[]
      : O.Paths<TFrom> | O.Paths<TFrom>[number],
    from: TFrom,
    defaultValue?: unknown
  ) => {
    if (defaultValue) {
      return new Expression({
        from: wrap(from),
        select: path,
        default: wrap(defaultValue),
      });
    }

    return new Expression({
      from: wrap(from),
      select: path,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/time
   */
  Time = (str: string): Expression<Timestamp> => {
    return new Expression({ time: str });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/var
   */
  Var = (name: keyof TVariables) => {
    return new Expression({
      var: name,
    });
  };
}

export { Query, QuerySchema, QueryVariables };
