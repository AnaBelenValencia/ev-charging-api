# EV Charging API

This is a RESTful backend API for managing electric vehicle charging stations, built with Node.js, Express, TypeScript, and PostgreSQL using TypeORM. The API supports JWT-based authentication and provides Swagger documentation.

## Features

- JWT authentication (`/auth/login`)
- Protected endpoints for managing users and stations
- Real-time simulation of station status changes with `node-cron`
- Metrics endpoint for dashboard visualizations
- Swagger UI for API documentation
- Full test suite with Jest and Supertest

## Stack

- Node.js + Express
- TypeScript
- PostgreSQL + TypeORM
- JWT for auth
- Jest + Supertest (testing)
- Swagger (OpenAPI v3)

## Getting Started

### 1. Install dependencies

```bash
npm install
```
### 2. Environment variables
Create a .env file in the root folder with the following:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ev_charging
JWT_SECRET=supersecretjwt

### 3. Run the server

```bash
npm run dev
```

Server will start on 
http://localhost:3000

Swagger docs will be available at
http://localhost:3000/api/docs

## API Endpoints

### Auth
| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| POST   | `/api/auth/login`    | Public login, returns token          |
| POST   | `/api/auth/register` | Requires token to register new users |

### Users
| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| GET    | `/api/users/profile` | Returns current user profile |

### Stations
| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| POST   | `/api/stations`            | Create new charging station |
| GET    | `/api/stations`            | Get list of all stations    |
| PATCH  | `/api/stations/:id/status` | Toggle station status       |

### Metrics
| Method | Endpoint       | Description                     |
| ------ | -------------- | ------------------------------- |
| GET    | `/api/metrics` | Returns station metrics summary |

## Testing
1. Run tests
```bash
npm test
```

All endpoints are tested using Jest and Supertest. Database must be accessible during testing.

## Development Notes

- All endpoints except /auth/login require a valid Bearer token
- Station status can be toggled manually or automatically via cron (every minute)
- Swagger annotations are located inside the routes/ folder
- Make sure to seed or manually insert a valid user before testing