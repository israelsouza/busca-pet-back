import { type Environment } from './environment.interface';

const base = process.env.API_BASE_URL ?? 'http://localhost:3000/api';

export const environment: Environment = {
  services: {
    authorization: base + '/v1/authorization',
    users: base + '/v1/users',
  },
};
