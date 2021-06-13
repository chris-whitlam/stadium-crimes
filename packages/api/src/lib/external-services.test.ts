import nock from 'nock';

import { CrimeLookupCrimeFactory, FootballDataResponseFactory, PostcodeLookupFactory } from '@and-digital/factories';
import { getAllTeams, getGeographicalLocationByPostcode, getCrimesByGeographicalLocation } from './external-services';
import { getConfig } from '../config';
import { createClient as createFootballClient } from '../clients/football-data';
import { createClient as createPostcodeLookupClient } from '../clients/postcode-lookup';
import { createClient as createCrimeLookupClient } from '../clients/crime-lookup';
import { GeographicalLocation } from '../../../interfaces';

describe('External Services Library Tests', () => {
  const config = getConfig();

  afterEach(() => {
    nock.cleanAll();
    jest.resetAllMocks();
  })

  describe('Football Data Services', () => {
    it('should return all teams', async () => {
      const numberOfTeams = 3
      const footballDataResponse = FootballDataResponseFactory.withMultipleTeams(numberOfTeams).build();

      const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        child: () => mockLogger
      } as any;

      const footballDataClient = createFootballClient(mockLogger);

      nock(config.footballApiBaseUrl)
        .get(/\/teams/)
        .reply(200, footballDataResponse);

      const teams = await getAllTeams(footballDataClient, mockLogger);

      expect(teams).toStrictEqual(footballDataResponse.teams)

      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should throw error if fail to get all teams', async () => {
      const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        child: () => mockLogger
      } as any;

      const footballDataClient = createFootballClient(mockLogger);

      nock(config.footballApiBaseUrl)
        .get(/\/teams/)
        .reply(500);

      await expect(getAllTeams(footballDataClient, mockLogger)).rejects.toThrow('Request failed with status code 500');

      expect(mockLogger.error).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(expect.objectContaining({
        msg: 'Failed to retrieve all teams',
        error: 'Request failed with status code 500',
        stack: expect.any(String)
      }));
    });
  })

  describe('Postcode Services', () => {
    it('should return latitude and longitude given a postcode', async () => {
      const postcode = 'LS12 1DF';
      const postcodeLookupResponse = PostcodeLookupFactory.build();

      const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        child: () => mockLogger
      } as any;

      const postcodeLookupClient = createPostcodeLookupClient(mockLogger);

      nock(config.postcodeLookupUrl)
        .get(/\/postcodes\/*/)
        .reply(200, postcodeLookupResponse);

      const geographicalLocation = await getGeographicalLocationByPostcode(postcodeLookupClient, postcode, mockLogger);

      expect(geographicalLocation).toStrictEqual({
        latitude: postcodeLookupResponse.result.latitude,
        longitude: postcodeLookupResponse.result.longitude
      })

      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should throw error if fail to get postcode infomation', async () => {
      const postcode = 'LS12 1DF';
      const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        child: () => mockLogger
      } as any;

      const postcodeLookupClient = createPostcodeLookupClient(mockLogger);

      nock(config.postcodeLookupUrl)
        .get(/\/postcodes\/*/)
        .reply(500);

      await expect(getGeographicalLocationByPostcode(postcodeLookupClient, postcode, mockLogger)).rejects.toThrow('Request failed with status code 500');

      expect(mockLogger.error).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(expect.objectContaining({
        msg: 'Failed to retrieve geographical location from postcode',
        postcode,
        error: 'Request failed with status code 500',
        stack: expect.any(String)
      }));
    });
  })

  describe('Crime Services', () => {
    it('should return crimes given a geographical location', async () => {
      const geographicalLocation: GeographicalLocation = {
        latitude: 1,
        longitude: 1
      };
      const mockCrimes = CrimeLookupCrimeFactory.build();

      const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        child: () => mockLogger
      } as any;

      const crimeLookupClient = createCrimeLookupClient(mockLogger);

      nock(config.crimeLookupUrl)
        .get(/\/crimes-at-location\/*/)
        .reply(200, mockCrimes);

      const crimes = await getCrimesByGeographicalLocation(crimeLookupClient, geographicalLocation, mockLogger);

      expect(crimes).toStrictEqual(mockCrimes)

      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should throw error if fail to get postcode infomation', async () => {
      const geographicalLocation: GeographicalLocation = {
        latitude: 1,
        longitude: 1
      };

      const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        child: () => mockLogger
      } as any;

      const crimeLookupClient = createCrimeLookupClient(mockLogger);

      nock(config.crimeLookupUrl)
        .get(/\/crimes-at-location\/*/)
        .reply(500);

      await expect(getCrimesByGeographicalLocation(crimeLookupClient, geographicalLocation, mockLogger)).rejects.toThrow('Request failed with status code 500');

      expect(mockLogger.error).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(expect.objectContaining({
        msg: 'Failed to retrieve crimes from geographical location',
        geographicalLocation,
        error: 'Request failed with status code 500',
        stack: expect.any(String)
      }));
    });

    it('should return undefined if no geographical location passed to function', async () => {
      const geographicalLocation = undefined;

      const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        child: () => mockLogger
      } as any;

      const crimeLookupClient = createCrimeLookupClient(mockLogger);

      const result = await getCrimesByGeographicalLocation(crimeLookupClient, geographicalLocation, mockLogger)

      expect(result).toBeUndefined();
    });
  });
});