import { Expression, wrap } from './expression';

type QuerySchema = {
  AccessProviders?: string[];
  Collections?: Record<string, unknown>;
  Databases?: string[];
  Functions?: Record<string, unknown>;
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
  expression: unknown;
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

class Query<
  TSchema extends QuerySchema = QuerySchema,
  TVariables extends QueryVariables = QueryVariables
> {
  /**
   * The `Abort` function terminates the current transaction and augments the returned error with the associated message.
   * Any modifications to data or schema in the aborted transaction are ignored, even if this modification took place
   * before the abort function was executed.
   * @param message An abort message.
   * @returns An error is returned with the associated abort message.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/abort
   */
  Abort = (message: string) => {
    return new Expression({ abort: message });
  };

  /**
   * The Abs function is used to get the absolute value of a number.
   * @param value Take the absolute value of this argument.
   * @returns A number which is the absolute value of a numeric input argument.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/abs
   */
  Abs = (value: number) => {
    return new Expression({ abs: value });
  };

  /**
   * The `AccessProvider` function returns a valid `Reference` for the specified AccessProvider `name` in the specified child
   * `database`. If a child `database` is not specified, the returned AccessProvider reference belongs to the current database.
   * @param name The name of the AccessProvider.
   * @returns A reference to an AccessProvider with the specified `name`, in the specified child `database` (or the current database
   * if `database` is not specified).
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/accessprovider
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
   * The `AccessProviders` function, when executed with `Paginate`, returns the set of `References` for all AccessProviders
   * in the specified child `database`. If a child `database` is not specified, the returned index references all belong
   * to the current `database`.
   * @param database The reference to a child `database` acquired using the `Database` function.
   * @returns A Set Reference for the available AccessProviders in the specified child `database` (or the current database
   * if database is not specified).
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/accessproviders
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
   * The `Acos` function is a trigonometric function which calculates ratios of the lengths of the sides of right triangles.
   * `Acos` returns the arc cosine of a number.
   * @param value The number whose arc cosine should be returned.
   * @returns A number which is the arc cosine of `value`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/acos
   */
  Acos = (value: number) => {
    return new Expression({ acos: value });
  };

  /**
   * The `Add` function returns the sum of its numeric parameters. It can take a single value or a list of values. Providing a
   * single number returns the number.
   * @param values One or more numbers to sum.
   * @returns A number which is the sum of all `values`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/add
   */
  Add = (...values: number[]) => {
    if (values.length === 1) {
      return new Expression({ add: values[0] });
    }

    return new Expression({ add: values });
  };

  /**
   * The `All` function tests the provided values and returns true if all of the items in values are true,
   * otherwise it returns false.
   * @param values A group of values to test for being true.
   * @returns A boolean indicating whether all of the items in `values` are `true`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/all
   */
  All = (...values: number[]) => {
    if (values.length === 1) {
      return new Expression({ all: values[0] });
    }

    return new Expression({ all: values });
  };

  /**
   * The `And` function computes the conjunction of a list of boolean values, returning true if all elements
   * are "true", and false otherwise.
   * @param values One or more boolean values.
   * @returns A boolean indicating whether all of the items in `values` are `true`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/and
   */
  And = (...values: boolean[]) => {
    if (values.length === 1) {
      return new Expression({ and: values[0] });
    }

    return new Expression({ and: values });
  };

  /**
   * The `Any` function tests the provided `values` and returns `true` if any of the items in `values` is true``,
   * otherwise it returns `false`.
   * @param values One or more boolean values.
   * @returns A boolean indicating whether any of the items in `values` is `true`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/any
   */
  Any = (...values: boolean[]) => {
    if (values.length === 1) {
      return new Expression({ any: values[0] });
    }

    return new Expression({ any: values });
  };

  /**
   * The `Append` function creates a new array that is the result of combining the base Array followed by the elems.
   * This is a specialized function, and only works with arrays and not pages.
   * @param base The base array.
   * @param elems The elements to add to the end of the base array.
   * @returns A new array containing both the `base` array followed by the `elems`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/append
   */
  Append = (base: unknown[], elems: unknown[]) => {
    return new Expression({
      append: wrap(base),
      collection: wrap(elems),
    });
  };

  /**
   * The `Asin` function is a trigonometric function which calculates ratios of the lengths of the sides of right triangles.
   * `Asin` returns the arc sine of a number.
   * @param value The number whose arc sine should be returned.
   * @returns A number which is the arc sine of `value`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/asin
   */
  Asin = (value: number) => {
    return new Expression({ asin: value });
  };

  /**
   * The `At` function executes a temporal query, a query which examines the data in the past. The `timestamp` parameter
   * determines the data available for viewing by creating a virtual snapshot of the data which was current at that
   * date and time. All reads from the associated `expression` is then executed on that virtual snapshot. In contrast,
   * all write operations must be executed at the current time. Attempting a write operation at any other time produces
   * an error.
   * @param timestamp The timestamp of the virtual snapshot of the data.
   * @param expression The FQL statement to be executed.
   * @returns The result of the evaluation of `expression` at the given `timestamp`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/at
   */
  At = (timestamp: Expression<Timestamp>, expression: unknown) => {
    return new Expression({ at: timestamp, expr: wrap(expression) });
  };

  /**
   * The `Atan` function is a trigonometric function which calculates ratios of the lengths of the sides of right triangles.
   * `Atan` returns the arc tangent of a number.
   * @param value The number whose arc tangent should be returned.
   * @returns A number which is the arc tangent of `value`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/atan
   */
  Atan = (value: number) => {
    return new Expression({ atan: value });
  };

  /**
   * The `BitAnd` function returns the bit to the result if the bit exists in all numbers. The arguments must be numbers,
   * nd fractional values are truncated before the operation is applied. The result is the bitwise AND of all the arguments.
   * @param values Numbers to bitwise AND.
   * @returns A number which is the bitwise AND of all supplied `values`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/bitand
   */
  BitAnd = (...values: number[]) => {
    if (values.length === 1) {
      return new Expression({ bitand: values[0] });
    }

    return new Expression({ bitand: values });
  };

  /**
   * The `BitNot` function returns the Two’s Complement of a number. The argument must be a number, and fractional values are
   * truncated before the operation is applied.
   * @param value A single value to take the two’s complement.
   * @returns A number which is the two’s complement of the `value`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/bitnot
   */
  BitNot = (value: number) => {
    return new Expression({ bitnot: value });
  };

  /**
   * The `BitOr` function returns the bit in the result if the bit exists in any argument. The arguments must be numbers, and the
   * fractional portion is truncated before the or operation is applied. The result is the bitwise OR of all the arguments.
   * @param values One or more numbers to bitwise OR.
   * @returns A number which is the bitwise OR of all supplied `values`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/bitor
   */
  BitOr = (...values: number[]) => {
    if (values.length === 1) {
      return new Expression({ bitor: values[0] });
    }

    return new Expression({ bitor: values });
  };

  /**
   * The `BitXor` function returns the bit in the result if the bit exists in only one argument. The arguments must be numbers,
   * and the fractional portion is truncated before the XOR operation is applied. The result is the bitwise exclusive OR of
   * all of the arguments.
   * @param values One or more numbers to bitwise exclusive OR.
   * @returns A number which is the bitwise exclusive OR of all supplied `values`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/bitxor
   */
  BitXor = (...values: number[]) => {
    if (values.length === 1) {
      return new Expression({ bitxor: values[0] });
    }

    return new Expression({ bitxor: values });
  };

  /**
   * The `Call` function executes a user-defined function previously defined with the `CreateFunction` function.
   * @param fn The name, or Reference, of the function to call. A function reference can be acquired using the
   * `Function` function.
   * @param args The arguments for the function.
   * @returns The result returned by evaluation of the function with the given arguments.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/call
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
   * The `Casefold` function returns a normalized string. When strings are transformed into their normalized forms,
   * canonical-equivalent strings have precisely the same binary representation.
   * Then, a binary comparison function such as `equals` can compare two strings for case-insensitive matching.
   * @param value A string to normalize.
   * @param normalizer Optional - The name of the normalizer method to use. Must be one of "NFKCCaseFold", "NFC",
   * "NFD", "NFKC", or "NFKD". Defaults to "NFKCCaseFold".
   * @returns A string value.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/casefold
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
   * The `Ceil` function returns a value that is greater than or equal to the value argument and is equal to the nearest mathematical integer.
   * @param value The "ceiling" of this value.
   * @returns A number which is the ceiling of `value`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/ceil
   */
  Ceil = (value: number) => {
    return new Expression({
      ceil: value,
    });
  };

  /**
   * The `Collection` function returns a valid Reference for the specified collection `name`, in the specified child `database`.
   * If a child `database` is not specified, the returned collection reference belongs to the current database.
   * @param name The name of a collection.
   * @param database The reference to a child `database` acquired using the `Database` function.
   * @returns A Reference to a collection with the specified `name`, in the specified child `database` (or the current database if
   * `database` is not specified).
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/collection
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
   * The `Collections` function, when executed with Paginate, returns an Array of References for all collections in the specified child `database`.
   * If a child `database` is not specified, the returned collection references all belong to the current database.
   * @param database The reference to a child `database` acquired using the `Database` function.
   * @returns A Set Reference for the available collections in the specified child `database` (or the current database if `database` is not specified).
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/collections
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
   * The `Concat` function returns a string which has joined a list of strings into a single string.
   * @param value An array of strings to join.
   * @param separator This value is placed between each joined string. Default is an empty string ("").
   * @returns A string value.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/concat
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
   * The `ContainsField` function returns `true` if the specified `field` exists within the result of the
   * `value` expression, or `false` otherwise.
   * @param field The name of a field.
   * @param value A value of any type..
   * @returns A boolean value indicates whether `field` exists within `object`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/containsfield
   */
  ContainsField = (field: string, value: unknown) => {
    return new Expression({
      contains_field: field,
      in: wrap(value),
    });
  };

  /**
   * The `ContainsPath` function returns `true` if the specified `path` exists within the result of the `value` expression,
   * or `false` otherwise.
   * @param path A path to a specified field or array entry within the `value`.
   * @param value A value of any type.
   * @returns A boolean value.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/containspath
   */
  ContainsPath = (path: (string | number)[], value: unknown) => {
    return new Expression({
      contains_path: path,
      in: wrap(value),
    });
  };

  /**
   * The `ContainsStr` function returns `true` when the `value` string contains the `search` string, or `false` when it does not.
   * @param value The string to compare.
   * @param search The string to search for within `value`.
   * @returns Returns a boolean: `true` when `value` contains `search`, or `false` when it does not.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/containsstr
   */
  ContainsStr = (value: string, search: string) => {
    return new Expression({
      containsstr: value,
      search,
    });
  };

  /**
   * The `ContainsStrRegex` function returns `true` when the `value` string matches the `pattern` regular expression, or false
   * when it does not.
   * @param value The string to compare.
   * @param pattern The regular expression to match within value.
   * @returns Returns a boolean: `true` when `value` matches the `pattern` regular expression, or `false` when it does not.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/containsstrregex
   */
  ContainsStrRegex = (value: string, pattern: string) => {
    return new Expression({
      containsstrregex: value,
      pattern,
    });
  };

  /**
   * The `ContainsValue` function returns `true` if the specified `value` exists within the result of the `inValue` expression,
   * or false otherwise.
   * @param value A value of any type.
   * @param inValue A value of any type.
   * @returns A boolean value that indicates whether `value` exists within `inValue`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/containsvalue
   */
  ContainsValue = (value: unknown, inValue: unknown) => {
    return new Expression({
      contains_value: wrap(value),
      in: wrap(inValue),
    });
  };

  /**
   * The `Cos` function is a trigonometric function which calculates ratios of the lengths of the sides of right triangles.
   * `Cos` returns the cosine of a number.
   * @param value The number whose cosine should be returned.
   * @returns A number which is the cosine of `value`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/cos
   */
  Cos = (value: number) => {
    return new Expression({
      cos: value,
    });
  };

  /**
   * The `Cosh` function is a trigonometric function which calculates ratios of the lengths of the sides of right triangles.
   * `Cosh` returns the hyperbolic cosine of a number.
   * @param value The number whose hyperbolic cosine should be returned.
   * @returns A number which is the hyperbolic cosine of `value`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/cosh
   */
  Cosh = (value: number) => {
    return new Expression({
      cosh: value,
    });
  };

  /**
   * The `Count` function returns the number of items that exist in `arrayOrSet`, which is an Array, Page, or Set.
   * @param arrayOrSet The Array, Page, or Set that should have its items counted.
   * @returns The number of items in arrayOrSet.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/count
   */
  Count = (arrayOrSet: unknown[] | Expression) => {
    return new Expression({
      count: wrap(arrayOrSet),
    });
  };

  /**
   * The `Create` function adds a new document to a collection. The `collection` parameter indicates in what collection
   * the document should be created, while `params` contains the document data and optional metadata.
   * @param collection The name, or Reference, of the collection that should contain the new document. A collection
   * Reference can be acquired using the `Collection` function.
   * @param params The document data and optional metadata.
   * @returns A document containing both the data and metadata about the results of the operations.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/create
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
   * CreateAccessProvider creates a new AccessProvider document, based on the settings in `params`, which can be used to control access to the
   * current database via a third-party identity provider (IdP), such as Auth0.
   * @param params The settings.
   * @returns An object containing the metadata about the results of `CreateAccessProvider` operation.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/createaccessprovider
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
   * The `CreateCollection` function is used to create a collection that groups documents. Once the collection has been
   * created, it is possible to create documents within the collection. You cannot create a collection and insert documents
   * into that collection in the same transaction.
   * @param params The settings.
   * @returns An object containing the fields returned by the `CreateCollection` function:
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/createcollection
   */
  CreateCollection = (
    params: CreateCollectionParams<TSchema, keyof TSchema['Collections']>
  ) => {
    return new Expression({
      create_collection: wrap(params),
    });
  };

  /**
   * The `CreateDatabase` function adds a new child database in the current database with the specified parameters. It requires an admin key.
   * @param params The settings.
   * @returns An object containing the metadata of `CreateDatabase` operations.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/createdatabase
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

  CreateFunction = () => {
    // TODO
  };

  /**
   * The `Database` function returns a valid Reference for the specified child database `name`, within the specified child `database`.
   * If a child `database` is not specified, the returned database reference belongs to the current database.
   * @param name The name of a database.
   * @param database The reference to a child `database` acquired using the `Database` function.
   * @returns A reference to a child database with the specified `name`, in the specified child `database` (or the current database
   * if `database` is not specified).
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/database
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
   * The `Function` function returns a Reference for the specified function `name` in the specified child `database`.
   * If a child `database` is not specified, the returned function reference belongs to the current database.
   * @param name The name of a function.
   * @param database The reference to a child `database` acquired using the `Database` function.
   * @returns A reference to a function with the specified `name`, in the specified child `database` (or the current database
   * if `database` is not specified).
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/function
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
   * The `Lambda` function is an anonymous function that performs lazy execution of custom code. It allows you to organize and execute
   * almost any of the Fauna Query Language statements.
   * @param params A single string, or an array of zero or more strings.
   * @param expression An FQL expression to be evaluated.
   * @returns The evaluation of the expression.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/lambda
   */
  Lambda = (
    params: string | string[],
    expression: unknown
  ): Expression<LambdaReturnType> => {
    return new Expression({
      lambda: params,
      expression: wrap(expression),
    });
  };

  /**
   * The `Let` function binds one or more variables to a single value or expression. When multiple variables are defined,
   * the evaluation is from left to right. Variables which have previously been defined may be used to define future variables.
   * Variables are lexically scoped to the expression passed via the expression parameter. The value of a variable can be
   * referenced with `Var` syntax.
   * @param variables The variables to define.
   * @param expression The expression in which the variables are defined.
   * @returns The evaluation of the `expression` argument.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/let
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
   * The `Now` function constructs a timestamp representing the transaction’s start time.
   * @returns A timestamp which represents the transaction’s start time.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/now
   */
  Now = (): Expression<Timestamp> => {
    return new Expression({ now: null });
  };

  /**
   * The `Query` function wraps the provided `Lambda` function, preventing immediate execution, and making the
   * function available for use in index bindings, `CreateFunction`, and ABAC predicates.
   * @param lambda The `Lambda` function to wrap.
   * @returns The wrapped query.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/query
   */
  Query = (
    lambda: Expression<LambdaReturnType>
  ): Expression<QueryReturnType> => {
    return new Expression({ query: lambda });
  };

  /**
   * The `Role` function returns a Reference for the specified user-defined role’s `name` in the specified child `database`.
   * If a child `database` is not specified, the role returned belongs to the current database.
   * @param name The name of a role.
   * @param database The reference to a child `database` acquired using the `Database` function.
   * @returns A Reference to a user-defined role with the specified `name`, in the specified child `database` (or the current
   * database if `database` is not specified).
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/role
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
   * The `Time` function constructs a Timestamp, either from the string `now`, or from an ISO 8601 string.
   * @param str The string `now`, or an ISO 8601 date/time formatted string.
   * @returns A timestamp based on the value of `str`.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/time
   */
  Time = (str: string): Expression<Timestamp> => {
    return new Expression({ time: str });
  };

  /**
   * The `Var` statement evaluates and returns the value stored in a named variable. The Var statement can only be used inside
   * other statements, such as `Let` or `Lambda`.
   * @param name The name of the variable whose value should be returned.
   * @returns The value stored in the variable identified by name.
   * @docs https://docs.fauna.com/fauna/current/api/fql/functions/var
   */
  Var = (name: keyof TVariables) => {
    return new Expression({
      var: name,
    });
  };
}

export { Query, QuerySchema, QueryVariables };
