# Zenith Full-Stack Next.js Application

Multi-tenant management system built with Next.js 14 App Router and integrated API routes.

## Features

- 🏢 Multi-tenant architecture
- 📊 Modern dashboard with 2x2 grid layout
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Responsive design
- 🔄 Real-time updates
- 🗂️ Full-stack architecture (Frontend + API)
- 🚀 Server-side rendering
- 🔌 Integrated API routes

## Architecture

This is a **full-stack** Next.js application with:
- **Frontend**: React components with App Router
- **Backend**: API routes in `/app/api/` directory
- **Database**: Prisma with PostgreSQL
- **Deployment**: Single deployment for both frontend and backend

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# .env.local
DATABASE_URL="postgresql://your-database-url"
NEXT_PUBLIC_API_URL=""
NODE_ENV="development"
```

3. Run database migrations:
```bash
npx prisma generate
```

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx               # Home page (redirects to dashboard)
├── dashboard/
│   └── page.tsx           # Dashboard page
├── api/                   # Backend API routes
│   ├── users/
│   │   └── route.ts       # User endpoints
│   ├── companies/
│   │   └── route.ts       # Company endpoints
│   ├── products/
│   │   └── route.ts       # Product endpoints
│   ├── payroll-records/
│   │   └── route.ts       # Payroll endpoints
│   └── health/
│       └── route.ts       # Health check
└── globals.css             # Global styles

components/                    # Reusable components
├── Sidebar.tsx
├── Header.tsx
└── ...

lib/                          # Utilities
├── api.ts                  # API client (uses internal routes)
└── ...

modules/                       # Feature modules
├── core/
│   └── Dashboard.tsx
├── accounting/
├── inventory/
└── hr/

types.ts                       # TypeScript types
prisma/                       # Database schema
```

## API Endpoints

All API endpoints are available at `/api/`:

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Register new user

### Companies
- `GET /api/companies` - Get all companies

### Products
- `GET /api/products?companyId=X` - Get products for company
- `POST /api/products` - Create new product

### Payroll
- `GET /api/payroll-records?companyId=X` - Get payroll records
- `POST /api/payroll-records` - Create payroll record

### Health
- `GET /api/health` - Health check

## API Integration

The app uses **internal API routes**:
- Base URL: `/api/` (no external server needed)
- API client: `lib/api.ts`
- Direct function calls to internal routes
- No external API dependencies

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t zenith-fullstack .
docker run -p 3000:3000 zenith-fullstack
```

### Traditional Hosting
```bash
./deploy.sh
# or manually:
npm run build
npm start
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_API_URL` - API base URL (empty for internal routes)
- `NODE_ENV` - Environment (development/production)

## Benefits of Full-Stack Architecture

### 🚀 Performance
- Server-side rendering (SSR)
- API routes in same application
- No network latency between frontend/backend
- Optimized bundle sizes

### 🔧 Development
- Single codebase for frontend and backend
- Shared types and utilities
- Hot reload for both frontend and API
- Simplified deployment

### 📦 Deployment
- Single deployment process
- No separate server management
- Vercel-ready with zero config
- Environment variable management

## Features

### Dashboard
- 📊 2x2 grid layout for stats
- 🎯 Module management
- 👤 User profile section
- 📱 Responsive design

### Modules
- 📈 Accounting (Chart of Accounts, Journal Entries)
- 📦 Inventory (Products, Warehouses)
- 👥 HR (Employees, Payroll)
- 🎯 Sales (Leads, Invoices)

### UI/UX
- 🎨 Modern design with gradients
- ✨ Smooth animations
- 📱 Mobile responsive
- 🌙 RTL support for Arabic
- 🎯 Interactive elements

## Development

- **Framework**: Next.js 14 with App Router
- **API**: Integrated API routes
- **Styling**: Tailwind CSS
- **Database**: Prisma with PostgreSQL
- **Language**: TypeScript
- **Deployment**: Full-stack ready
