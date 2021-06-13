export interface AppConfig {
  footballApiBaseUrl: string;
  footballApiKey: string;
  postcodeLookupUrl: string;
  crimeLookupUrl: string;
}

export const getConfig = (): AppConfig => {
  const {
    FOOTBALL_DATA_API_URL: footballApiBaseUrl = 'https://api.football-data.org/v2',
    FOOTBALL_DATA_API_KEY: footballApiKey = '',
    POSTCODE_LOOKUP_URL: postcodeLookupUrl = 'https://api.postcodes.io',
    CRIME_LOOKUP_URL: crimeLookupUrl = 'https://data.police.uk/api'
  } = process.env;

  return {
    footballApiBaseUrl,
    footballApiKey,
    postcodeLookupUrl,
    crimeLookupUrl
  }
}