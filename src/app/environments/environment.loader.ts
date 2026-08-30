import { type Environment } from './environment.interface';

const loadEnvironment = (): Environment => {
  const env = process.env.NODE_ENV ?? 'dev';

  const loaders: Record<string, () => Environment> = {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    dev: () => (require('./environment.dev') as { environment: Environment }).environment,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    test: () => (require('./environment.dev') as { environment: Environment }).environment,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    homolog: () => (require('./environment.homolog') as { environment: Environment }).environment,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    prod: () => (require('./environment.prod') as { environment: Environment }).environment,
  };

  const loader = loaders[env];

  if (!loader) {
    throw new Error(`[Environment] Unknown NODE_ENV="${env}".`);
  }

  return loader();
};

export const environment: Environment = loadEnvironment();
