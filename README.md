# Service Booking Backend

A production-ready, scalable REST API for a **Local Service Booking Platform**, built with Express.js, TypeScript, Prisma ORM, and PostgreSQL. Customers can browse services by category, book them, and leave reviews; providers can list and manage their services; admins manage users and categories.

**Live API:** https://service-booking-backend-inhk.onrender.com
**API Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech))
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Other:** cors, dotenv

## Features

- JWT-based authentication with role-based access control (`CUSTOMER`, `PROVIDER`, `ADMIN`)
- Full CRUD for Users, Categories, Services, Bookings, and Reviews
- Soft delete on every model (`isDeleted` flag — no data is ever permanently removed)
- Normalized relational schema with proper foreign keys and indexes
- Consistent JSON response format across all endpoints
- Modular, service-layer architecture

## Project Structure

```
service-booking-backend/
├── prisma/
│   ├── schema.prisma        # Database models, enums, relations
│   └── migrations/          # Migration history
│
├── src/
│   ├── app.ts                # Express app + middleware + route mounting
│   ├── server.ts             # Entry point (loads env, starts server)
│   │
│   ├── routes/                # Route definitions (one file per module)
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── category.routes.ts
│   │   ├── service.routes.ts
│   │   ├── booking.routes.ts
│   │   └── review.routes.ts
│   │
│   ├── services/               # Business logic (one folder per module)
│   │   ├── user/
│   │   ├── category/
│   │   ├── service/
│   │   ├── booking/
│   │   └── review/
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts   # JWT verification + role authorization
│   │
│   └── lib/
│       ├── prisma.ts              # Shared PrismaClient instance
│       └── jwt.ts                  # Token generate/verify helpers
│
├── .env                    # Environment variables (not committed)
├── package.json
└── tsconfig.json
```

## Database Models

| Model      | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `User`     | Customers, Providers, and Admins. Role-based (`Role` enum)      |
| `Category` | Service categories (e.g. Cleaning, Tutoring)                    |
| `Service`  | A listing created by a Provider, under a Category               |
| `Booking`  | A Customer booking a Service, tracked with `BookingStatus` enum |
| `Review`   | A Customer's rating/comment on a Service                        |

All models include `isDeleted`, `createdAt`, and `updatedAt` fields.

## Enums

- `Role`: `CUSTOMER`, `PROVIDER`, `ADMIN`
- `BookingStatus`: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`

---

## Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/tanzid-48/service-booking-backend.git
cd service-booking-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
PORT=5000
```

### 4. Run migrations

```bash
npx prisma migrate dev
```

### 5. Start the dev server

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

### 6. (Optional) Open Prisma Studio

```bash
npx prisma studio
```

---

## Available Scripts

| Script          | Purpose                                         |
| --------------- | ----------------------------------------------- |
| `npm run dev`   | Start dev server with auto-reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/`                   |
| `npm start`     | Run the compiled production build               |

---

## API Overview

| Module     | Base Route        | Notes                                           |
| ---------- | ----------------- | ----------------------------------------------- |
| Auth       | `/api/auth`       | Register, Login                                 |
| Users      | `/api/users`      | Admin only                                      |
| Categories | `/api/categories` | Public read, Admin write                        |
| Services   | `/api/services`   | Public read, Provider/Admin write               |
| Bookings   | `/api/bookings`   | Customer creates, Provider/Admin updates status |
| Reviews    | `/api/reviews`    | Public read, Customer write                     |

Full endpoint details, request/response examples, and status codes: see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## Author

**Md Tanzid Mondol**
B.Sc. in CSE, Pundra University of Science and Technology (PUB)
GitHub: [tanzid-48](https://github.com/tanzid-48)
