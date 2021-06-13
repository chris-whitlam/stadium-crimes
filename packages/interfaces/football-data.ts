export interface FootballDataResponse {
  count: number;
  filters: FootballDataFilters;
  teams: FootballDataTeam[];
}

export interface FootballDataFilters {
  areas: number[];
  permission: string;
}

export interface FootballDataTeam {
  id: number;
  area: FootballDataArea;
  name: string;
  shortName: string;
  tla: string;
  crestUrl: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  founded: number;
  clubColors: string;
  venue: string;
  lastUpdated: string;
}

export interface FootballDataArea {
  id: number;
  name: string;
}