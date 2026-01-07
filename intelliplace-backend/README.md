# IntelliPlace Backend API

Simple backend server for IntelliPlace platform using Express + Prisma ORM + PostgreSQL (Neon).

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development

# Neon PostgreSQL Connection String
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Judge0 API URL (for coding tests)
# Default: http://localhost:2358 (for self-hosted Judge0)
JUDGE0_API_URL=http://localhost:2358
# JUDGE0_API_KEY=your-api-key-here  # Optional, only if using RapidAPI
```

### 3. Get Neon Database URL

1. Go to [Neon Console](https://console.neon.tech/)
2. Create/select a project
3. Copy the connection string

### 4. Run Prisma Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate
```

When prompted, name your migration: `init`

### 5. Initialize Admin User

```bash
npm run dev
```

Then visit: `POST http://localhost:5000/api/init-db`

Or use curl:
```bash
curl -X POST http://localhost:5000/api/init-db
```

This creates admin user:
- Username: `admin`
- Password: `admin123`

### 6. Start Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register/student` - Register student
- `POST /api/auth/register/company` - Register company
- `POST /api/auth/login/student` - Login student
- `POST /api/auth/login/company` - Login company
- `POST /api/auth/login/admin` - Login admin

### Utility

- `GET /api/health` - Health check
- `POST /api/init-db` - Initialize admin user

## 🛠️ Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migration
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio
```

## 📦 Project Structure

```
intelliplace-backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── lib/
│   └── prisma.js           # Prisma client
├── routes/
│   └── auth.js             # Authentication routes
├── middleware/
│   └── auth.js             # JWT middleware
├── server.js               # Express server
└── package.json
```

## 🔐 Default Admin Credentials

- Username: `admin`
- Password: `admin123`

## ✅ Benefits of Prisma

- ✅ Type-safe database queries
- ✅ Auto-completion in IDE
- ✅ Simple migrations
- ✅ Cleaner, more readable code
- ✅ No raw SQL queries
- ✅ Built-in connection pooling

## 🐛 Troubleshooting

**Prisma Client not found:**
```bash
npm run prisma:generate
```

**Migration failed:**
- Check your `DATABASE_URL` in `.env`
- Ensure Neon database is active
- Run `npm run prisma:migrate` again

**Database not connecting:**
- Verify `DATABASE_URL` format
- Check Neon dashboard for connection issues
- Ensure SSL mode is included: `?sslmode=require`
