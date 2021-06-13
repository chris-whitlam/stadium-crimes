import axios from 'axios';
import { getConfig } from '../config';
import { Logger, logger } from '../logger';

export const createClient = (log: Logger = logger) => {
  const {
    postcodeLookupUrl,
  } = getConfig()

  const client = axios.create({
    baseURL: postcodeLookupUrl,
    timeout: 29000,
  });

  client.interceptors.request.use(req => {
    log.info({
      msg: 'Sending request to postcode lookup',
      request: {
        url: `${req.baseURL}${req.url}`,
        method: req.method
      }
    });

    return req;
  });

  client.interceptors.response.use(res => {
    log.info({
      msg: 'Recieved response from postcode lookup',
      response: {
        url: `${res.config.baseURL}${res.config.url}`,
        method: res.request.method,
        status: res.status
      }
    });
    return res;
  }, error => {
    log.error({
      msg: 'Error response from postcode lookup',
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