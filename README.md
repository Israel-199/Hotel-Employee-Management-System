# Hotel Employee Management System (Hotel EMS)

A clean, executive-grade full-stack web application for managing hotel staff, departments, job roles, work shifts, daily attendance logs, and relational reporting.

---

## 🏛️ System Architecture

The project follows a decoupled client-server architecture built with modern TypeScript technologies:

```
                  ┌────────────────────────────────────────┐
                  │          Next.js 14 Frontend           │
                  │   (React, TypeScript, Tailwind CSS)    │
                  └───────────────────┬────────────────────┘
                                      │  HTTP / REST (Axios)
                                      │  HttpOnly JWT Cookies
                                      ▼
                  ┌────────────────────────────────────────┐
                  │           Express 4 Backend            │
                  │      (Node.js, TypeScript, Zod)        │
                  └───────────────────┬────────────────────┘
                                      │  Prisma ORM 7
                                      │  @prisma/adapter-pg
                                      ▼
                  ┌────────────────────────────────────────┐
                  │          PostgreSQL Database           │
                  │              (Neon DB)                 │
                  └────────────────────────────────────────┘
```

### Frontend Stack (App Directory Architecture)
- **Framework**: Next.js 14 (App Router)
- **State & Context**: React Context API (`AuthContext`) for auth session persistence.
- **HTTP Client**: Axios with automatic `withCredentials: true` for HTTP-only cookie management.
- **Styling & UI**: Vanilla CSS + Tailwind CSS tokens, smooth transitions, glassmorphism UI elements, and custom status indicators.

### Backend Stack (Layered Architecture)
- **Runtime & Server**: Node.js v22 with Express.js running TypeScript directly via `tsx`.
- **Database & ORM**: PostgreSQL with Prisma ORM 7 (`@prisma/adapter-pg` pool adapter).
- **Validation**: Zod 3 schemas for input validation across all incoming request bodies and query parameters.
- **Security & Auth**: JWT signed tokens stored in `httpOnly` secure cookies with `bcryptjs` password hashing.

---

## 🗄️ Database Design & Relational Data Model

The database is designed around core hotel operations with clear foreign key relations, integrity constraints, and query-optimized indexes.

```mermaid
erDiagram
    ADMIN {
        string id PK
        string email UK
        string password
        datetime createdAt
        datetime updatedAt
    }
    DEPARTMENT {
        string id PK
        string name UK
        string description
        datetime createdAt
        datetime updatedAt
    }
    ROLE {
        string id PK
        string name UK
        string description
        datetime createdAt
        datetime updatedAt
    }
    SHIFT {
        string id PK
        string name
        string startTime
        string endTime
        string description
        datetime createdAt
        datetime updatedAt
    }
    EMPLOYEE {
        string id PK
        string employeeNumber UK
        string firstName
        string lastName
        string email UK
        string phone
        datetime hireDate
        string departmentId FK
        string roleId FK
        string shiftId FK
        string status
        datetime createdAt
        datetime updatedAt
    }
    ATTENDANCE {
        string id PK
        string employeeId FK
        datetime date
        string status
        datetime checkIn
        datetime checkOut
        string notes
        datetime createdAt
        datetime updatedAt
    }

    DEPARTMENT ||--o{ EMPLOYEE : "has employees"
    ROLE ||--o{ EMPLOYEE : "assigned to"
    SHIFT ||--o{ EMPLOYEE : "assigned shift"
    EMPLOYEE ||--o{ ATTENDANCE : "logs attendance"
```

### Entity Specifications

1. **Admin (`admins`)**
   - Stores system administrator credentials with hashed passwords (`bcryptjs`).
2. **Department (`departments`)**
   - Represents operational units (`Front Office`, `Housekeeping`, `Food & Beverage`, `Maintenance`, `Human Resources`).
3. **Role (`roles`)**
   - Designations (`Manager`, `Receptionist`, `Housekeeper`, `Chef`, `Waiter`, `Maintenance Technician`, `HR Officer`).
4. **Shift (`shifts`)**
   - Work schedules (`Morning`, `Afternoon`, `Night`) using 12-hour AM/PM time strings (`07:00AM`, `03:00PM`, `11:00PM`).
5. **Employee (`employees`)**
   - Complete employee profile linked to `department`, `role`, and `shift`.
   - Unique constraints on `employeeNumber` and `email`.
   - Enforces valid Ethiopian phone number format (`+2519...` or `09...`).
6. **Attendance (`attendance`)**
   - Tracks daily staff attendance status (`PRESENT`, `ABSENT`, `LATE`, `LEAVE`).
   - Enforces compound unique constraint `@@unique([employeeId, date])` to prevent duplicate daily entries per employee.

---

## 🔑 Key Engineering Decisions & Validations

### 1. No-Change Update Detection
When invoking PUT/PATCH endpoints for any resource (`Employee`, `Department`, `Role`, `Shift`, `Attendance`), the service layer compares incoming payload values against the current database record. If no fields were modified, the request returns a `400 Bad Request` with a human-readable message: `"No changes were made."`.

### 2. Ethiopian Local Time (UTC+3 / East Africa Time)
All daily attendance queries, date boundary calculations (`startOfTodayUTC`, `endOfTodayUTC`), and dashboard stats use an Ethiopian Local Time offset (UTC+3 / EAT). This ensures that attendance entries align with local Ethiopian calendar days regardless of server hosting location.

### 3. Ethiopian Phone Number Format Validation
Phone numbers are validated via Zod regex: `/^(?:\+251|0)[79]\d{8}$/`. Valid formats include:
- `+251911234567`
- `0911234567`
- `+251712345678`
- `0712345678`

### 4. 12-Hour AM/PM Time Format
Shift start and end times enforce 12-hour AM/PM format validation (e.g., `07:00AM`, `03:00PM`, `11:00PM`).

### 5. Standardized Human-Readable Error Responses
All API error responses follow a uniform JSON structure:
```json
{
  "success": false,
  "message": "Human-understandable error message."
}
```

---

## ⚡ How to Run the Project

### Prerequisites
- **Node.js**: v18+ (Tested on Node.js v22.16.0)
- **npm**: v9+
- **PostgreSQL**: PostgreSQL connection URL (e.g. Neon PostgreSQL)

---

### Step 1: Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env`)**:
   Create or verify `.env` inside the `backend` folder:
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_PksWJdND1L5K@ep-winter-sky-aylq1mjg-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   PORT=5000
   ADMIN_EMAIL="admin@test.com"
   ADMIN_PASSWORD="AssessmentPassword123!"
   JWT_SECRET="assessment-secret"
   CLIENT_ORIGIN="http://localhost:3000"
   ```

4. **Sync database schema with Prisma**:
   ```bash
   npx prisma db push
   ```

5. **Wipe & seed initial database data**:
   ```bash
   npm run prisma:seed
   ```

6. **Start backend development server**:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*

---

### Step 2: Frontend Setup

1. **Open a new terminal and navigate to frontend**:
   ```bash
   cd Hotel-Employee-Management-System-main
   ```
   Then

   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env.local`)**:
   Create `.env.local` inside the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```

4. **Start frontend development server**:
   ```bash
   npm run dev
   ```
   *The client app runs on `http://localhost:3000`.*

---

## 🌐 API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | Server status check | No |
| `POST` | `/api/auth/login` | Login admin & issue cookie | No |
| `GET` | `/api/auth/me` | Fetch active session | Yes |
| `POST` | `/api/auth/logout` | Logout & clear cookie | Yes |
| `GET` | `/api/dashboard/summary` | Real-time KPI summary stats | Yes |
| `GET` | `/api/employees` | List employees (search & filter) | Yes |
| `POST` | `/api/employees` | Create employee profile | Yes |
| `PUT` | `/api/employees/:id` | Update employee profile | Yes |
| `DELETE` | `/api/employees/:id` | Delete employee record | Yes |
| `GET` | `/api/departments` | List departments | Yes |
| `POST` | `/api/departments` | Create department | Yes |
| `PUT` | `/api/departments/:id` | Update department | Yes |
| `DELETE` | `/api/departments/:id` | Delete department | Yes |
| `GET` | `/api/roles` | List job roles | Yes |
| `POST` | `/api/roles` | Create job role | Yes |
| `PUT` | `/api/roles/:id` | Update job role | Yes |
| `DELETE` | `/api/roles/:id` | Delete job role | Yes |
| `GET` | `/api/shifts` | List work shifts | Yes |
| `POST` | `/api/shifts` | Create work shift | Yes |
| `PUT` | `/api/shifts/:id` | Update work shift | Yes |
| `DELETE` | `/api/shifts/:id` | Delete work shift | Yes |
| `GET` | `/api/attendance` | Attendance log entries | Yes |
| `POST` | `/api/attendance` | Record attendance entry | Yes |
| `PUT` | `/api/attendance/:id` | Update attendance entry | Yes |
| `DELETE` | `/api/attendance/:id` | Delete attendance entry | Yes |
| `GET` | `/api/reports/attendance-summary` | Employee attendance percentage report | Yes |
| `GET` | `/api/reports/department-attendance` | Department attendance percentage report | Yes |

---

© 2026 Haile Resort. Technical Assessment Delivery.
