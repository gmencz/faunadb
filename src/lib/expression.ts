const wrapValues = (obj: Record<string, unknown> | null) => {
  if (obj !== null) {
    const rv: Record<string, unknown> = {};

    Object.keys(obj).forEach(function(key) {
      rv[key] = wrap(obj[key]);
    });

    return rv;
  } else {
    return null;
  }
};

const wrap = (obj: unknown): unknown => {
  if (obj === null) {
    return null;
  } else if (obj instanceof Expression) {
    return obj;
  } else if (Array.isArray(obj)) {
    return new Expression(obj.map(el => wrap(el)));
  } else if (typeof obj === 'object') {
    return new Expression({
      object: wrapValues(obj as Record<string, unknown> | null),
    });
  } else {
    return obj;
  }
};

class Expression<T = unknown> {
  private raw: T;

  // @ts-expect-error because it-s a private field and we're using it nowhere.
  // It's used for TypeScript things.
  private _isFaunaExpression = true;

  constructor(raw: T) {
    this.raw = raw;
  }

  // @ts-expect-error because it's a private field and we're using it nowhere.
  // It's a function used by JSON serializers, not for the user to define
  // which is why it must be private.
  private toJSON = () => {
    return this.raw;
  };
}

export { Expression, wrap, wrapValues };
