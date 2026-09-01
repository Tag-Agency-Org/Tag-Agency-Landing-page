interface D1QueryResult<T = unknown> {
  success: boolean;
  results: T[];
}

interface D1RunResult {
  success: boolean;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1RunResult>;
  all<T = unknown>(): Promise<D1QueryResult<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface CloudflareEnv {
  LEADS_DB: D1Database;
  LEADS_ADMIN_USERNAME?: string;
  LEADS_ADMIN_PASSWORD?: string;
  LEADS_ADMIN_SESSION_SECRET?: string;
}
