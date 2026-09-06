# Parking Management System

Full-stack parking management application built for an IT Developer portfolio.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcrypt
- HTTP client: Axios
- Testing: Postman-ready REST API

## Features
- Admin/operator authentication
- Dashboard statistics
- Parking slot CRUD
- Vehicle entry and exit
- Automatic parking fee calculation
- Active parking and transaction history
- Search/filter transaction history
- JWT protected API
- Validation and centralized error handling

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas

## 1. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

On Linux/macOS:
```bash
cp .env.example .env
npm install
npm run dev
```

Default backend: http://localhost:5000

## 2. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Default configuration
See `backend/.env.example`.

## API overview

Auth:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

Slots:
- GET `/api/slots`
- POST `/api/slots`
- PUT `/api/slots/:id`
- DELETE `/api/slots/:id`

Parking:
- POST `/api/parking/entry`
- POST `/api/parking/exit`
- GET `/api/parking/active`
- GET `/api/parking/history`

Dashboard:
- GET `/api/dashboard/statistics`

All routes except register/login require:
`Authorization: Bearer <JWT>`

## Parking fee
Default:
- First hour: Rp5,000
- Each additional started hour: Rp3,000

You can change the values in `backend/src/config/parking.js`.

## Seed sample slots
```bash
cd backend
npm run seed
```

This creates slots A01-A20.
