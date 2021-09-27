export {};

declare global {
  interface Env {
    FAUNADB_KEY_SECRET: string;
  }

  interface WebSocket {
    accept(): void;
  }

  class WebSocketPair {
    public 0: WebSocket;
    public 1: WebSocket;
  }

  interface ResponseInit {
    webSocket?: WebSocket;
  }

  interface DurableObjectState {
    blockConcurrencyWhile: (fn: () => Promise<void>) => void;
  }

  interface Response {
    webSocket?: WebSocket;
  }

  class DurableObject {
    constructor(state: DurableObjectState, env: Env);
    fetch: (request: Request) => Promise<Response>;
  }
}
