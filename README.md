## Description

Auth App Backend

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Notes

## Environment & Configuration
1- .env.default serves as a template for required environment variables.
2- Missing or invalid environment variables will cause the application to exit.
3- MongoDB username (not needed for local if no username required), password (not needed for local if no password required), host (default: 127.0.0.1), and port (default: 3000) are optional.
4- JWT secret and expiration time are required environment variables.
5- CORS is enabled with configurable origins.

## Authentication & Security
1- Uses JWT-based authentication with access and refresh tokens.
2- Refresh tokens are stored securely and validated before issuing new access tokens.
3- Passwords are hashed using bcrypt before storage.
4- Guards and interceptors enforce authentication on protected routes.
5- Rate limiting is implemented to prevent brute-force attacks.
6- Helmet is used to enhance security by setting HTTP headers.
7- Sanitize option is used on payload and on db scope.

## API & Documentation
1- API documentation is available at ${url}/api/docs using Swagger.
2- Authentication endpoints include login, logout,signup,and refresh token.
3- Validation pipes ensure proper request payload structure.

## Logging & Monitoring
1- Winston is used for logging, with logs stored in the logs folder.
2- Error handling is centralized with a global exception filter.

## CI/CD & Deployment
1- Basic CI/CD implementation is included but excludes AWS credentials.

