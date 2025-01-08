/**
 * Environment utility functions and constants
 */

export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
} as const;

export type Environment = (typeof ENV)[keyof typeof ENV];

const validateEnvironment = (env: string | undefined): env is Environment => {
  return Object.values(ENV).includes(env as Environment);
};

const getEnvironment = (): Environment => {
  const env = process.env.NODE_ENV;
  if (!validateEnvironment(env)) {
    throw new Error(`Invalid NODE_ENV: ${env}`);
  }
  return env;
};

export const isDevelopment = (): boolean =>
  getEnvironment() === ENV.DEVELOPMENT;
export const isProduction = (): boolean => getEnvironment() === ENV.PRODUCTION;
export const isTest = (): boolean => getEnvironment() === ENV.TEST;
