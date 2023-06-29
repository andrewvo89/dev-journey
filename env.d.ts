declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_TOKEN: string;
      GITHUB_API_BASE_URL: string;
      GITHUB_RAW_BASE_URL: string;
      NEXT_PUBLIC_GITHUB_RAW_BASE_URL: string;
    }
  }
}
export {};
