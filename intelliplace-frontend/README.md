# IntelliPlace Frontend

🎓 **IntelliPlace – Redefining Campus Placements**

A modern, beautiful React + Tailwind CSS frontend for the IntelliPlace campus placement platform.

## 🚀 Features

- **Student Portal**: Login, Register, and Dashboard
- **Company Portal**: Login, Register, and Dashboard
- **Admin Portal**: Login and Dashboard
- Beautiful gradient UI with animations
- Responsive design for mobile and desktop
- Mock authentication using localStorage
- React Router for navigation
- Framer Motion for smooth animations
- Lucide React icons

## 📦 Tech Stack

- **React** (v19.1.1)
- **Vite** (v5.4.11)
- **Tailwind CSS** (v3.4.13)
- **React Router DOM** (v7.1.3)
- **Framer Motion** (v11.11.17)
- **Lucide React** (v0.460.0)

## 🛠️ Installation

1. Navigate to the project directory:
```bash
cd intelliplace-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run build
```

4. Open your browser and visit:
```
http://localhost:5173
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation bar component
│   └── AdminLoginModal.jsx  # Admin login modal
├── pages/
│   ├── LandingPage.jsx      # Main landing page
│   ├── Student/
│   │   ├── StudentLogin.jsx
│   │   ├── StudentRegister.jsx
│   │   └── StudentDashboard.jsx
│   ├── Company/
│   │   ├── CompanyLogin.jsx
│   │   ├── CompanyRegister.jsx
│   │   └── CompanyDashboard.jsx
│   └── Admin/
│       └── AdminDashboard.jsx
├── utils/
│   └── auth.js              # Mock authentication utilities
├── App.jsx                   # Main app with routing
├── main.jsx                  # Entry point
└── index.css                 # Tailwind CSS imports
```

## 🔐 Authentication

Currently using **mock authentication** with localStorage:

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`

### Student/Company
- Any credentials will work (for development purposes)
- User data is stored in localStorage

## 🎨 Design Features

- Gradient backgrounds (blue/purple mix)
- Glassmorphism effects (backdrop blur)
- Smooth animations with Framer Motion
- Responsive cards and layouts
- Beautiful hover effects
- Icon-based UI with Lucide React

## 📱 Routes

- `/` - Landing Page
- `/student/login` - Student Login
- `/student/register` - Student Registration
- `/student/dashboard` - Student Dashboard
- `/company/login` - Company Login
- `/company/register` - Company Registration
- `/company/dashboard` - Company Dashboard
- `/admin/dashboard` - Admin Dashboard (accessed via modal on landing page)

## 🚧 Next Steps

This is Step-1 of the project. Future integrations:
- Connect to PostgreSQL + Node.js backend
- Real API endpoints for authentication
- Database integration
- Real-time features
- File uploads (resumes, company logos)
- Email notifications

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Development Notes

- All styling is done with Tailwind CSS (no separate CSS files)
- Authentication state is managed via localStorage
- Protected routes check user authentication
- Navigation bar shows/hides based on login status

## 📄 License

This project is part of the IntelliPlace platform.
