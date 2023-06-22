declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TIMEZONE: string;
    }
  }
}
export {};
