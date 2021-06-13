
import { createApp } from './app';
import { logger } from './logger';

const {
  VIRTUAL_PORT = 3000,
} = process.env;

const app = createApp();

app.listen(VIRTUAL_PORT, () => {
  logger.info('Server started');
});