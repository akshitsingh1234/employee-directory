# Employee Directory

A full-stack Employee Directory application built with React, TypeScript, Node.js, Express, and PostgreSQL.

## Features

- View and search employees by name, email, or role
- Add new employees
- Edit employee details
- Delete employees
- Validate employee information
- Prevent duplicate email addresses
- Store employee records in PostgreSQL
- Responsive user interface

## Technology Stack

**Frontend:** React, TypeScript, Vite, Axios, Lucide React

**Backend:** Node.js, Express, TypeScript

**Database:** PostgreSQL

## Prerequisites

Install the following before running the project:

- Node.js and npm
- PostgreSQL
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/employee-directory.git
cd employee-directory
```

Replace `YOUR_GITHUB_USERNAME` with the repository owner's GitHub username.

### 2. Configure the database

Create a PostgreSQL database named `employee_directory`.

Create the `employees` table using the SQL schema provided in the project. Configure your PostgreSQL username, password, host, and port in `backend/.env`.

### 3. Configure the backend

Create `backend/.env` with the following values:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/employee_directory
FRONTEND_URL=http://localhost:5173
```

Replace `YOUR_PASSWORD` with your local PostgreSQL password.

Install dependencies and start the backend:

```bash
cd backend
npm install
npm run build
npm run dev
```

Verify the API at:

`http://localhost:5000/health`

### 4. Configure the frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Open a second terminal and run:

```bash
cd frontend
npm install
npm run build
npm run dev
```

### 5. Open the application

Visit:

**http://localhost:5173**

Keep PostgreSQL and both development servers running while using the application.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | List employees |
| GET | `/employees?search=Rahul` | Search employees |
| POST | `/employees` | Create an employee |
| PUT | `/employees/:id` | Update an employee |
| DELETE | `/employees/:id` | Delete an employee |
| GET | `/health` | Check API and database connectivity |

## Notes

- Environment files containing credentials are not included in the repository.
- A local PostgreSQL database must be configured before using the application.
- The frontend and backend run separately during development.

## Repository

GitHub: https://github.com/YOUR_GITHUB_USERNAME/employee-directory
