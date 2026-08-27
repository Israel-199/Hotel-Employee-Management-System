# Hotel Employee Management System (Hotel EMS)

A clean, polished, production-quality full-stack technical assessment application for managing hotel staff, departments, job roles, work shifts, daily attendance, and non-trivial relational reporting.

---

## 🔑 Demo Admin Credentials

For instant testing and evaluation during technical review, use the single-admin account:

| Field | Value |
| :--- | :--- |
| **Admin Email** | `DevIsrael@gmail.com` |
| **Password** | `@Isru4600` |

> 💡 **Tip**: The login page at `http://localhost:3000/login` includes a single-click **"Autofill Credentials"** button that populates these credentials automatically.

---

## 🎨 UI Design & Aesthetic Architecture

The application was crafted with modern web design standards to deliver a sleek, executive-grade user experience:

- **Color Palette & Contrast**:
  - **Background**: Deep Slate (`#0f172a` / `#020617`) for login and sidebars to convey high-end resort elegance.
  - **Primary Accent**: Warm Gold/Amber (`amber-500` / `#f59e0b`) representing hospitality excellence and active interactive states.
  - **Status Badges**: Tailored, subtle HSL badge colors (Emerald for `PRESENT`/`ACTIVE`, Amber for `LATE`, Rose for `ABSENT`/`TERMINATED`, Blue for `LEAVE`/`ON_LEAVE`).
- **Typography & Hierarchy**: Clean, crisp Sans-serif typography (`Inter` via Google Fonts) paired with monospace text for employee numbers (`EMP-1001`), times, and dates.
- **Glassmorphism & Micro-Interactions**: Translucent backdrop blurs, soft card drop-shadows, and smooth hover state transitions.
- **Responsive Layout**: Sidebar navigation with mobile-responsive collapses, full table scrolling, and pop-up modal dialogs for CRUD actions.

---

## 🛠️ Architecture & Key Technical Decisions

### 1. Prisma 7 + `@prisma/adapter-pg` Database Layer
- **Decision**: PostgreSQL with `@prisma/adapter-pg` pool adapter and Prisma ORM.
- **Rationale**: Bypasses binary engine issues under Node v22 while ensuring high-performance database connection pooling.

### 2. Modern TypeScript Execution Engine (`tsx`)
- **Decision**: Replaced legacy `ts-node` with `tsx` (`tsx watch src/server.ts`).
- **Rationale**: Node v22+ has compatibility constraints with `ts-node` module loaders. `tsx` uses Esbuild under the hood for instant startup and hot-reloading.

### 3. Secure Single-Admin JWT Session Management
- **Decision**: HttpOnly signed cookies with JWT payloads (`adminId`, `email`) and `bcryptjs` password hashing.
- **Rationale**: Protects tokens from XSS vulnerabilities by keeping them out of `localStorage`. Includes automatic session refresh (`/api/auth/me`) on application mount.

### 4. Non-Trivial Relational Analytics & Reporting
- **Decision**: Server-side aggregation queries in `reportService.ts` and `dashboardService.ts`.
- **Rationale**: Computes individual attendance rates (`(PRESENT + LATE) / totalDays * 100`) and department-level summaries over customizable date ranges.

### 5. Input Validation & Robust Error Middleware
- **Decision**: `Zod` schemas for request body parsing and custom `errorHandler` middleware.
- **Rationale**: Guarantees type-safety at runtime and formats validation errors into clean user-facing API responses.

---

## 📁 Repository Structure

```
Hotel_Employee_Management_System/
├── README.md
├── .gitignore
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── app.ts                  # Express application setup & CORS
│       ├── server.ts               # HTTP server listener
│       ├── seed.ts                 # Database seeder script
│       ├── controllers/            # Route request handlers
│       ├── services/               # Business logic & database queries
│       ├── routes/                 # Express API routing definitions
│       ├── middleware/             # Auth check & error handler
│       ├── utils/                  # JWT, validation, and Prisma errors
│       └── lib/                    # Prisma client instantiation
└── frontend/
    ├── .env.local
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    ├── app/
    │   ├── layout.tsx              # Root Next.js layout & AuthProvider wrapper
    │   ├── page.tsx                # Executive Dashboard
    │   ├── login/page.tsx          # Login Page with credentials autofill
    │   ├── employees/page.tsx      # Staff directory & CRUD modals
    │   ├── departments/page.tsx    # Hotel departments management
    │   ├── roles/page.tsx          # Job designations management
    │   ├── shifts/page.tsx         # 24/7 work shift management
    │   └── reports/page.tsx        # Attendance analytics & reports
    └── src/
        ├── components/             # Sidebar, Header, AppShell
        ├── context/                # AuthContext & session state
        └── lib/api/                # Centralized Axios client & API calls
```

---

## ⚡ How to Run the Project

### Prerequisites
- **Node.js**: v18+ (Tested on Node.js v22.16.0)
- **npm**: v9+
- **PostgreSQL**: Local database instance or PostgreSQL URL (e.g. Neon PostgreSQL)

---

### Step 1: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured (refer to `backend/.env.example`):
   ```env
   DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
   PORT=5000
   ADMIN_EMAIL="DevIsrael@gmail.com"
   ADMIN_PASSWORD="@Isru4600"
   JWT_SECRET="@Israel2612"
   CLIENT_ORIGIN="http://localhost:3000"
   ```

4. Push database schema:
   ```bash
   npx prisma db push
   ```

5. Seed database with Admin user, Departments, Roles, Shifts, Employees, and Attendance:
   ```bash
   npm run prisma:seed
   ```

6. Start backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env.local` is present:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```

4. Start frontend development server:
   ```bash
   npm run dev
   ```
   *The application will start on `http://localhost:3000`.*

---

## 🔍 API Routes Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | Server health check | No |
| `POST` | `/api/auth/login` | Single-admin login & cookie issue | No |
| `GET` | `/api/auth/me` | Current session details | Yes |
| `POST` | `/api/auth/logout` | Session cookie clear | Yes |
| `GET` | `/api/dashboard/summary` | Live KPI dashboard stats | Yes |
| `GET` | `/api/employees` | List employees (search, filter, paginate) | Yes |
| `POST` | `/api/employees` | Create employee | Yes |
| `PUT` | `/api/employees/:id` | Update employee | Yes |
| `DELETE` | `/api/employees/:id` | Delete employee | Yes |
| `GET` | `/api/departments` | List hotel departments | Yes |
| `POST` | `/api/departments` | Create department | Yes |
| `GET` | `/api/roles` | List job roles | Yes |
| `POST` | `/api/roles` | Create job role | Yes |
| `GET` | `/api/shifts` | List work shifts | Yes |
| `POST` | `/api/shifts` | Create work shift | Yes |
| `GET` | `/api/attendance` | Attendance log entries | Yes |
| `POST` | `/api/attendance` | Record attendance entry | Yes |
| `GET` | `/api/reports/attendance-summary` | Relational employee attendance report | Yes |
| `GET` | `/api/reports/department-attendance` | Relational department attendance report | Yes |

---

## ✅ Verification Checklist

- [x] Backend TypeScript compilation (`tsc`): **Passed**
- [x] Database schema sync (`prisma db push`): **Passed**
- [x] Seeding execution (`npm run prisma:seed`): **Passed**
- [x] Backend dev server (`npm run dev` with `tsx`): **Running on port 5000**
- [x] Frontend Next.js build (`npm run build`): **Passed**
- [x] Frontend dev server (`npm run dev`): **Running on port 3000**

© 2026 Grand Haven Hotel & Resort. Technical Assessment Delivery.
