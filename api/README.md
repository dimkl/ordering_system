## Ordering System API

## Requirements

TODO

## Development

### Setup

- install dependencies using `npm i`
- build code using `npm run build`
- build openapi docs using `npm run openapi:build:html`
- intialize environment variable file using `cp .env .env.development`
- populate the empty envs in `.env.deveopment`
    ```
    DATABASE_URL=<your own db connection string>
    CLERK_PUBLISHABLE_KEY=<your PK API key from https://dashboard.clerk.com>
    CLERK_SECRET_KEY=<your SK API key from https://dashboard.clerk.com>
    ```
- create database using `createdb ordering_system`
- create database schema using `npm run db:migrate:dev`
- (optional) generate some data using `npm run db:seed:dev`
- start application in localhost:3000 with auto-refresh mode using `npm run watch`

To preview the openapi specificition you can visit the http://localhost:3000/2024-07-25/openapi.

## Deployments

Pushing to `production` branch will trigger a deployment to https://api-withered-water-2633.fly.dev/ if the GH `tests_api` succeeds.

The deployed application is also accessible via the https://make-order.online/