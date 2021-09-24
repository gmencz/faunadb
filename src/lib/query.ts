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

type OrExpression<TValue = unknown> = Expression | TValue;

type DatabaseWithoutScopeReturnType<TDatabaseName> = {
  database: OrExpression<TDatabaseName>;
};

type DatabaseWithScopeReturnType<TDatabaseName> = {
  database: OrExpression<TDatabaseName>;
  scope: DatabaseWithoutScopeReturnType<TDatabaseName>;
};

type DatabaseReturnType<TDatabaseName> =
  | DatabaseWithoutScopeReturnType<TDatabaseName>
  | DatabaseWithScopeReturnType<TDatabaseName>;

type FunctionWithoutScopeReturnType<TFunctionName> = {
  function: OrExpression<TFunctionName>;
};

type FunctionWithScopeReturnType<TFunctionName, TDatabaseName> = {
  function: OrExpression<TFunctionName>;
  scope: DatabaseWithoutScopeReturnType<TDatabaseName>;
};

type FunctionReturnType<TFunctionName, TDatabaseName> =
  | FunctionWithoutScopeReturnType<TFunctionName>
  | FunctionWithScopeReturnType<TFunctionName, TDatabaseName>;

type RoleWithoutScopeReturnType<TRoleName> = {
  role: OrExpression<TRoleName>;
};

type RoleWithScopeReturnType<TRoleName, TDatabaseName> = {
  role: OrExpression<TRoleName>;
  scope: DatabaseWithoutScopeReturnType<TDatabaseName>;
};

type RoleReturnType<TRoleName, TDatabaseName> =
  | RoleWithoutScopeReturnType<TRoleName>
  | RoleWithScopeReturnType<TRoleName, TDatabaseName>;

type CollectionWithoutScopeReturnType<TCollectionName> = {
  collection: OrExpression<TCollectionName>;
};

type CollectionWithScopeReturnType<TCollectionName, TDatabaseName> = {
  collection: OrExpression<TCollectionName>;
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

type Timestamp = { time: string | Expression } | { now: null };

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

type CreateKeyParams<
  TRoles extends QuerySchema['Roles'],
  TDatabases extends QuerySchema['Databases'],
  TDatabaseName extends TDatabases extends string[]
    ? TDatabases[number]
    : string = TDatabases extends string[] ? TDatabases[number] : string
> = {
  role:
    | BuiltInRole
    | Expression<
        RoleReturnType<
          TRoles extends string[] ? TRoles[number] : string,
          TDatabases extends string[] ? TDatabases[number] : string
        >
      >
    | Expression<
        RoleReturnType<
          TRoles extends string[] ? TRoles[number] : string,
          TDatabases extends string[] ? TDatabases[number] : string
        >
      >[];

  database?: Expression<DatabaseReturnType<TDatabaseName>>;
  data?: { name?: string } & Record<string, unknown>;
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

type EpochUnit =
  | 'day'
  | 'days'
  | 'half day'
  | 'half days'
  | 'hour'
  | 'hours'
  | 'minute'
  | 'minutes'
  | 'second'
  | 'seconds'
  | 'millisecond'
  | 'milliseconds'
  | 'microsecond'
  | 'microseconds'
  | 'nanosecond'
  | 'nanoseconds';

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

type PrivilegeActions = {
  create: boolean | Expression<QueryReturnType>;
  delete: boolean | Expression<QueryReturnType>;
  read: boolean | Expression<QueryReturnType>;
  write: boolean | Expression<QueryReturnType>;
  history_read: boolean | Expression<QueryReturnType>;
  history_write: boolean | Expression<QueryReturnType>;
  unrestricted_read: boolean | Expression<QueryReturnType>;
  call: boolean | Expression<QueryReturnType>;
};

type PrivilegeConfigurationObject = {
  resource: Expression; // TODO: Improve when all system collections functions have been implemented (https://docs.fauna.com/fauna/current/security/roles#pco).
  actions: O.AtLeast<PrivilegeActions>;
};

type MembershipConfigurationObject = {
  resource: Expression; // TODO: Improve when all system collections functions have been implemented (https://docs.fauna.com/fauna/current/security/roles#pco).
  predicate?: Expression<QueryReturnType>;
};

type CreateRoleParams<TRoleName extends string> = {
  name: TRoleName;
  privileges: PrivilegeConfigurationObject[];
  membership?: MembershipConfigurationObject[];
  data?: Record<string, unknown>;
};

type RefReturnType = {
  id: string | Expression;
  ref: Expression;
};

class Query<
  TSchema extends QuerySchema = QuerySchema,
  TVariables extends QueryVariables = QueryVariables
> {
  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/abort
   */
  Abort = (message: OrExpression<string>) => {
    return new Expression({ abort: message });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/abs
   */
  Abs = (value: OrExpression<number>) => {
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
    name: OrExpression<TAccessProviderName>
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
  Acos = (value: OrExpression<number>) => {
    return new Expression({ acos: value });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/add
   */
  Add = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({ add: values[0] });
    }

    return new Expression({ add: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/all
   */
  All = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({ all: values[0] });
    }

    return new Expression({ all: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/and
   */
  And = (...values: OrExpression<boolean>[]) => {
    if (values.length === 1) {
      return new Expression({ and: values[0] });
    }

    return new Expression({ and: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/any
   */
  Any = (...values: OrExpression<boolean>[]) => {
    if (values.length === 1) {
      return new Expression({ any: values[0] });
    }

    return new Expression({ any: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/append
   */
  Append = (base: unknown[] | Expression, elems: unknown[] | Expression) => {
    return new Expression({
      append: wrap(base),
      collection: wrap(elems),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/asin
   */
  Asin = (value: OrExpression<number>) => {
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
  Atan = (value: OrExpression<number>) => {
    return new Expression({ atan: value });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/bitand
   */
  BitAnd = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({ bitand: values[0] });
    }

    return new Expression({ bitand: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/bitnot
   */
  BitNot = (value: OrExpression<number>) => {
    return new Expression({ bitnot: value });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/bitor
   */
  BitOr = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({ bitor: values[0] });
    }

    return new Expression({ bitor: values });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/bitxor
   */
  BitXor = (...values: OrExpression<number>[]) => {
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
      | OrExpression<TFunctionName>
      | Expression<FunctionReturnType<TFunctionName, TDatabaseName>>,
    args: OrExpression<TArgs>
  ) => {
    return new Expression({
      call: fn,
      arguments: wrap(args),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/casefold
   */
  Casefold = (
    value: OrExpression<string>,
    normalizer?: OrExpression<Normalizer>
  ) => {
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
  Ceil = (value: OrExpression<number>) => {
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
    name: OrExpression<TCollectionName>,
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
  Concat = (value: OrExpression<string>[], separator?: string | Expression) => {
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
  ContainsField = (field: OrExpression<string>, value: unknown) => {
    return new Expression({
      contains_field: field,
      in: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/containspath
   */
  ContainsPath = (path: OrExpression<string | number>[], value: unknown) => {
    return new Expression({
      contains_path: path,
      in: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/containsstr
   */
  ContainsStr = (value: OrExpression<string>, search: OrExpression<string>) => {
    return new Expression({
      containsstr: value,
      search,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/containsstrregex
   */
  ContainsStrRegex = (
    value: OrExpression<string>,
    pattern: OrExpression<string>
  ) => {
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
  Cos = (value: OrExpression<number>) => {
    return new Expression({
      cos: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/cosh
   */
  Cosh = (value: OrExpression<number>) => {
    return new Expression({
      cosh: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/count
   */
  Count = (arrayOrSet: OrExpression<unknown[]>) => {
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
      | OrExpression<TCollectionName>
      | Expression<CollectionReturnType<TCollectionName, TDatabaseName>>,
    params: OrExpression<CreateParams<TData>>
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
    params: OrExpression<
      CreateAccessProviderParams<
        TAccessProviderName,
        TSchema['Roles'],
        TSchema['Databases']
      >
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
    params: OrExpression<
      CreateCollectionParams<TSchema, keyof TSchema['Collections']>
    >
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
    params: OrExpression<CreateDatabaseParams<TDatabaseName>>
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
    params: OrExpression<
      CreateFunctionParams<
        TFunctionName,
        TSchema['Roles'],
        TSchema['Databases']
      >
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
    params: OrExpression<
      CreateIndexParams<
        TIndexName,
        TSchema['Collections'],
        TSchema['Databases']
      >
    >
  ) => {
    return new Expression({
      create_index: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/createkey
   */
  CreateKey = (
    params: OrExpression<
      CreateKeyParams<TSchema['Roles'], TSchema['Databases']>
    >
  ) => {
    return new Expression({
      create_key: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/createrole
   */
  CreateRole = <
    TRoleName extends TSchema['Roles'] extends string[]
      ? TSchema['Roles'][number]
      : string = TSchema['Roles'] extends string[]
      ? TSchema['Roles'][number]
      : string
  >(
    params: OrExpression<CreateRoleParams<TRoleName>>
  ) => {
    return new Expression({
      create_role: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/credentials
   */
  Credentials = <
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
        credentials: database,
      });
    }

    return new Expression({
      credentials: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/currentidentity
   */
  CurrentIdentity = () => {
    return new Expression({
      current_identity: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/currenttoken
   */
  CurrentToken = () => {
    return new Expression({
      current_token: null,
    });
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
    name: OrExpression<TDatabaseName>,
    database?: Expression<DatabaseReturnType<TDatabaseName>>
  ): Expression<DatabaseReturnType<TDatabaseName>> => {
    if (database) {
      return new Expression({ database: name, scope: database });
    }

    return new Expression({ database: name });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/databases
   */
  Databases = <
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
        databases: database,
      });
    }

    return new Expression({
      databases: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/date
   */
  Date = (str: OrExpression<string>) => {
    return new Expression({
      date: str,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/dayofmonth
   */
  DayOfMonth = (timestamp: Expression<Timestamp>) => {
    return new Expression({
      day_of_month: timestamp,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/dayofweek
   */
  DayOfWeek = (timestamp: Expression<Timestamp>) => {
    return new Expression({
      day_of_week: timestamp,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/dayofyear
   */
  DayOfYear = (timestamp: Expression<Timestamp>) => {
    return new Expression({
      day_of_year: timestamp,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/degrees
   */
  Degrees = (value: OrExpression<number>) => {
    return new Expression({
      degrees: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/delete
   */
  Delete = (ref: Expression<RefReturnType>) => {
    return new Expression({
      delete: ref,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/difference
   */
  Difference = (source: unknown[] | Expression, ...diff: unknown[]) => {
    return new Expression({
      difference: wrap([source, ...diff]),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/distinct
   */
  Distinct = (source: unknown[] | Expression) => {
    return new Expression({
      distinct: wrap(source),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/divide
   */
  Divide = (...values: OrExpression<number>[]) => {
    return new Expression({
      divide: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/do
   */
  Do = (...expressions: Expression[]) => {
    return new Expression({
      do: wrap(expressions),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/documents
   */
  Documents = (collection: Expression) => {
    return new Expression({
      documents: collection,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/drop
   */
  Drop = (num: OrExpression<number>, array: OrExpression<unknown[]>) => {
    return new Expression({
      drop: num,
      collection: wrap(array),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/endswith
   */
  EndsWith = (value: OrExpression<string>, search: OrExpression<string>) => {
    return new Expression({
      endswith: value,
      search,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/epoch
   */
  Epoch = (num: OrExpression<number>, unit: OrExpression<EpochUnit>) => {
    return new Expression({
      epoch: num,
      unit,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/equals
   */
  Equals = (value1: unknown, value2: unknown, ...values: unknown[]) => {
    return new Expression({
      equals: wrap([value1, value2, ...values]),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/events
   */
  Events = (input: Expression) => {
    return new Expression({
      events: input,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/exists
   */
  Exists = (ref: Expression<RefReturnType>, ts?: OrExpression<number>) => {
    if (ts) {
      return new Expression({
        exists: ref,
        ts,
      });
    }

    return new Expression({
      exists: ref,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/exp
   */
  Exp = (value: OrExpression<number>) => {
    return new Expression({
      exp: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/filter
   */
  Filter = (
    arrayOrSet: OrExpression<unknown[]>,
    lambda: Expression<LambdaReturnType>
  ) => {
    return new Expression({
      collection: wrap(arrayOrSet),
      filter: lambda,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/findstr
   */
  FindStr = (
    value: OrExpression<string>,
    find: OrExpression<string>,
    start?: OrExpression<number>
  ) => {
    if (start) {
      return new Expression({
        findstr: value,
        find,
        start,
      });
    }

    return new Expression({
      findstr: value,
      find,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/findstrregex
   */
  FindStrRegex = (
    value: OrExpression<string>,
    find: OrExpression<string>,
    start?: OrExpression<number>,
    numResults?: OrExpression<number>
  ) => {
    if (start && numResults) {
      return new Expression({
        findstrregex: value,
        find,
        start,
        num_results: numResults,
      });
    }

    if (start) {
      return new Expression({
        findstrregex: value,
        find,
        start,
      });
    }

    if (numResults) {
      return new Expression({
        findstrregex: value,
        find,
        num_results: numResults,
      });
    }

    return new Expression({
      findstrregex: value,
      find,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/floor
   */
  Floor = (value: OrExpression<number>) => {
    return new Expression({
      floor: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/foreach
   */
  Foreach = (
    arrayOrPage: OrExpression<unknown[]>,
    lambda: Expression<LambdaReturnType>
  ) => {
    return new Expression({
      collection: wrap(arrayOrPage),
      foreach: lambda,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/format
   */
  Format = (format: OrExpression<string>, ...args: unknown[]) => {
    if (args.length === 1) {
      return new Expression({
        format,
        values: wrap(args[0]),
      });
    }

    return new Expression({
      format,
      values: wrap(args),
    });
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
    name: OrExpression<TFunctionName>,
    database?: Expression<DatabaseReturnType<TDatabaseName>>
  ): Expression<FunctionReturnType<TFunctionName, TDatabaseName>> => {
    if (database) {
      return new Expression({ function: name, scope: database });
    }

    return new Expression({ function: name });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/functions
   */
  Functions = <
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
        functions: database,
      });
    }

    return new Expression({
      functions: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/gt
   */
  GT = () => {
    // TODO
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
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/ref
   */
  Ref = (
    schemaRef: Expression,
    documentId: OrExpression<string>
  ): Expression<RefReturnType> => {
    return new Expression({
      id: documentId,
      ref: schemaRef,
    });
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
    name: OrExpression<TRoleName>,
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
  Time = (str: OrExpression<string>): Expression<Timestamp> => {
    return new Expression({ time: str });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/var
   */
  Var = <
    TVariableName extends keyof TVariables = keyof TVariables,
    TVariableValue extends TVariables[TVariableName] = TVariables[TVariableName]
  >(
    name: TVariableName
  ): Expression<TVariableValue> => {
    return new Expression(({
      var: name,
    } as unknown) as TVariableValue);
  };
}

export { Query, QuerySchema, QueryVariables };
