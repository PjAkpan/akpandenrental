
    
  export type FetcherConfig = {
    method: string;
    url: string;
    data?: Record<string, unknown>;
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
    timeout?: number;
    headers?: Record<string, string>;
    onError?: (error: unknown) => void;
  };
