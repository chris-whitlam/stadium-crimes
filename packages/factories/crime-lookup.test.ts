import { CrimeLookupCrimeFactory } from './crime-lookup'

describe('Crime Lookup Factory Tests', () => {
  it('should return base crime ', () => {
    const crimesResponse = CrimeLookupCrimeFactory.build();

    expect(crimesResponse).toEqual({
      category: 'violent-crime',
      context: '',
      id: expect.any(Number),
      location: {
        latitude: expect.any(String),
        longitude: expect.any(String),
        street: {
          id: expect.any(Number),
          name: 'On or near Sports/recreation Area',
        },
      },
      location_subtype: '',
      location_type: 'Force',
      month: expect.any(String),
      outcome_status: {
        category: 'Investigation complete; no suspect identified',
        date: expect.any(String),
      },
      persistent_id: 'dd351965612c0161a0e25f6db351885bcce0999d378b337a454f02017350a342',
    });
  });
});