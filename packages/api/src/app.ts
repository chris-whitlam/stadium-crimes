import express from 'express';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { getRouter } from './router';
import { Logger } from './logger';

// Used to extend the request context
declare module 'express' {
  export interface Request {
    startTime?: number;
    logger?: Logger;
  }
}

export const createApp = () => {
  const app = express();

  app.use(loggerMiddleware)
  app.use('/', getRouter())

  return app;
}