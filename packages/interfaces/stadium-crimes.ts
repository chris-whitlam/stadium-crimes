import { CrimeLookupCrime } from "./crime-lookup";

export interface StadiumCrimes {
  id: number;
  name: string;
  address: string;
  venue: string;
  crimes: CrimeLookupCrime[];
}

export interface GeographicalLocation {
  latitude: number;
  longitude: number;
}