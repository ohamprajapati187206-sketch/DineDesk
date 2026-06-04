# DineDesk — Restaurant & Hotel Management System

A modern, full-stack alternative to Petpooja — built for restaurants and hotels that need more.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js%20%2B%20PostgreSQL-F5A623?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)

---

## What is DineDesk?

DineDesk is a full-stack restaurant and hotel management system built as a better alternative to Petpooja. It combines restaurant operations, hotel room management, real-time order tracking, and multi-branch franchise support — all in one platform.

**Why DineDesk over Petpooja?**
- Hotel + Restaurant combo (Petpooja is restaurant-only)
- Real-time notifications via Socket.IO
- Offline order creation with receipt printing
- Multi-branch / franchise support
- Swiggy & Zomato webhook integration
- Modern, fast UI with dark theme

---

## System Architecture

```
Customer Portal          Admin Dashboard
(localhost:3000)         (localhost:5173)
      |                        |
      +-----------+------------+
                  |
         Backend API
         (localhost:4000)
         Node.js + Express
                  |
         PostgreSQL DB
         Prisma ORM v5.22.0
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Admin Dashboard | React + Vite |
| Customer Portal | React + Vite + React Router |
| Backend API | Node.js + Express |
| Database | PostgreSQL 16 |
| ORM | Prisma v5.22.0 |
| Real-time | Socket.IO |
| Auth | JWT + bcrypt |
| HTTP Client | Axios |

---

## Features

### Admin Dashboard
- JWT login and authentication
- Live dashboard with stats and branch switcher
- Restaurant floor map and KOT system
- Menu CRUD management
- Hotel room management with check-in and check-out
- Table and room booking management
- Billing and invoicing with GST
- Inventory tracking with low stock alerts
- Staff management and daily attendance
- Offline order creation with receipt printing
- Online orders with auto-refresh every 10 seconds
- Swiggy and Zomato webhook integration
- Real-time notification bell via Socket.IO
- Reports and analytics with visual charts
- Multi-branch / franchise support
- Mobile responsive sidebar

### Customer Portal
- Menu browsing with search and category filter
- Cart with GST bill summary
- Simulated payment modal supporting UPI, Card, and Cash
- Live order tracking polling every 5 seconds
- Table and room booking
- Customer login and register
- My Orders page

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 16
- npm

### Installation

**1. Clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/dinedesk.git
cd dinedesk
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/dinedesk"
JWT_SECRET="your_secret_key"
PORT=4000
```

Run migrations and seed:
```bash
npx prisma migrate dev
node seed.js
```

**3. Setup Admin Dashboard**
```bash
cd ../dinedesk
npm install
```

**4. Setup Customer Portal**
```bash
cd ../dinedesk-customer
npm install
```

---

## Running the Project

Open 3 terminals:

```bash
# Terminal 1 - Backend
cd backend
node index.js

# Terminal 2 - Admin Dashboard
cd dinedesk
npm run dev
# Open: http://localhost:5173

# Terminal 3 - Customer Portal
cd dinedesk-customer
npm run dev -- --port 3000
# Open: http://localhost:3000
```

---

## Default Login

| Role | Email | Password |
|---|---|---|
| Super Admin | oham@dinedesk.com | admin123 |

---

## API Routes

| Method | Route | Purpose |
|---|---|---|
| POST | /api/auth/login | Login and get JWT |
| GET/POST | /api/menu | Menu CRUD |
| GET/POST/PATCH | /api/orders | Order management |
| GET/POST/PATCH | /api/tables | Table management |
| GET/POST/PATCH | /api/rooms | Room management |
| GET/POST/PATCH | /api/bookings | Booking management |
| GET/POST/PATCH | /api/inventory | Stock management |
| GET/POST/PATCH | /api/staff | Staff and attendance |
| GET | /api/reports/summary | Live analytics |
| GET/POST | /api/branches | Branch management |
| POST | /api/webhook/swiggy | Swiggy orders |
| POST | /api/webhook/zomato | Zomato orders |

---

## Project Structure

```
Desktop/
├── backend/               - Node.js API
│   ├── routes/            - All API routes
│   ├── prisma/            - Schema and migrations
│   ├── index.js           - Server entry and Socket.IO
│   └── seed.js            - DB seeder
├── dinedesk/              - Admin Dashboard (React)
│   └── src/
│       ├── App.jsx        - All components
│       └── api/           - Axios API clients
└── dinedesk-customer/     - Customer Portal (React)
    └── src/
        └── App.jsx        - All customer pages
```

---

## Roadmap

- [ ] Hold order feature
- [ ] Better UI design and animations
- [ ] Real Razorpay payment integration
- [ ] Deploy to Railway and Vercel
- [ ] Daily database backups
- [ ] UptimeRobot monitoring

---

## Author

**Oham Bhamani**
Student ID: 230310116002
Built as a full-stack capstone project.

---

## License

MIT License — free to use, modify, and distribute.
