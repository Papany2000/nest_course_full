export interface AppConfig {
  database: {
    host: string;
    user: string;
    port: number;
    password: string;
    database: string;
  };
  api: {
    port: number;
  };
  jwt: {
    secret: string;
    expiration: string;
  };
}
