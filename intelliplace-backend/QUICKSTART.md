# Quick Start Guide

Get your IntelliPlace backend running in 5 minutes with Prisma!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get Neon Database URL

1. Go to https://console.neon.tech/
2. Create/select a project
3. Copy the connection string (it looks like: `postgresql://user:pass@host.neon.tech/db?sslmode=require`)

## Step 3: Create `.env` File

Create a `.env` file in this directory:

```env
PORT=5000
NODE_ENV=development

# Paste your Neon connection string here
DATABASE_URL=postgresql://your-neon-connection-string-here?sslmode=require

# Generate a random string (at least 32 characters)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Generate JWT_SECRET:**
```bash
# Windows PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# Or use: https://randomkeygen.com/
```

## Step 4: Run Prisma Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate
```

When prompted, name your migration: `init`

## Step 5: Initialize Admin & Start Server

```bash
# Start server
npm run dev
```

Then in another terminal or browser:
```bash
# Create admin user
curl -X POST http://localhost:5000/api/init-db
```

Or visit: `http://localhost:5000/api/init-db` (POST request)

This creates admin: `admin` / `admin123`

## Step 6: Test Connection

Visit: `http://localhost:5000/api/health`

You should see: `{ "success": true, "database": "Connected" }`

## ✅ Done!

Your backend is ready with Prisma! 

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**API Endpoints:**
- POST `/api/auth/register/student` - Register student
- POST `/api/auth/register/company` - Register company
- POST `/api/auth/login/student` - Student login
- POST `/api/auth/login/company` - Company login
- POST `/api/auth/login/admin` - Admin login

**Prisma Benefits:**
- ✅ No raw SQL - clean, type-safe queries
- ✅ Auto-generated migrations
- ✅ Type safety & autocomplete
- ✅ Simple database management

**Need Help?** Check the main `SETUP.md` file.

