import { AxiosInstance } from "axios";
import { FootballDataTeam, StadiumCrimes } from "@and-digital/interfaces";
import { Logger, logger } from "../logger";
import { getCrimesByGeographicalLocation, getGeographicalLocationByPostcode } from "./external-services";

export const getStadiumCrimes = async (
  postcodeClient: AxiosInstance,
  crimeClient: AxiosInstance,
  teams: FootballDataTeam[],
  log: Logger = logger
) => {
  return Promise.all(
    teams
      .map(async (team) => getCrimes(postcodeClient, crimeClient, team, log))
  ).then(result => result.filter(Boolean));
}

const getCrimes = async (
  postcodeClient: AxiosInstance,
  crimeClient: AxiosInstance,
  team: FootballDataTeam,
  log: Logger = logger
): Promise<StadiumCrimes | undefined> => {
  let postcode;
  try {
    postcode = getPostcodeFromAddressString(team.address);
  } catch (error) {
    log.error({
      msg: "Failed to determine postcode from address string, skipping...",
      address: team.address
    })

    return;
  }

  let geographicalLocation;
  try {
    geographicalLocation = await getGeographicalLocationByPostcode(postcodeClient, postcode, log)
  } catch (error) {
    log.error({
      msg: "Failed to retreive geographical location for postcode, skipping...",
      postcode
    })

    return;
  }

  let crimes: any[] = [];
  try {
    crimes = await getCrimesByGeographicalLocation(crimeClient, geographicalLocation, log);
  } catch (error) {
    log.error({
      msg: "Failed to retreive crime data for geographical location, skipping...",
      geographicalLocation
    })

    return
  }

  return {
    ...team,
    crimes
  }
};

const getPostcodeFromAddressString = (
  addressString: string,
  log: Logger = logger
) => {
  const postcodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/
  try {
    const matches = addressString.match(postcodeRegex)

    if (!matches || !matches[0]) {
      throw new Error('Failed to find postcode matches in address')
    }
    return matches[0];
  } catch (error) {
    log.error({
      msg: 'Failed to determine postcode from address',
      addressString,
      error: error.message,
      stack: error.stack
    })

    throw error;
  }
}


