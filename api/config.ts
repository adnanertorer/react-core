// api/config.ts
import type { ApiConfig } from "./ApiConfig";

let config: ApiConfig;

export const setApiConfig = (conf: ApiConfig) => {
  config = conf;
};

export const getApiConfig = (): ApiConfig => {
  if (!config) {
    throw new Error("ApiConfig has not been set. Call setApiConfig() first.");
  }
  return config;
};
