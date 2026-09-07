# Parking Management System

Full-stack parking management application built for an IT Developer portfolio.

## 🚀 Live Demo
- **App:** https://parking-management-system-wxkq.vercel.app
- **API:** https://parking-management-system-naufal17.vercel.app/api/health

**Demo credentials:**
- Email: `admin@parking.com`
- Password: `admin123`

> ⚠️ Note: the backend runs on Vercel's free serverless tier, so the first
> request after a period of inactivity may take a few seconds to respond
> while the function "cold starts." Subsequent requests are fast.

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

## Deployment
This project is deployed using a fully free stack:
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) (M0 free tier)
- **Backend:** [Vercel](https://vercel.com) as a serverless function (`backend/api/index.js`)
- **Frontend:** [Vercel](https://vercel.com) (static Vite build)

Environment variables required in production:
| Variable | Where | Example |
|---|---|---|
| `MONGODB_URI` | Backend project | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/parking_management` |
| `JWT_SECRET` | Backend project | any long random string |
| `CLIENT_URL` | Backend project | the deployed frontend URL (for CORS) |
| `VITE_API_URL` | Frontend project | the deployed backend URL + `/api` |
