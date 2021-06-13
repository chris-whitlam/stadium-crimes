import { FootballDataResponseFactory, FootballDataTeamFactory } from './football-data'

describe('Football Data Response Factory Tests', () => {
  it('should return response with one team', () => {
    const footballDataResponse = FootballDataResponseFactory.build();

    expect(footballDataResponse).toEqual({
      count: 1,
      filters: {
        areas: [
          expect.any(Number),
        ],
        permission: 'TIER_ONE',
      },
      teams: [
        {
          address: expect.any(String),
          area: {
            id: expect.any(Number),
            name: expect.any(String),
          },
          clubColors: expect.any(String),
          crestUrl: 'http://placeimg.com/640/480',
          email: expect.any(String),
          founded: expect.any(Number),
          id: expect.any(Number),
          lastUpdated: expect.any(String),
          name: expect.any(String),
          phone: expect.any(String),
          shortName: expect.any(String),
          tla: expect.any(String),
          venue: expect.any(String),
          website: expect.any(String),
        },
      ],
    });
  });

  it('should return response with multiple teams', () => {
    const footballDataResponse = FootballDataResponseFactory.withMultipleTeams(2).build();

    expect(footballDataResponse).toEqual({
      count: 2,
      filters: {
        areas: [
          expect.any(Number),
        ],
        permission: 'TIER_ONE',
      },
      teams: [
        {
          address: expect.any(String),
          area: {
            id: expect.any(Number),
            name: expect.any(String),
          },
          clubColors: expect.any(String),
          crestUrl: 'http://placeimg.com/640/480',
          email: expect.any(String),
          founded: expect.any(Number),
          id: expect.any(Number),
          lastUpdated: expect.any(String),
          name: expect.any(String),
          phone: expect.any(String),
          shortName: expect.any(String),
          tla: expect.any(String),
          venue: expect.any(String),
          website: expect.any(String),
        },
        {
          address: expect.any(String),
          area: {
            id: expect.any(Number),
            name: expect.any(String),
          },
          clubColors: expect.any(String),
          crestUrl: 'http://placeimg.com/640/480',
          email: expect.any(String),
          founded: expect.any(Number),
          id: expect.any(Number),
          lastUpdated: expect.any(String),
          name: expect.any(String),
          phone: expect.any(String),
          shortName: expect.any(String),
          tla: expect.any(String),
          venue: expect.any(String),
          website: expect.any(String),
        },
      ],
    });
  });
});

describe('Football Data Team Factory Tests', () => {
  it('should return team', () => {
    const footballTeam = FootballDataTeamFactory.build();

    expect(footballTeam).toEqual({
      address: expect.any(String),
      area: {
        id: expect.any(Number),
        name: expect.any(String),
      },
      clubColors: expect.any(String),
      crestUrl: 'http://placeimg.com/640/480',
      email: expect.any(String),
      founded: expect.any(Number),
      id: expect.any(Number),
      lastUpdated: expect.any(String),
      name: expect.any(String),
      phone: expect.any(String),
      shortName: expect.any(String),
      tla: expect.any(String),
      venue: expect.any(String),
      website: expect.any(String),
    });
  });
});