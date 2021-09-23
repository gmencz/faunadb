const wrapValues = (obj: Record<string, unknown>) => {
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
      object: wrapValues(obj as Record<string, unknown>),
    });
  } else {
    return obj;
  }
};

class Expression<T = unknown> {
  private raw: T;

  constructor(raw: T) {
    this.raw = raw;
  }

  toJSON = () => {
    return this.raw;
  };
}

export { Expression, wrap, wrapValues };
