# Scalable Job Import System (MERN Stack)

A scalable, queue-based system for importing job listings from multiple external XML APIs, processing them asynchronously, storing them in MongoDB, and providing an admin UI to track import history.

---

## 1️⃣ Clone the repository
```bash
mkdir project_name
cd project_name
git clone https://github.com/suraj-raj01/KnovatorTechnologiesAssessment
```

## Start All Servicess

```bash
docker-compose up --build

```

## Access the application

| Service            | URL                                            |
| ------------------ | ---------------------------------------------- |
| Frontend (Next.js) | [http://localhost:3000](http://localhost:3000) |
| Backend API        | [http://localhost:8000](http://localhost:8000) |
| MongoDB            | localhost:27017                                |
| Redis              | localhost:6379                                 |

## Install dependencies
### server
```bash
cd server
npm install
```

### client
```bash
cd client
npm install
```


## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/job_importer or mongoatlas cloud
REDIS_URL=redis://127.0.0.1:6379 or redis cloud

```

### Frontend (client/.env.local)
```env
NEXT_PUBLIC_API_BASE_URL = http://localhost:8000

```

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

## RUN COMMADS:
backend : /server -> nodemon or node server.js
frontend : /client -> npm run dev
redis : docker run -d --name redis -p 6379:6379 redis  --> (DOCKER REQUIRED)


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
```bash
root
│
├── server
│   ├── config
│   │   ├── db.js
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
│   │   └── job.events.js       // using websocket (socket.io)
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

```