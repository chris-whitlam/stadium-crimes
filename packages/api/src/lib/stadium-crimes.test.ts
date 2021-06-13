import { getStadiumCrimes } from './stadium-crimes';
import { createClient as createPostcodeLookupClient } from '../clients/postcode-lookup'
import { createClient as createCrimeLookupClient } from '../clients/crime-lookup'
import { CrimeLookupCrimeFactory, FootballDataTeamFactory } from '../../../factories';
import * as externalServices from './external-services';

describe('Stadium Crimes Library Tests', () => {
  const postcodeLookupClient = createPostcodeLookupClient()
  const crimeLookupClient = createCrimeLookupClient()

  afterEach(jest.resetAllMocks)

  it('should return crimes given an array of teams', async () => {
    const teams = FootballDataTeamFactory.buildList(1);
    const crimesMockValues = CrimeLookupCrimeFactory.buildList(2);

    const mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: () => mockLogger
    } as any;

    const getGeographicalLocationSpy = jest.spyOn(externalServices, 'getGeographicalLocationByPostcode');
    getGeographicalLocationSpy.mockResolvedValue({
      latitude: 1,
      longitude: 1
    })

    const getCrimesSpy = jest.spyOn(externalServices, 'getCrimesByGeographicalLocation');
    getCrimesSpy.mockResolvedValue(crimesMockValues)

    const stadiumCrimes = await getStadiumCrimes(
      postcodeLookupClient,
      crimeLookupClient,
      teams,
      mockLogger
    )

    expect(stadiumCrimes).toStrictEqual([
      {
        ...teams[0],
        crimes: crimesMockValues
      }
    ])
    getGeographicalLocationSpy.mockRestore();
    getCrimesSpy.mockRestore();
  });

  it('should return skip team if fail to determine postcode from address', async () => {
    const teams = FootballDataTeamFactory.buildList(2);
    const crimesMockValues = CrimeLookupCrimeFactory.buildList(2);

    teams[0].address = 'No Postcode'

    const mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: () => mockLogger
    } as any;

    const getGeographicalLocationSpy = jest.spyOn(externalServices, 'getGeographicalLocationByPostcode');
    getGeographicalLocationSpy.mockResolvedValueOnce({
      latitude: 1,
      longitude: 1
    })

    const getCrimesSpy = jest.spyOn(externalServices, 'getCrimesByGeographicalLocation');
    getCrimesSpy.mockResolvedValue(crimesMockValues);

    const stadiumCrimes = await getStadiumCrimes(
      postcodeLookupClient,
      crimeLookupClient,
      teams,
      mockLogger
    )

    expect(stadiumCrimes.length).toBe(1);
    expect(stadiumCrimes).toStrictEqual([
      {
        ...teams[1],
        crimes: crimesMockValues
      }
    ])
    getGeographicalLocationSpy.mockRestore();
    getCrimesSpy.mockRestore();
  });

  it('should return skip team if fail to get geographic location', async () => {
    const teams = FootballDataTeamFactory.buildList(2);
    const crimesMockValues = CrimeLookupCrimeFactory.buildList(2);

    const mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: () => mockLogger
    } as any;

    const getGeographicalLocationSpy = jest.spyOn(externalServices, 'getGeographicalLocationByPostcode');
    getGeographicalLocationSpy.mockImplementationOnce(() => {
      throw new Error();
    }).mockResolvedValueOnce({
      latitude: 1,
      longitude: 1
    })

    const getCrimesSpy = jest.spyOn(externalServices, 'getCrimesByGeographicalLocation');
    getCrimesSpy.mockResolvedValue(crimesMockValues);

    const stadiumCrimes = await getStadiumCrimes(
      postcodeLookupClient,
      crimeLookupClient,
      teams,
      mockLogger
    )

    expect(stadiumCrimes.length).toBe(1);
    expect(stadiumCrimes).toStrictEqual([
      {
        ...teams[1],
        crimes: crimesMockValues
      }
    ])
    getGeographicalLocationSpy.mockRestore();
    getCrimesSpy.mockRestore();
  });

  it('should return skip team if fail to get crime data', async () => {
    const teams = FootballDataTeamFactory.buildList(2);
    const crimesMockValues = CrimeLookupCrimeFactory.buildList(2);

    const mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: () => mockLogger
    } as any;

    const getGeographicalLocationSpy = jest.spyOn(externalServices, 'getGeographicalLocationByPostcode');
    getGeographicalLocationSpy.mockResolvedValue({
      latitude: 1,
      longitude: 1
    })

    const getCrimesSpy = jest.spyOn(externalServices, 'getCrimesByGeographicalLocation');
    getCrimesSpy.mockImplementationOnce(() => {
      throw new Error();
    }).mockResolvedValue(crimesMockValues)

    const stadiumCrimes = await getStadiumCrimes(
      postcodeLookupClient,
      crimeLookupClient,
      teams,
      mockLogger
    )

    expect(stadiumCrimes.length).toBe(1);
    expect(stadiumCrimes).toStrictEqual([
      {
        ...teams[1],
        crimes: crimesMockValues
      }
    ])
    getGeographicalLocationSpy.mockRestore();
    getCrimesSpy.mockRestore();
  });
});