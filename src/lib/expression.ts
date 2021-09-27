const wrapValues = (obj: Record<string, unknown>) => {
  const rv: Record<string, unknown> = {};

  Object.keys(obj).forEach(function (key) {
    rv[key] = wrap(obj[key]);
  });

  return rv;
};

const wrap = (obj: unknown): unknown => {
  if (obj === null) {
    return null;
  } else if (obj instanceof Expression) {
    return obj;
  } else if (Array.isArray(obj)) {
    return new Expression(obj.map((el) => wrap(el)));
  } else if (typeof obj === 'object') {
    return new Expression({
      object: wrapValues(obj as Record<string, unknown>),
    });
  } else {
    return obj;
  }
};

class Expression<T = unknown> {
  private raw: T;

  // @ts-expect-error because it-s a private field and we're using it nowhere.
  // It's used for TypeScript things.
  private static _isFaunaExpression = true;

  constructor(raw: T) {
    this.raw = raw;
  }

  // @ts-ignore
  private toJSON = () => {
    return this.raw;
  };
}

export { Expression, wrap, wrapValues };
