import { bootstrapLocal } from './app/bootstrap';

bootstrapLocal().catch((error) => {
  console.error(error);
  process.exit(1);
});
