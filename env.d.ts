declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GH_API_BASE_URL: string;
      GH_RAW_BASE_URL: string;
      GH_TOKEN: string;
      NEXT_PUBLIC_GH_RAW_BASE_URL: string;
      NEXT_PUBLIC_GH_DATASET_URL: string;
      NEXT_PUBLIC_BMAC_URL: string;
    }
  }
}
export {};
