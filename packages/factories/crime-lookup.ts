import { Factory } from 'fishery';
import {
  setLocale,
  address as fakerAddress,
} from 'faker';

import { CrimeLookupCrime } from '../interfaces';

setLocale('en_GB');

class CrimeLookupDocumentFactory extends Factory<CrimeLookupCrime> { }

export const CrimeLookupCrimeFactory = CrimeLookupDocumentFactory.define(({ sequence }) => ({
  id: sequence,
  category: 'violent-crime',
  location_type: 'Force',
  location: {
    latitude: fakerAddress.latitude(),
    longitude: fakerAddress.longitude(),
    street: {
      id: sequence * 100,
      name: 'On or near Sports/recreation Area'
    },
  },
  context: '',
  outcome_status: {
    category: 'Investigation complete; no suspect identified',
    date: `${new Date().getFullYear() - sequence}-${new Date().getMonth() - sequence}`
  },
  persistent_id: 'dd351965612c0161a0e25f6db351885bcce0999d378b337a454f02017350a342',
  location_subtype: '',
  month: `${new Date().getFullYear() - sequence}-${new Date().getMonth() - sequence}`
}));
