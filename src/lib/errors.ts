class QueryError extends Error {
  constructor(
    public code: string,
    public description: string,
    public rawErrors: {
      code: string;
      description: string;
      position: string[];
    }[]
  ) {
    super(description);
    this.name = 'QueryError';
  }
}

export { QueryError };
