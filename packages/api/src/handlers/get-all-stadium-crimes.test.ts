import nock from 'nock';
import request from 'supertest';

import { getConfig } from '../config';
import { createApp } from '../app';
import * as externalServices from '../lib/external-services';

import {
  FootballDataResponseFactory,
  CrimeLookupCrimeFactory,
  PostcodeLookupFactory
} from '@and-digital/factories';


describe('Get All Stadium Crimes Tests', () => {
  const config = getConfig();
  const app = createApp();
  const path = '/stadiums';

  afterEach(() => {
    nock.cleanAll();
    jest.resetAllMocks();
  })

  it('should successfully return stadium and related crimes', async () => {
    const footballDataResponse = FootballDataResponseFactory.build();
    const postcodeResponse = PostcodeLookupFactory.build();
    const crimeResponses = CrimeLookupCrimeFactory.buildList(3);

    nock(config.footballApiBaseUrl)
      .get(/\/teams/)
      .reply(200, footballDataResponse);

    nock(config.postcodeLookupUrl)
      .get(/\/postcodes\/*/)
      .reply(200, postcodeResponse);

    nock(config.crimeLookupUrl)
      .get(/\/crimes-at-location\/*/)
      .reply(200, crimeResponses);

    const response = await request(app)
      .get(path)

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([
      {
        ...footballDataResponse.teams[0],
        crimes: crimeResponses
      }
    ])
  })

  it('should successfully return multiple stadium and related crimes', async () => {
    const numberOfTeams = 2;
    const footballDataResponse = FootballDataResponseFactory.withMultipleTeams(numberOfTeams).build();
    const postcodeResponses = PostcodeLookupFactory.buildList(numberOfTeams);
    const crimeResponses = CrimeLookupCrimeFactory.buildList(3);

    nock(config.footballApiBaseUrl)
      .get(/\/teams/)
      .reply(200, footballDataResponse);

    nock(config.postcodeLookupUrl)
      .get(/\/postcodes\/*/)
      .reply(200, postcodeResponses[0]);

    nock(config.postcodeLookupUrl)
      .get(/\/postcodes\/*/)
      .reply(200, postcodeResponses[1]);

    nock(config.crimeLookupUrl)
      .get(/\/crimes-at-location\/*/)
      .reply(200, crimeResponses);

    nock(config.crimeLookupUrl)
      .get(/\/crimes-at-location\/*/)
      .reply(200, []);

    const response = await request(app)
      .get(path)

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([
      {
        ...footballDataResponse.teams[0],
        crimes: crimeResponses
      },
      {
        ...footballDataResponse.teams[1],
        crimes: [],
      }
    ])
  })

  it('should return 500 if fail to get all teams', async () => {
    const getAllTeamsMock = jest.spyOn(externalServices, 'getAllTeams');
    getAllTeamsMock.mockResolvedValue([]);

    const response = await request(app)
      .get(path)

    expect(response.status).toBe(500);
    expect(response.body).toStrictEqual({
      message: 'Failed to get all stadium crimes'
    })
  })
});
