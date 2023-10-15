# Custom lambda authorizer

This is a custom lambda authorizer that can be used to authorize requests to the ingest API.

## Usage

### In CI

Allows the use of a secure token in CI to test protected API routes.

### In production

Requires a valid JWT token to be passed in the `Authorization` header of the request.
