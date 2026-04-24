# Backend - Vaccine Booking API

Node.js + Express + MongoDB (Mongoose).

## Setup

```bash
cd backend
npm install
copy .env.example .env
# edit .env with your MONGO_URI
npm run seed
npm run dev
```

API: `http://localhost:5000/api`

## Structure

- `src/config/` — DB connection, environment
- `src/models/` — Mongoose schemas (User, Hospital, Vaccine, Slot, Booking)
- `src/routes/` — Express routers
- `src/controllers/` — Route handlers
- `src/middleware/` — auth, admin-check, error handler
- `src/validators/` — express-validator chains
- `src/utils/seed.js` — Seeds DB from `database/seed/*.json`

See `docs/api-spec.md` for the full API contract.

## Frontend → Backend Request URLs (Postman)

**Base URL (dev):** `http://localhost:5000/api`  
**Auth header (for protected routes):** `Authorization: Bearer <token>`

---

## Auth
- **POST** `http://localhost:5000/api/auth/register`
- **POST** `http://localhost:5000/api/auth/login`
- **GET** `http://localhost:5000/api/auth/me` 🔒

---

## Hospitals
- **GET** `http://localhost:5000/api/hospitals`  
  - Query: `city`, `pincode`, `name`, `vaccine`, `maxPrice`
- **GET** `http://localhost:5000/api/hospitals/:id`
- **GET** `http://localhost:5000/api/hospitals/:id/vaccines`
- **GET** `http://localhost:5000/api/hospitals/:id/availability`  
  - Query: `from`, `to`, `vaccineId`
- **POST** `http://localhost:5000/api/hospitals` 🔒 admin
- **PUT** `http://localhost:5000/api/hospitals/:id` 🔒 admin

---

## Vaccines
- **GET** `http://localhost:5000/api/vaccines`  
  - Query: `hospitalId`, `name`
- **POST** `http://localhost:5000/api/vaccines` 🔒 admin
- **PUT** `http://localhost:5000/api/vaccines/:id` 🔒 admin
- **DELETE** `http://localhost:5000/api/vaccines/:id` 🔒 admin

---

## Slots
- **GET** `http://localhost:5000/api/slots`  
  - Query: `hospitalId`, `vaccineId`, `date`
- **POST** `http://localhost:5000/api/slots` 🔒 admin
- **PUT** `http://localhost:5000/api/slots/:id` 🔒 admin

---

## Bookings
- **POST** `http://localhost:5000/api/bookings` 🔒
- **GET** `http://localhost:5000/api/bookings/me` 🔒
- **GET** `http://localhost:5000/api/bookings/:id` 🔒 (owner/admin)
- **PUT** `http://localhost:5000/api/bookings/:id` 🔒
- **DELETE** `http://localhost:5000/api/bookings/:id` 🔒

---

## Admin
- **GET** `http://localhost:5000/api/admin/stats` 🔒 admin
- **GET** `http://localhost:5000/api/admin/bookings` 🔒 admin  
  - Query: `date`, `hospitalId`