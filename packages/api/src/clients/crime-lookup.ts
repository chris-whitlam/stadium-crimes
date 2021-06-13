import axios from 'axios';
import { getConfig } from '../config';
import { Logger, logger } from '../logger';
import * as rax from 'retry-axios';
import { setupCache } from 'axios-cache-adapter'

export const createClient = (log: Logger = logger, maxRetryAttempts = 5, retryDelay = 10000) => {
  const {
    crimeLookupUrl,
  } = getConfig()

  const cache = setupCache({
    maxAge: 15 * 60 * 1000
  })

  const client = axios.create({
    baseURL: crimeLookupUrl,
    timeout: 29000,
    adapter: cache.adapter
  });

  client.defaults.raxConfig = {
    instance: client,
    statusCodesToRetry: [[429, 429]],
    noResponseRetries: 0,
    retryDelay,
    backoffType: 'static',
    retry: maxRetryAttempts,
    onRetryAttempt: err => {
      const cfg = rax.getConfig(err);
      log.info({ msg: `Rate Limit Hit: Retry attempt #${cfg?.currentRetryAttempt}` });
    }
  }
  rax.attach(client);

  client.interceptors.request.use(req => {
    log.info({
      msg: 'Sending request to crime lookup',
      request: {
        url: `${req.baseURL}${req.url}`,
        method: req.method
      }
    });

    return req;
  });

  client.interceptors.response.use(res => {
    log.info({
      msg: 'Recieved response from crime lookup',
      response: {
        url: `${res.config.baseURL}${res.config.url}`,
        method: res.request.method,
        status: res.status
      }
    });
    return res;
  }, error => {
    log.error({
      msg: 'Error response from crime lookup',
      error: {
        message: error.message,
        stack: error.stack
      },
      response: (error.response ? {
        body: error.response.body,
        status: error.response.status
      } : {})
    });

    throw error;
  });

  return client;
}