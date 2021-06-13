import { Factory } from 'fishery';
import {
  setLocale,
  internet as fakerInternet,
  phone as fakerPhone,
  address as fakerAddress,
  image as fakerImage,
  company as fakerCompany,
  commerce as fakerCommerce
} from 'faker';

import { FootballDataResponse, FootballDataTeam } from '../interfaces';

setLocale('en_GB');

class FootballDataDocumentFactory extends Factory<FootballDataResponse> {
  withMultipleTeams(numberOfTeams = 2) {
    return this.params(
      {
        count: numberOfTeams,
        teams: FootballDataTeamFactory.buildList(numberOfTeams)
      }
    );
  }
}

export const FootballDataResponseFactory = FootballDataDocumentFactory.define(({ sequence }) => ({
  count: 1,
  filters: {
    areas: [
      2072
    ],
    permission: "TIER_ONE"
  },
  teams: FootballDataTeamFactory.buildList(1)
}));

class FootballDataTeamDocumentFactory extends Factory<FootballDataTeam> { }

export const FootballDataTeamFactory = FootballDataTeamDocumentFactory.define(({ sequence }) => ({
  id: sequence,
  area: {
    id: sequence * 1000,
    name: fakerAddress.country()
  },
  name: `${fakerCompany.companyName()} F.C`,
  shortName: fakerCompany.companyName(),
  tla: fakerCompany.companySuffix(),
  crestUrl: fakerImage.imageUrl(),
  address: `${fakerAddress.streetName()} ${fakerAddress.city()} ${fakerAddress.zipCode()}`,
  phone: fakerPhone.phoneNumber(),
  website: fakerInternet.url(),
  email: fakerInternet.email(),
  founded: new Date().getFullYear() - sequence,
  clubColors: fakerCommerce.color(),
  venue: fakerAddress.streetName(),
  lastUpdated: new Date().toISOString()
}))