import nock from "nock";

import { PostcodeLookupFactory } from "@and-digital/factories";
import { logger } from '../logger';
import { getConfig } from "../config";

import { createClient } from './postcode-lookup';

describe('Postcode Lookup Client', () => {
  const config = getConfig();

  afterEach(() => {
    nock.cleanAll();
    jest.resetAllMocks()
  });

  it('Should log request metadata', async () => {
    const postcodeLookupResponse = PostcodeLookupFactory.build();

    nock(config.postcodeLookupUrl)
      .get('/postcodes/LS12%201DF')
      .reply(200, postcodeLookupResponse);

    const logSpy = jest.spyOn(logger, 'info');
    const client = createClient(logger);

    await client.get('/postcodes/LS12%201DF');

    const requestLog: any = logSpy.mock.calls[0][0];
    const responseLog: any = logSpy.mock.calls[1][0];

    expect(requestLog.msg).toBe('Sending request to postcode lookup');
    expect(requestLog.request.url).toBe(`${config.postcodeLookupUrl}/postcodes/LS12%201DF`);
    expect(requestLog.request.method).toBe('get');

    expect(responseLog.msg).toBe('Recieved response from postcode lookup');
    expect(responseLog.response.status).toBe(200);
    logSpy.mockRestore();
  });

  it('Should log error if request fails', async () => {
    nock(config.postcodeLookupUrl)
      .get('/postcodes/LS12%201DF')
      .reply(500);

    const logSpy = jest.spyOn(logger, 'error');
    const client = createClient(logger);

    await expect(client.get('/postcodes/LS12%201DF')).rejects.toThrow('Request failed with status code 500');

    const responseLog: any = logSpy.mock.calls[0][0];

    expect(responseLog.msg).toBe('Error response from postcode lookup');
    expect(responseLog.error).toStrictEqual({
      message: 'Request failed with status code 500',
      stack: expect.any(String)
    })
    expect(responseLog.response.status).toBe(500);
    logSpy.mockRestore()
  });
});