import { Request, Response } from 'express'

import { createClient as createFootballClient } from '../clients/football-data';
import { createClient as createPostcodeClient } from '../clients/postcode-lookup';
import { createClient as createCrimeClient } from '../clients/crime-lookup';

import { getStadiumCrimes } from '../lib/stadium-crimes';
import { getAllTeams } from '../lib/external-services';

export const handler = async (req: Request, res: Response) => {
  try {
    const footballClient = createFootballClient(req.logger);
    const postcodeClient = createPostcodeClient(req.logger);
    const crimeClient = createCrimeClient(req.logger);

    let teams = await getAllTeams(footballClient, req.logger);

    if (!teams.length) {
      throw new Error('Failed to retrieve any teams')
    }

    const stadiumCrimes = await getStadiumCrimes(
      postcodeClient,
      crimeClient,
      teams,
      req.logger
    )

    res.status(200).send(stadiumCrimes);

  } catch (error) {
    const msg = 'Failed to get all stadium crimes'
    req.logger?.error({
      msg,
      error: error.message,
      stack: error.stack
    })

    res.status(500).send({
      message: msg
    });
  }
}