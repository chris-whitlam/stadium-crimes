import { AxiosInstance } from "axios";
import { FootballDataTeam, GeographicalLocation } from "../../../interfaces";
import { Logger, logger } from "../logger";

export const getAllTeams = async (
  client: AxiosInstance,
  log: Logger = logger
): Promise<FootballDataTeam[]> => {
  try {
    const { data } = await client.get('/teams');

    return data.teams;
  } catch (error) {
    log.error({
      msg: 'Failed to retrieve all teams',
      error: error.message,
      stack: error.stack
    })

    throw error;
  }
}

export const getGeographicalLocationByPostcode = async (
  client: AxiosInstance,
  postcode: string,
  log: Logger = logger
): Promise<GeographicalLocation> => {
  try {
    const { data: { result } } = await client.get(`/postcodes/${postcode}`);

    return {
      latitude: result.latitude,
      longitude: result.longitude
    };
  } catch (error) {
    log.error({
      msg: 'Failed to retrieve geographical location from postcode',
      postcode,
      error: error.message,
      stack: error.stack
    })

    throw error;
  }
}

export const getCrimesByGeographicalLocation = async (
  client: AxiosInstance,
  geographicalLocation?: GeographicalLocation,
  log: Logger = logger
) => {
  if (!geographicalLocation) {
    return;
  }

  try {
    const { latitude, longitude } = geographicalLocation
    const { data } = await client.get(`/crimes-at-location?lat=${latitude}&lng=${longitude}`);

    return data;
  } catch (error) {
    log.error({
      msg: 'Failed to retrieve crimes from geographical location',
      geographicalLocation,
      error: error.message,
      stack: error.stack
    })

    throw error;
  }
}