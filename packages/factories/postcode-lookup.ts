import { Factory } from 'fishery';
import {
  setLocale,
  address as fakerAddress,
  commerce as fakerCommerce
} from 'faker';

import { PostcodeLookupResponse } from '../interfaces';

setLocale('en_GB');

class PostcodeLookupDocumentFactory extends Factory<PostcodeLookupResponse> { }

export const PostcodeLookupFactory = PostcodeLookupDocumentFactory.define(({ sequence }) => ({
  status: 200,
  result: {
    postcode: fakerAddress.zipCode(),
    quality: 1,
    eastings: 429075,
    northings: 433258,
    country: fakerAddress.country(),
    nhs_ha: 'Yorkshire and the Humber',
    longitude: Number(fakerAddress.longitude()),
    latitude: Number(fakerAddress.latitude()),
    european_electoral_region: 'Yorkshire and The Humber',
    primary_care_trust: fakerAddress.cityName(),
    region: fakerAddress.county(),
    lsoa: `${fakerAddress.cityName()} 111D`,
    msoa: `${fakerAddress.cityName()} 111`,
    incode: fakerAddress.zipCode(),
    outcode: fakerAddress.zipCode(),
    parliamentary_constituency: 'Leeds Central',
    admin_district: fakerAddress.cityName(),
    parish: `${fakerAddress.cityName()}, unparished area`,
    admin_county: null,
    admin_ward: fakerCommerce.department(),
    ced: null,
    ccg: `NHS ${fakerAddress.cityName()}`,
    nuts: fakerAddress.cityName(),
    codes: {
      admin_district: 'E08000035',
      admin_county: 'E99999999',
      admin_ward: 'E05011403',
      parish: 'E43000276',
      parliamentary_constituency: 'E14000777',
      ccg: 'E38000225',
      ccg_id: '15F',
      ced: 'E99999999',
      nuts: 'UKE42',
      lsoa: 'E01033015',
      msoa: 'E02006875',
      lau2: 'E05011403'
    }
  }
}));
