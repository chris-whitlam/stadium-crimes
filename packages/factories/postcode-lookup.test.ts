import { PostcodeLookupFactory } from './postcode-lookup'

describe('Postcode Lookup Factory Tests', () => {
  it('should return base postcode response ', () => {
    const postcodeLookupResponse = PostcodeLookupFactory.build();

    expect(postcodeLookupResponse).toEqual({
      result: {
        admin_county: null,
        admin_district: expect.any(String),
        admin_ward: expect.any(String),
        ccg: expect.any(String),
        ced: null,
        codes: {
          admin_county: 'E99999999',
          admin_district: 'E08000035',
          admin_ward: 'E05011403',
          ccg: 'E38000225',
          ccg_id: '15F',
          ced: 'E99999999',
          lau2: 'E05011403',
          lsoa: 'E01033015',
          msoa: 'E02006875',
          nuts: 'UKE42',
          parish: 'E43000276',
          parliamentary_constituency: 'E14000777',
        },
        country: expect.any(String),
        eastings: 429075,
        european_electoral_region: expect.any(String),
        incode: expect.any(String),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        lsoa: expect.any(String),
        msoa: expect.any(String),
        nhs_ha: expect.any(String),
        northings: 433258,
        nuts: expect.any(String),
        outcode: expect.any(String),
        parish: expect.any(String),
        parliamentary_constituency: expect.any(String),
        postcode: expect.any(String),
        primary_care_trust: expect.any(String),
        quality: 1,
        region: expect.any(String),
      },
      status: 200,

    });
  });
});