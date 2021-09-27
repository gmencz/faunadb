import { O } from 'ts-toolbelt';
import { Expression, wrap, wrapValues } from './expression';

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

type Normalizer = 'NFKCCaseFold' | 'NFC' | 'NFD' | 'NFKC' | 'NFKD';

type CreateParams<TData extends unknown> = {
  data?: OrExpression<TData>;
  credentials?: OrExpression<{ password: string } & Record<string, unknown>>;
  ttl?: Expression;
};

type CreateAccessProviderParams<TAccessProviderName extends string> = {
  name: OrExpression<TAccessProviderName>;
  issuer: OrExpression<string>;
  jwks_uri: OrExpression<string>;
  roles?:
    | Expression[]
    | {
        role: Expression;
        predicate: Expression;
      }[];
  data?: OrExpression<Record<string, unknown>>;
};

type CreateCollectionParams<
  TSchema extends QuerySchema,
  TCollectionName extends keyof TSchema['Collections']
> = {
  name: OrExpression<TCollectionName>;
  data?: OrExpression<Record<string, unknown>>;
  history_days?: OrExpression<number | null>;
  ttl_days?: OrExpression<number | null>;
};

type CreateDatabaseParams<TDatabaseName extends string> = {
  name: OrExpression<TDatabaseName>;
  data?: OrExpression<Record<string, unknown>>;
};

type BuiltInRole = 'admin' | 'server' | 'server-readonly' | 'client';

type CreateFunctionParams<TFunctionName extends string> = {
  name: OrExpression<TFunctionName>;
  body: Expression;
  data?: OrExpression<Record<string, unknown>>;
  role?: BuiltInRole | Expression;
};

type CreateKeyParams = {
  role: BuiltInRole | Expression | Expression[];

  database?: Expression;
  data?: OrExpression<{ name?: string } & Record<string, unknown>>;
};

type SourceObject = {
  collection: Expression;
  fields: OrExpression<Record<string, Expression>>;
};

type TermObject = {
  field?: OrExpression<string | string[]>;
  binding?: OrExpression<string>;
};

type ValueObject = {
  field?: OrExpression<string | string[]>;
  binding?: OrExpression<string>;
  reverse?: OrExpression<boolean>;
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

type CreateIndexParams<TIndexName extends string> = {
  name: OrExpression<TIndexName>;
  source: OrExpression<SourceObject>;
  terms?: OrExpression<TermObject[]>;
  values?: OrExpression<ValueObject[]>;
  unique?: OrExpression<boolean>;
  serialized?: OrExpression<boolean>;
  data?: OrExpression<Record<string, unknown>>;
};

type PrivilegeActions = {
  create: boolean | Expression;
  delete: boolean | Expression;
  read: boolean | Expression;
  write: boolean | Expression;
  history_read: boolean | Expression;
  history_write: boolean | Expression;
  unrestricted_read: boolean | Expression;
  call: boolean | Expression;
};

type PrivilegeConfigurationObject = {
  resource: Expression;
  actions: OrExpression<O.AtLeast<PrivilegeActions>>;
};

type MembershipConfigurationObject = {
  resource: Expression;
  predicate?: Expression;
};

type CreateRoleParams<TRoleName extends string> = {
  name: OrExpression<TRoleName>;
  privileges: OrExpression<PrivilegeConfigurationObject[]>;
  membership?: OrExpression<MembershipConfigurationObject[]>;
  data?: OrExpression<Record<string, unknown>>;
};

type InsertParams = {
  data: OrExpression<Record<string, unknown>>;
  credentials: OrExpression<Record<string, unknown>>;
  delegates: OrExpression<Record<string, unknown>>;
};

type LoginParams = {
  data?: OrExpression<Record<string, unknown>>;
  password: OrExpression<string>;
  ttl?: Expression;
};

type PaginateParams = {
  ts?: OrExpression<number>;
  before?: Expression[];
  after?: Expression[];
  size?: OrExpression<number>;
  events?: OrExpression<boolean>;
  sources?: OrExpression<boolean>;
};

type ReplaceParams = {
  data: OrExpression<Record<string, unknown>>;
};

type UpdateParams = {
  data: OrExpression<Record<string, unknown>>;
  credentials: OrExpression<Record<string, unknown>>;
  delegates: OrExpression<Record<string, unknown>>;
  ttl?: Expression;
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
  AccessProviders = (database?: Expression) => {
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
  At = (timestamp: Expression, expression: unknown) => {
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
    TArgs extends TSchema['Functions'][TFunctionName] = TSchema['Functions'][TFunctionName]
  >(
    fn: OrExpression<TFunctionName>,
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
    TCollectionName extends keyof TSchema['Collections'] = keyof TSchema['Collections']
  >(
    name: OrExpression<TCollectionName>,
    database?: Expression
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
  Collections = (database?: Expression) => {
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
    TData extends TSchema['Collections'][TCollectionName] = TSchema['Collections'][TCollectionName]
  >(
    collection: OrExpression<TCollectionName>,
    params: OrExpression<CreateParams<TData> & Record<string, unknown>>
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
    params: OrExpression<CreateAccessProviderParams<TAccessProviderName>>
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
    params: OrExpression<CreateFunctionParams<TFunctionName>>
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
    params: OrExpression<CreateIndexParams<TIndexName>>
  ) => {
    return new Expression({
      create_index: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/createkey
   */
  CreateKey = (params: OrExpression<CreateKeyParams>) => {
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
  Credentials = (database?: Expression) => {
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
    database?: Expression
  ) => {
    if (database) {
      return new Expression({ database: name, scope: database });
    }

    return new Expression({ database: name });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/databases
   */
  Databases = (database?: Expression) => {
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
  DayOfMonth = (timestamp: Expression) => {
    return new Expression({
      day_of_month: timestamp,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/dayofweek
   */
  DayOfWeek = (timestamp: Expression) => {
    return new Expression({
      day_of_week: timestamp,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/dayofyear
   */
  DayOfYear = (timestamp: Expression) => {
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
  Delete = (ref: Expression) => {
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
  Exists = (ref: Expression, ts?: OrExpression<number>) => {
    if (ts !== undefined) {
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
  Filter = (arrayOrSet: OrExpression<unknown[]>, lambda: Expression) => {
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
    if (start !== undefined) {
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
    if (start !== undefined && numResults !== undefined) {
      return new Expression({
        findstrregex: value,
        find,
        start,
        num_results: numResults,
      });
    }

    if (start !== undefined) {
      return new Expression({
        findstrregex: value,
        find,
        start,
      });
    }

    if (numResults !== undefined) {
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
  Foreach = (arrayOrPage: OrExpression<unknown[]>, lambda: Expression) => {
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
    TFunctionName extends keyof TSchema['Functions'] = keyof TSchema['Functions']
  >(
    name: OrExpression<TFunctionName>,
    database?: Expression
  ) => {
    if (database) {
      return new Expression({ function: name, scope: database });
    }

    return new Expression({ function: name });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/functions
   */
  Functions = (database?: Expression) => {
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
  GT = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({
        gt: values[0],
      });
    }

    return new Expression({
      gt: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/gte
   */
  GTE = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({
        gte: values[0],
      });
    }

    return new Expression({
      gte: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/get
   */
  Get = (ref: Expression, ts?: OrExpression<number>) => {
    if (ts !== undefined) {
      return new Expression({
        get: ref,
        ts,
      });
    }

    return new Expression({
      get: ref,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/hascurrentidentity
   */
  HasCurrentIdentity = () => {
    return new Expression({
      has_current_identity: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/hascurrenttoken
   */
  HasCurrentToken = () => {
    return new Expression({
      has_current_token: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/hour
   */
  Hour = (timestamp: Expression) => {
    return new Expression({
      hour: timestamp,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/hypot
   */
  Hypot = (a: OrExpression<number>, b?: OrExpression<number>) => {
    if (b !== undefined) {
      return new Expression({
        hypot: a,
        b,
      });
    }

    return new Expression({
      hypot: a,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/identify
   */
  Identify = (identity: Expression, password: OrExpression<string>) => {
    return new Expression({
      identify: identity,
      password,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/if
   */
  If = (
    condition: OrExpression<boolean>,
    thenExpression: unknown,
    elseExpression: unknown
  ) => {
    return new Expression({
      if: condition,
      then: wrap(thenExpression),
      else: wrap(elseExpression),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/index
   */
  Index = <
    TIndexName extends TSchema['Indexes'] extends string[]
      ? TSchema['Indexes'][number]
      : string = TSchema['Indexes'] extends string[]
      ? TSchema['Indexes'][number]
      : string
  >(
    name: OrExpression<TIndexName>,
    database?: Expression
  ) => {
    if (database) {
      return new Expression({
        index: name,
        scope: database,
      });
    }

    return new Expression({
      index: name,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/indexes
   */
  Indexes = (database?: Expression) => {
    if (database) {
      return new Expression({
        indexes: database,
      });
    }

    return new Expression({
      indexes: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/insert
   */
  Insert = (
    ref: Expression,
    ts: OrExpression<number>,
    action: OrExpression<'create' | 'delete' | 'update'>,
    params: OrExpression<O.AtLeast<InsertParams>>
  ) => {
    return new Expression({
      insert: ref,
      ts,
      action,
      params: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/intersection
   */
  Intersection = (...group: OrExpression<unknown[]>[]) => {
    return new Expression({
      intersection: wrap([...group]),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isarray
   */
  IsArray = (value: unknown) => {
    return new Expression({
      is_array: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isboolean
   */
  IsBoolean = (value: unknown) => {
    return new Expression({
      is_boolean: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isbytes
   */
  IsBytes = (value: unknown) => {
    return new Expression({
      is_bytes: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/iscollection
   */
  IsCollection = (value: unknown) => {
    return new Expression({
      is_collection: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/iscredentials
   */
  IsCredentials = (value: unknown) => {
    return new Expression({
      is_credentials: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isdatabase
   */
  IsDatabase = (value: unknown) => {
    return new Expression({
      is_database: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isdate
   */
  IsDate = (value: unknown) => {
    return new Expression({
      is_date: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isdoc
   */
  IsDoc = (value: unknown) => {
    return new Expression({
      is_doc: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isdouble
   */
  IsDouble = (value: unknown) => {
    return new Expression({
      is_double: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isempty
   */
  IsEmpty = (arrayOrSet: OrExpression<unknown[]>) => {
    return new Expression({
      is_empty: wrap(arrayOrSet),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isfunction
   */
  IsFunction = (value: unknown) => {
    return new Expression({
      is_function: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isindex
   */
  IsIndex = (value: unknown) => {
    return new Expression({
      is_index: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isinteger
   */
  IsInteger = (value: unknown) => {
    return new Expression({
      is_integer: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/iskey
   */
  IsKey = (value: unknown) => {
    return new Expression({
      is_key: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/islambda
   */
  IsLambda = (value: unknown) => {
    return new Expression({
      is_lambda: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isnonempty
   */
  IsNonEmpty = (arrayOrSet: OrExpression<unknown[]>) => {
    return new Expression({
      is_nonempty: wrap(arrayOrSet),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isnull
   */
  IsNull = (value: unknown) => {
    return new Expression({
      is_null: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isnumber
   */
  IsNumber = (value: unknown) => {
    return new Expression({
      is_number: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isobject
   */
  IsObject = (value: unknown) => {
    return new Expression({
      is_object: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isref
   */
  IsRef = (value: unknown) => {
    return new Expression({
      is_ref: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isrole
   */
  IsRole = (value: unknown) => {
    return new Expression({
      is_role: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isset
   */
  IsSet = (value: unknown) => {
    return new Expression({
      is_set: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/isstring
   */
  IsString = (value: unknown) => {
    return new Expression({
      is_string: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/istimestamp
   */
  IsTimestamp = (value: unknown) => {
    return new Expression({
      is_timestamp: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/istoken
   */
  IsToken = (value: unknown) => {
    return new Expression({
      is_token: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/join
   */
  Join = (source: unknown, target: Expression) => {
    return new Expression({
      join: wrap(source),
      with: target,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/keyfromsecret
   */
  KeyFromSecret = (secret: OrExpression<string>) => {
    return new Expression({
      key_from_secret: secret,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/keys
   */
  Keys = (database?: Expression) => {
    if (database) {
      return new Expression({
        keys: database,
      });
    }

    return new Expression({
      keys: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/lt
   */
  LT = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({
        lt: values[0],
      });
    }

    return new Expression({
      lt: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/lte
   */
  LTE = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({
        lte: values[0],
      });
    }

    return new Expression({
      lte: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/ltrim
   */
  LTrim = (value: OrExpression<string>) => {
    return new Expression({
      ltrim: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/lambda
   */
  Lambda = (params: string | string[], expression: unknown) => {
    return new Expression({
      lambda: params,
      expr: wrap(expression),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/length
   */
  Length = (value: OrExpression<string>) => {
    return new Expression({
      length: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/let
   */
  Let = (variables: TVariables, expression: unknown) => {
    const variablesExpression = Object.keys(variables).map((variable) => ({
      [variable]: wrap(variables[variable]),
    }));

    return new Expression({
      let: variablesExpression,
      in: wrap(expression),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/ln
   */
  Ln = (value: OrExpression<number>) => {
    return new Expression({
      ln: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/log
   */
  Log = (value: OrExpression<number>) => {
    return new Expression({
      log: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/login
   */
  Login = (identity: Expression, params: LoginParams) => {
    return new Expression({
      login: identity,
      params: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/logout
   */
  Logout = (allTokens: OrExpression<boolean>) => {
    return new Expression({
      logout: allTokens,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/lowercase
   */
  LowerCase = (value: OrExpression<string>) => {
    return new Expression({
      lowercase: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/map
   */
  Map = (array: OrExpression<unknown[]>, lambda: Expression) => {
    return new Expression({
      map: lambda,
      collection: wrap(array),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/match
   */
  Match = <
    TIndexName extends TSchema['Indexes'] extends string[]
      ? TSchema['Indexes'][number]
      : string = TSchema['Indexes'] extends string[]
      ? TSchema['Indexes'][number]
      : string
  >(
    index: OrExpression<TIndexName>,
    searchTerms: unknown = []
  ) => {
    return new Expression({
      match: index,
      terms: wrap(searchTerms),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/max
   */
  Max = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({
        max: values[0],
      });
    }

    return new Expression({
      max: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/mean
   */
  Mean = (arrayOrSet: OrExpression<unknown[]>) => {
    return new Expression({
      mean: wrap(arrayOrSet),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/merge
   */
  Merge = (
    object1: OrExpression<Record<string, unknown>>,
    object2:
      | OrExpression<Record<string, unknown>>
      | OrExpression<Record<string, unknown>>[],
    customResolver?: Expression
  ) => {
    if (customResolver) {
      return new Expression({
        merge: wrap(object1),
        with: wrap(object2),
        lambda: customResolver,
      });
    }

    return new Expression({
      merge: wrap(object1),
      with: wrap(object2),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/min
   */
  Min = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({
        min: values[0],
      });
    }

    return new Expression({
      min: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/minute
   */
  Minute = (timestamp: Expression) => {
    return new Expression({
      minute: timestamp,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/modulo
   */
  Modulo = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({
        modulo: values[0],
      });
    }

    return new Expression({
      modulo: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/month
   */
  Month = (timestamp: Expression) => {
    return new Expression({
      month: timestamp,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/movedatabase
   */
  MoveDatabase = (from: Expression, to: Expression) => {
    return new Expression({
      move_database: from,
      to,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/multiply
   */
  Multiply = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({
        multiply: values[0],
      });
    }

    return new Expression({
      multiply: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/newid
   */
  NewId = () => {
    return new Expression({ new_id: null });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/not
   */
  Not = (value: OrExpression<boolean>) => {
    return new Expression({ not: value });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/now
   */
  Now = () => {
    return new Expression({ now: null });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/or
   */
  Or = (...values: OrExpression<boolean>[]) => {
    if (values.length === 1) {
      return new Expression({
        or: values[0],
      });
    }

    return new Expression({
      or: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/paginate
   */
  Paginate = (input: Expression, params?: OrExpression<PaginateParams>) => {
    if (params) {
      if (params instanceof Expression) {
        return new Expression({
          paginate: input,
          // @ts-expect-error because `toJSON` is a private field and we're accesing it
          // from outside the class.
          raw: wrap(params.toJSON()),
        });
      }

      return new Expression({
        paginate: input,
        ...wrapValues(params),
      });
    }

    return new Expression({ paginate: input });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/pow
   */
  Pow = (base: OrExpression<number>, exponent: OrExpression<number>) => {
    return new Expression({
      pow: base,
      exp: exponent,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/prepend
   */
  Prepend = (base: OrExpression<unknown[]>, elems: OrExpression<unknown[]>) => {
    return new Expression({
      prepend: wrap(base),
      collection: wrap(elems),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/query
   */
  Query = (lambda: Expression) => {
    return new Expression({ query: lambda });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/rtrim
   */
  RTrim = (value: OrExpression<string>) => {
    return new Expression({
      rtrim: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/radians
   */
  Radians = (value: OrExpression<number>) => {
    return new Expression({
      radians: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/range
   */
  Range = (
    set: Expression,
    start: OrExpression<unknown | unknown[]>,
    end: OrExpression<unknown | unknown[]>
  ) => {
    return new Expression({
      range: set,
      from: wrap(start),
      to: wrap(end),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/reduce
   */
  Reduce = (
    reducer: Expression,
    initial: unknown,
    arrayOrSet: OrExpression<unknown[]>
  ) => {
    return new Expression({
      reduce: reducer,
      initial,
      arrayOrSet: wrap(arrayOrSet),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/ref
   */
  Ref = (schemaRef: Expression, documentId: OrExpression<string>) => {
    return new Expression({
      id: documentId,
      ref: schemaRef,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/regexescape
   */
  RegexEscape = (value: OrExpression<string>) => {
    return new Expression({
      regexescape: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/remove
   */
  Remove = (
    ref: Expression,
    ts: OrExpression<number>,
    action: OrExpression<'create' | 'delete' | 'update'>
  ) => {
    return new Expression({
      remove: ref,
      ts,
      action,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/repeat
   */
  Repeat = (value: OrExpression<string>, number?: OrExpression<number>) => {
    if (number !== undefined) {
      return new Expression({
        repeat: value,
        number,
      });
    }

    return new Expression({
      repeat: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/replace
   */
  Replace = (ref: Expression, params: ReplaceParams) => {
    return new Expression({
      replace: ref,
      params: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/replacestr
   */
  ReplaceStr = (
    value: OrExpression<string>,
    find: OrExpression<string>,
    replace: OrExpression<string>
  ) => {
    return new Expression({
      replacestr: value,
      find,
      replace,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/replacestrregex
   */
  ReplaceStrRegex = (
    value: OrExpression<string>,
    pattern: OrExpression<string>,
    replace: OrExpression<string>,
    firstOnly?: OrExpression<boolean>
  ) => {
    if (firstOnly !== undefined) {
      return new Expression({
        replacestrregex: value,
        pattern,
        replace,
        first: firstOnly,
      });
    }

    return new Expression({
      replacestrregex: value,
      pattern,
      replace,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/reverse
   */
  Reverse = (source: OrExpression<unknown[]>) => {
    return new Expression({
      reverse: wrap(source),
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
      : string
  >(
    name: OrExpression<TRoleName>,
    database?: Expression
  ) => {
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
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/roles
   */
  Roles = (database?: Expression) => {
    if (database) {
      return new Expression({
        roles: database,
      });
    }

    return new Expression({
      roles: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/round
   */
  Round = (value: OrExpression<number>, precision?: OrExpression<number>) => {
    if (precision !== undefined) {
      return new Expression({
        round: value,
        precision,
      });
    }

    return new Expression({
      round: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/second
   */
  Second = (timestamp: Expression) => {
    return new Expression({
      second: timestamp,
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
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/sign
   */
  Sign = (value: OrExpression<number>) => {
    return new Expression({
      sign: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/sin
   */
  Sin = (value: OrExpression<number>) => {
    return new Expression({
      sin: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/singleton
   */
  Singleton = (ref: Expression) => {
    return new Expression({
      singleton: ref,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/sinh
   */
  Sinh = (value: OrExpression<number>) => {
    return new Expression({
      sinh: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/space
   */
  Space = (count: OrExpression<number>) => {
    return new Expression({
      space: count,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/sqrt
   */
  Sqrt = (value: OrExpression<number>) => {
    return new Expression({
      sqrt: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/startswith
   */
  StartsWith = (value: OrExpression<string>, search: OrExpression<string>) => {
    return new Expression({
      startswith: value,
      search,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/substring
   */
  SubString = (
    value: OrExpression<string>,
    start: OrExpression<number>,
    length?: OrExpression<number>
  ) => {
    if (length !== undefined) {
      return new Expression({
        substring: value,
        start,
        length,
      });
    }

    return new Expression({
      substring: value,
      start,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/subtract
   */
  Subtract = (...values: OrExpression<number>[]) => {
    if (values.length === 1) {
      return new Expression({
        subtract: values[0],
      });
    }

    return new Expression({
      subtract: values,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/sum
   */
  Sum = (arrayOrSet: OrExpression<unknown[]>) => {
    return new Expression({
      sum: arrayOrSet,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/take
   */
  Take = (num: OrExpression<number>, array: OrExpression<unknown[]>) => {
    return new Expression({
      take: num,
      collection: wrap(array),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/tan
   */
  Tan = (value: OrExpression<number>) => {
    return new Expression({
      tan: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/tanh
   */
  Tanh = (value: OrExpression<number>) => {
    return new Expression({
      tanh: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/time
   */
  Time = (str: OrExpression<string>): Expression => {
    return new Expression({ time: str });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/timeadd
   */
  TimeAdd = (
    base: Expression,
    offset: OrExpression<number>,
    unit: OrExpression<EpochUnit>
  ) => {
    return new Expression({
      time_add: base,
      offset,
      unit,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/timediff
   */
  TimeDiff = (
    start: Expression,
    finish: Expression,
    unit: OrExpression<EpochUnit>
  ) => {
    return new Expression({
      time_diff: start,
      other: finish,
      unit,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/timesubtract
   */
  TimeSubtract = (
    base: Expression,
    offset: OrExpression<number>,
    unit: OrExpression<EpochUnit>
  ) => {
    return new Expression({
      time_subtract: base,
      offset,
      unit,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/titlecase
   */
  TitleCase = (value: OrExpression<string>) => {
    return new Expression({
      titlecase: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/toarray
   */
  ToArray = (value: unknown) => {
    return new Expression({
      to_array: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/todate
   */
  ToDate = (value: unknown) => {
    return new Expression({
      to_date: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/todouble
   */
  ToDouble = (value: unknown) => {
    return new Expression({
      to_double: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/tointeger
   */
  ToInteger = (value: unknown) => {
    return new Expression({
      to_integer: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/tomicros
   */
  ToMicros = (value: unknown) => {
    return new Expression({
      to_micros: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/tomillis
   */
  ToMillis = (value: unknown) => {
    return new Expression({
      to_millis: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/tonumber
   */
  ToNumber = (value: unknown) => {
    return new Expression({
      to_number: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/toobject
   */
  ToObject = (value: unknown) => {
    return new Expression({
      to_object: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/toseconds
   */
  ToSeconds = (value: unknown) => {
    return new Expression({
      to_seconds: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/tostring
   */
  ToString = (value: unknown) => {
    return new Expression({
      to_string: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/totime
   */
  ToTime = (value: unknown) => {
    return new Expression({
      to_time: wrap(value),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/tokens
   */
  Tokens = (database?: Expression) => {
    if (database) {
      return new Expression({
        tokens: database,
      });
    }

    return new Expression({
      tokens: null,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/trim
   */
  Trim = (value: OrExpression<string>) => {
    return new Expression({
      trim: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/trim
   */
  Trunc = (value: OrExpression<number>, precision?: OrExpression<number>) => {
    if (precision !== undefined) {
      return new Expression({
        trunc: value,
        precision,
      });
    }

    return new Expression({
      trunc: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/union
   */
  Union = (...groups: OrExpression<unknown>[]) => {
    return new Expression({
      union: wrap(groups),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/update
   */
  Update = (ref: Expression, params: O.AtLeast<OrExpression<UpdateParams>>) => {
    return new Expression({
      update: ref,
      params: wrap(params),
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/uppercase
   */
  UpperCase = (value: OrExpression<string>) => {
    return new Expression({
      uppercase: value,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/var
   */
  Var = <TVariableName extends keyof TVariables = keyof TVariables>(
    name: TVariableName
  ) => {
    return new Expression({
      var: name,
    });
  };

  /**
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/year
   */
  Year = (timestamp: Expression) => {
    return new Expression({
      year: timestamp,
    });
  };
}

export { Query, QuerySchema, QueryVariables };
