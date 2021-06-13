import nock from "nock";

import { FootballDataResponseFactory } from "@and-digital/factories";
import { logger } from '../logger';
import { getConfig } from "../config";

import { createClient } from './football-data';

describe('Football Data Client', () => {
  const config = getConfig();

  afterEach(() => {
    nock.cleanAll();
    jest.restoreAllMocks();
  });

  it('Should log request metadata', async () => {
    const footballDataResponse = FootballDataResponseFactory.build();

    nock(config.footballApiBaseUrl)
      .get('/teams')
      .reply(200, footballDataResponse);

    const logSpy = jest.spyOn(logger, 'info');
    const client = createClient(logger);

    await client.get('/teams');

    const requestLog: any = logSpy.mock.calls[0][0];
    const responseLog: any = logSpy.mock.calls[1][0];

    expect(requestLog.msg).toBe('Sending request to football-data');
    expect(requestLog.request.url).toBe(`${config.footballApiBaseUrl}/teams`);
    expect(requestLog.request.method).toBe('get');

    expect(responseLog.msg).toBe('Recieved response from football-data');
    expect(responseLog.response.status).toBe(200);
    logSpy.mockRestore();
  });

  it('Should log error if request fails', async () => {
    nock(config.footballApiBaseUrl)
      .get('/teams')
      .reply(500);

    const logSpy = jest.spyOn(logger, 'error');
    const client = createClient(logger);

    await expect(client.get('/teams')).rejects.toThrow('Request failed with status code 500');

    const responseLog: any = logSpy.mock.calls[0][0];

    expect(responseLog.msg).toBe('Error response from football-data');
    expect(responseLog.error).toStrictEqual({
      message: 'Request failed with status code 500',
      stack: expect.any(String)
    })
    expect(responseLog.response.status).toBe(500);
    logSpy.mockRestore()
  });
});