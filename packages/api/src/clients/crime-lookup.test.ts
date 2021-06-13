import nock from "nock";

import { CrimeLookupCrimeFactory } from "@and-digital/factories";
import { logger } from '../logger';
import { getConfig } from "../config";

import { createClient } from './crime-lookup';

describe('Crime Lookup Client', () => {
  const config = getConfig();

  afterEach(() => {
    nock.cleanAll();
    jest.restoreAllMocks();
  });

  it('Should log request metadata', async () => {
    const crimeLookupResponse = CrimeLookupCrimeFactory.build();

    nock(config.crimeLookupUrl)
      .get('/crimes-at-location')
      .reply(200, crimeLookupResponse);

    const logSpy = jest.spyOn(logger, 'info');
    const client = createClient(logger);

    await client.get('/crimes-at-location');

    const requestLog: any = logSpy.mock.calls[0][0];
    const responseLog: any = logSpy.mock.calls[1][0];

    expect(requestLog.msg).toBe('Sending request to crime lookup');
    expect(requestLog.request.url).toBe(`${config.crimeLookupUrl}/crimes-at-location`);
    expect(requestLog.request.method).toBe('get');

    expect(responseLog.msg).toBe('Recieved response from crime lookup');
    expect(responseLog.response.status).toBe(200);
    logSpy.mockRestore();
  });

  it('Should log error if request fails', async () => {
    nock(config.crimeLookupUrl)
      .get('/crimes-at-location')
      .reply(500);

    const logSpy = jest.spyOn(logger, 'error');
    const client = createClient(logger);

    await expect(client.get('/crimes-at-location')).rejects.toThrow('Request failed with status code 500');

    const responseLog: any = logSpy.mock.calls[0][0];

    expect(responseLog.msg).toBe('Error response from crime lookup');
    expect(responseLog.error).toStrictEqual({
      message: 'Request failed with status code 500',
      stack: expect.any(String)
    })
    expect(responseLog.response.status).toBe(500);
    logSpy.mockRestore()
  });

  it('Should retry if 429 is returned', async () => {
    jest.setTimeout(10000)
    const crimeLookupResponse = CrimeLookupCrimeFactory.build();

    nock(config.crimeLookupUrl)
      .get('/crimes-at-location')
      .reply(429);

    nock(config.crimeLookupUrl)
      .get('/crimes-at-location')
      .reply(200, crimeLookupResponse);

    const logSpy = jest.spyOn(logger, 'info');
    const client = createClient(logger, 1, 50);

    await client.get('/crimes-at-location');

    const firstRequestLog: any = logSpy.mock.calls[0][0];
    const rateLimitLog: any = logSpy.mock.calls[1][0];
    const secondRequestLog: any = logSpy.mock.calls[2][0];
    const responseLog: any = logSpy.mock.calls[3][0];

    expect(firstRequestLog.msg).toBe('Sending request to crime lookup');
    expect(firstRequestLog.request.url).toBe(`${config.crimeLookupUrl}/crimes-at-location`);
    expect(firstRequestLog.request.method).toBe('get');

    expect(rateLimitLog.msg).toBe('Rate Limit Hit: Retry attempt #1');

    expect(secondRequestLog.msg).toBe('Sending request to crime lookup');
    expect(secondRequestLog.request.url).toBe(`${config.crimeLookupUrl}/crimes-at-location`);
    expect(secondRequestLog.request.method).toBe('get');

    expect(responseLog.msg).toBe('Recieved response from crime lookup');
    expect(responseLog.response.status).toBe(200);

    logSpy.mockRestore()
  });
});