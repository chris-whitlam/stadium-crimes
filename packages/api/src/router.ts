import { Router } from 'express';

import { handler as getAllStadiumCrimes } from './handlers/get-all-stadium-crimes';

import { handler as getHealthCheck } from './handlers/get-health-check';

export const getRouter = (): Router => {
  const router = Router();

  router.get('/health-check', getHealthCheck);

  router.get('/stadiums', getAllStadiumCrimes);

  return router;
}