# Hotel Employee Management System (Hotel EMS)

A clean, polished, production-quality full-stack technical assessment application for managing hotel staff, departments, job roles, work shifts, daily attendance, and non-trivial relational reporting.

---

## 🌟 Overview

The **Hotel Employee Management System** provides hotel administrators with an executive dashboard to oversee 24/7 hotel staff operations. Built with modern full-stack TypeScript technologies, it implements secure single-admin cookie authentication, normalized PostgreSQL database modeling, and structured relational reporting.

---

## 📐 Architecture & Technology Stack

### Backend (`/backend`)
- **Node.js & Express.js**: RESTful API server with modular controllers, routes, and services.
- **PostgreSQL & Prisma ORM**: Relational schema modeling Admin, Department, Role, Shift, Employee, and Attendance.
- **Authentication**: Single-admin authentication using `bcryptjs` for password hashing and HTTP-Only signed cookies containing JWT tokens.
- **Validation & Errors**: Input validation via `Zod` schemas and centralized Express error handling.

### Frontend (`/frontend`)
- **Next.js (App Router)**: Fast Server & Client React components using TypeScript.
- **Styling**: Tailored Tailwind CSS, modern glassmorphism aesthetic, custom badges, and interactive modals.
- **Icons & Client**: `lucide-react` icons and centralized `axios` instance with credentials support.

---

## 📂 Project Structure

```
Hotel_Employee_Management_System/
├── README.md
├── .gitignore
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── seed.ts
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── middleware/
│       ├── utils/
│       └── lib/
└── frontend/
    ├── .env.local
    ├── .env.example
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx (Dashboard)
    │   ├── login/page.tsx
    │   ├── employees/page.tsx
    │   ├── departments/page.tsx
    │   ├── roles/page.tsx
    │   ├── shifts/page.tsx
    │   └── reports/page.tsx
    └── src/
        ├── components/
        ├── context/
        └── lib/api/
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
PORT=5000
ADMIN_EMAIL="DevIsrael@gmail.com"
ADMIN_PASSWORD="@Isru4600"
JWT_SECRET="your-secure-jwt-secret-key"
```

> **Note**: A safe template with dummy placeholders is available in `backend/.env.example`.

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

---

## 🚀 Quick Setup & Seeding

### 1. Backend Setup & Seeding
```bash
cd backend

# Install dependencies
npm install

# Push database schema
npx prisma db push

# Build TypeScript code
npm run build

# Seed admin and sample data (Departments, Roles, Shifts, Staff, Attendance)
npm run prisma:seed

# Start backend dev server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run frontend dev server
npm run dev
```

The application will be accessible at:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`

---

## 🔑 Demo Admin Login Credentials

For quick evaluation during technical review, use the pre-configured admin account:

| Field | Value |
| :--- | :--- |
| **Email** | `DevIsrael@gmail.com` |
| **Password** | `@Isru4600` |

*(An "Autofill Credentials" button is also provided directly on the Login page).*

---

## ✨ Features & Non-Trivial Implementation Highlights

1. **Executive Dashboard**:
   - Real-time aggregation of active staff, departments, job roles, and shifts.
   - Live breakdown of today's attendance (Present, Late, Absent, On Leave).

2. **Employee Management**:
   - Complete CRUD operations with pagination, search, department filtering, and status badges.
   - Foreign key constraint checks to ensure database integrity.

3. **Departments, Roles, and Shifts Management**:
   - Full control over hotel unit organizational structures and 24/7 shift rotations.

4. **Attendance Tracking**:
   - Daily log entry and updates for check-in/check-out times, status, and notes.

5. **Advanced Relational Reports**:
   - **Employee Attendance Summary**: Calculates total days recorded, individual attendance counts, and overall attendance rate percentages per employee.
   - **Department Attendance Summary**: Aggregates unit-level attendance rates to identify top-performing hotel departments.

---

## 🧪 Verification & Build Status

- Backend compilation (`tsc`): **Passed**
- Database migrations & push: **Passed**
- Seeding script (`prisma:seed`): **Passed**
- Frontend production build (`next build`): **Passed**

© 2026 Grand Haven Hotel Management System.
