# Zenith Server

Multi-tenant management system backend server.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp ../.env .env
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Push database schema:
```bash
npm run db:push
```

5. Seed database (optional):
```bash
npm run db:seed
```

## Development

Start development server:
```bash
npm run dev
```

## Production

Build and start:
```bash
npm run build
npm start
```

## API Endpoints

- `GET /health` - Health check
- `GET /users` - Get all users
- `POST /users/register` - Register new user
- `GET /companies` - Get companies
- `GET /accounts` - Get accounts
- `GET /journal-entries` - Get journal entries
- `GET /products` - Get products
- `GET /warehouses` - Get warehouses
- `GET /employees` - Get employees
- `GET /payroll-records` - Get payroll records
- `GET /leads` - Get leads
- `GET /active-modules` - Get active modules

## Environment Variables

- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string
