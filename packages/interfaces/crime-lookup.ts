export type CrimeLookupResponse = CrimeLookupCrime[];

export interface CrimeLookupCrime {
  category: string;
  location_type: string;
  location: CrimeLookupLocation;
  context: string,
  outcome_status: CrimeLookupOutcomeStatus
  persistent_id: string,
  id: number,
  location_subtype: string,
  month: string
}

export interface CrimeLookupLocation {
  latitude: string;
  street: CrimeLookupStreet;
  longitude: string;
}

export interface CrimeLookupStreet {
  id: number;
  name: string;
}

export interface CrimeLookupOutcomeStatus {
  category: string;
  date: string;
}