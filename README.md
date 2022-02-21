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

## API Reference

#### user signup

```http
  Post http://localhost:3000/api/auth/signup
```

| Parameter   | Type     | Description                        |
| :---------- | :------- | :--------------------------------- |
| `firstName` | `String` | **Required**. the name of the user |
| `lastName`  | `String` | **Required**. the name of the user |
| `email`     | `String` | **Required**. user's email         |
| `password`  | `String` | **Required**. password             |

#### user login

```http
  POST http://localhost:5000/api/auth/login
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `email`    | `string` | **Required**. |
| `password` | `string` | **Required**. |

#### user logout

```http
  POST http://localhost:5000/api/auth/logout
```

it takes authorization Bearer header.

#### user data

```http
  GET http://localhost:5000/api/me
```

it takes authorization Bearer header.

#### Refresh Token

```http
  PATCH http://localhost:5000/api/auth/refresh-token
```

| Parameter       | Type     | Description   |
| :-------------- | :------- | :------------ |
| `refresh_token` | `string` | **Required**. |
