# IntelliPlace Setup Guide

Simple setup guide using Prisma ORM for database management.

## 📋 Prerequisites

1. Node.js installed (v18+)
2. Neon PostgreSQL account ([neon.tech](https://neon.tech))

## 🔧 Backend Setup

### Step 1: Install Dependencies

```bash
cd intelliplace-backend
npm install
```

### Step 2: Get Neon Database URL

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in
3. Create a new project (or use existing)
4. Copy the connection string (format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)

### Step 3: Configure Environment Variables

Create a `.env` file in `intelliplace-backend/`:

```env
PORT=5000
NODE_ENV=development

# Paste your Neon connection string here
DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require

# Generate a strong random string for JWT secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Judge0 API URL (for coding tests)
# Default: http://localhost:2358 (for self-hosted Judge0)
# For RapidAPI: https://judge0.p.rapidapi.com (requires JUDGE0_API_KEY)
JUDGE0_API_URL=http://localhost:2358
# JUDGE0_API_KEY=your-api-key-here  # Optional, only if using RapidAPI
```

**Generate JWT_SECRET:**
```bash
# Windows PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# Or use: https://randomkeygen.com/
```

### Step 4: Run Prisma Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates database tables)
npm run prisma:migrate
```

When prompted, name your migration: `init`

This creates all database tables automatically!

### Step 5: Initialize Admin User

Start the server:
```bash
npm run dev
```

In another terminal or browser, initialize admin:
```bash
curl -X POST http://localhost:5000/api/init-db
```

Or visit: `http://localhost:5000/api/init-db` (POST request)

This creates admin:
- Username: `admin`
- Password: `admin123`

### Step 6: Verify Backend

Visit: `http://localhost:5000/api/health`

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "database": "Connected"
}
```

## 🎨 Frontend Setup

### Step 1: Configure API URL

Create a `.env` file in `intelliplace-frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

**For production**, update this to your backend URL:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Step 2: Start Frontend

```bash
cd intelliplace-frontend
npm install  # If not already installed
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🧪 Testing the Connection

### Test Student Registration

1. Open browser: `http://localhost:5173`
2. Click "Student" → "Login" (in modal)
3. Click "Register here"
4. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Roll Number: STU001
   - Phone: +1234567890
   - Password: test123
   - Confirm Password: test123
5. Click "Register"

If successful, you'll be redirected to the dashboard!

### Test Admin Login

1. Click "Admin" → "Login"
2. Use credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login"

## 🔍 Troubleshooting

### Backend Issues

**Database Connection Error:**
- Check your `DATABASE_URL` in `.env`
- Ensure Neon database is active
- Verify SSL mode is included: `?sslmode=require`

**Port Already in Use:**
- Change `PORT` in `.env` to a different port (e.g., 5001)
- Update frontend `VITE_API_URL` accordingly

**Tables Not Created:**
- Run `POST http://localhost:5000/api/init-db` again
- Check backend console for errors

### Frontend Issues

**CORS Error:**
- Ensure backend `FRONTEND_URL` matches frontend URL
- Check backend is running

**API Connection Error:**
- Verify `VITE_API_URL` in frontend `.env`
- Check backend is running on correct port
- Open browser DevTools → Network tab to see failed requests

**"Network error" Message:**
- Check backend server is running
- Verify API URL in browser network tab
- Check backend console for errors

## 📝 Database Schema

The database includes three main tables:

1. **students** - Student user accounts
2. **companies** - Company user accounts  
3. **admins** - Admin user accounts

All passwords are hashed with bcrypt (10 salt rounds).

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use strong JWT_SECRET in production
- Enable HTTPS in production
- Keep Neon database credentials secure
- Consider rate limiting for production

## 🚀 Next Steps

- Add job posting functionality
- Create student profile management
- Build company dashboard features
- Add resume upload functionality
- Implement email notifications

---

## Quick Start Commands

```bash
# Backend
cd intelliplace-backend
npm install
# Add .env with DATABASE_URL from Neon
npm run dev
# Visit: http://localhost:5000/api/init-db (POST)

# Frontend (in new terminal)
cd intelliplace-frontend
# Add .env with VITE_API_URL=http://localhost:5000/api
npm run dev
# Visit: http://localhost:5173
```

