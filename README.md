# Scalable Job Import System (MERN Stack)

A scalable, queue-based system for importing job listings from multiple external XML APIs, processing them asynchronously, storing them in MongoDB, and providing an admin UI to track import history.

---

## 🚀 Features

- Import jobs from multiple external XML feeds
- XML → JSON transformation
- Asynchronous processing using Redis + BullMQ
- Duplicate-safe job upsert logic
- Import history tracking with detailed metrics
- Server-driven pagination
- Admin dashboard built with Next.js + Tailwind CSS
- Production-ready architecture

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Redis
- BullMQ
- node-cron
- xml2js

### Frontend
- Next.js (App Router)
- TypeScript
- Axios
- Tailwind CSS

---

## 🏗️ System Architecture

High-level flow:


## API fetcher setup
External Job APIs (XML)
↓
Cron Job (Fetcher)
↓
Redis Queue (BullMQ)
↓
Worker Process
↓
MongoDB (Jobs + Import Logs)
↓
Admin UI (Next.js)


### For detailed architecture, see:  
📄 `docs/architecture.md`

---

## 📁 Project Structure

root
│
├── server
│   ├── config
│   │   └── db.js
│   │   └── redis.js
│   │
│   ├── cron
│   │   └── job.cron.js
│   │
│   ├── models
│   │   ├── Job.js
│   │   └── ImportLog.js
│   │
│   ├── queues
│   │   └── job.queue.js
│   │
│   ├── workers
│   │   └── job.worker.js
│   │
│   ├── services
│   │   └── fetchJobs.service.js
│   │
│   ├── routes
│   │   └── importLogs.routes.js
│   │
│   ├── server.js
│   │
│   ├── Dockerfile 
│   ├── .dockerignore
│   └── .env
│
├── client
│   ├── app
│   │   └── page.tsx
│   │
│   ├── components
│   │   └── Pagination.tsx
│   │
│   ├── styles
│   │
│   ├── Dockerfile  
│   ├── .dockerignore
│   └── .env.local
│
├── docs
│   └── architecture.md
│
├── docker-compose.yml
├── README.md
└── .gitignore




---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/job_importer or mongoatlas cloud
REDIS_URL=redis://127.0.0.1:6379 or redis cloud

```

### Frontend (client/.env.local)
```
NEXT_PUBLIC_API_BASE_URL = http://localhost:8000
```

