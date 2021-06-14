# Stadium Crimes
This project aims to provide a service which can retrieve the crimes commited at football stadiums.

## Prerequisites
The following are required to run the project:
* `docker`
* `docker-compose`
* `make`
* API Key from https://www.football-data.org/

You'll need to set your Football Data API Key in your `.bashrc`/`.zshrc` e.g
```
export FOOTBALL_DATA_API_KEY="my_football_data_api_key"
```

The following are recommended tools for development:
* VSCode Dev Container Extention

## Setup
The optional steps will allow you to access the api via `api.and-digital.local` rather than `localhost:5002`. If you use postman, you may also need to add the certificate

1. (Optional) `make ssl`
2. (Optional) `sudo make dns`
3. (Optional) Add `./.ssl/ca.crt` as the `PEM` file in the certicates section of postman.
3. `make install`
4. `make up logs`

If it is all running correctly, you can GET `api.and-digital.local/health-check` and it will return a message confirming it is working.

## Tests
To run the tests, you can simply call `make test`. This will output which tests have passed as well as the code coverage.

## Commands
All useful commands can be executed using make by specifying make and then the command e.g `make up`


| Command | Description |
|---------|-------------|
| `lint` | Analyses the code for potential errors and syntax issues |
| `build` | Builds all the docker images |
| `up` | Brings up all the docker containers  |
| `down` | Stops all docker containers |
| `restart` | Stops and then starts the docker containers |
| `logs` | Displays all the logs output by the application |
| `test` | Runs all the jest tests |
| `run-{service}` | Runs a specific docker-compose service e.g run-api |
| `shell-{service}` | Opens a shell terminal within the service |
| `dev` | Starts a dev session which watches for file changes and updates the local server |

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health-check` | Used to check the application is running correctly. Returns a 200 if successful
| `GET` | `/stadiums` | Returns a list of football teams and the crimes commited at their stadiums |

## Compatibility
This has only been tested on a Linux (Ubuntu 20.04) machine but     hopefully the fact it is dockerized should mean it works on any machine (fingers crossed).

## Key Points of Improvement
* The `/stadiums` endpoint takes a while as it quickly hits the rate limit of the police crime data endpoint. It then keeps retrying until it eventually gets a result. I hope to make this more efficient at somepoint but it works for now. Unfortunetly, it looks like the crime api doesn't return a `Retry-After` header which could be used to determine when to retry.

* I'd like to add more endpoints to allow for more granular querying e.g `/stadiums/{teamId}` to get the crimes of a specific team or `/crimes` to get a list of crimes and their associated teams etc...

* Using something like `Polly.js` to record and mock the api calls for tests might be a good investment rather than using nock and factories for the tests.

* Using something like `Webpack` to properly bundle the files into a build folder so it can be used in a production environement. Currently this is only really made to run locally.

* Add a front-end to display the infomation.