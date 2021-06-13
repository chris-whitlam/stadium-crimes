import pino from 'pino';
export { Logger } from 'pino';

export const config: pino.LoggerOptions = {
  prettyPrint: process.env.NODE_ENV === 'development',
  base: null
};

export const logger = pino(config);