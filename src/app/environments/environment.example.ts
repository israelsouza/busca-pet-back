import { type Environment } from './environment.interface';

/**
 * Template for environment files.
 *
 * Copy this file and rename it to the target environment:
 *   - environment.homolog.ts
 *   - environment.prod.ts
 */
export const environment: Environment = {
  services: {
    authorization: 'https://<your-domain>/api/v1/authorization',
    users: 'https://<your-domain>/api/v1/users',
  },
};
