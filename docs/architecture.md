# System Architecture – Scalable Job Importer

## Overview

This system is designed to **import large volumes of job data** from multiple external XML-based APIs, process them asynchronously using a queue-based architecture, store them efficiently in MongoDB, and provide an **admin UI to track import history**.

The architecture emphasizes:
- Scalability
- Fault tolerance
- Clear separation of concerns
- Future extensibility (microservices-ready)

---

## High-Level Architecture

External Job APIs (XML)
|
| (Cron – scheduled fetch)
v
Job Fetch Service (XML → JSON)
|
v
Redis Queue (BullMQ)
|
| (Worker processes, concurrency)
v
Job Processor
|
|-- MongoDB (jobs collection)
|-- MongoDB (import_logs collection)
v
Admin UI (Next.js)



---

## Core Components

### 1. Job Source Integration

- Multiple external job feeds are consumed (e.g. Jobicy, HigherEdJobs).
- APIs return **XML**, which is converted to **JSON** using `xml2js`.
- A cron job runs at a configurable interval (hourly in production).

**Why XML → JSON conversion first?**
- Simplifies validation and transformation.
- Makes downstream processing uniform across feeds.

---

### 2. Queue-Based Processing (Redis + BullMQ)

- Each feed fetch results in a **queue job** being created.
- Jobs are processed asynchronously by workers.
- Configurable concurrency allows horizontal scaling.

**Benefits:**
- Prevents API spikes
- Isolates failures
- Allows retry with exponential backoff
- Handles millions of records without blocking the main thread

---

### 3. Worker System

Workers are responsible for:
- Validating job data
- Mapping external fields to internal schema
- Upserting jobs into MongoDB
- Tracking import metrics

**Concurrency Control**
- Worker concurrency is configurable.
- Supports horizontal scaling by running multiple worker instances.

---

### 4. MongoDB Design

#### Jobs Collection
- Stores normalized job records.
- Uses a **composite unique index** on `(externalId, source)` to avoid duplication.
- Uses `updateOne + upsert` for efficient inserts/updates.

#### Import Logs Collection
- Tracks each import run.
- Stores metadata like:
  - total fetched
  - new records
  - updated records
  - failed records with reasons
- Enables admin-level visibility into system health.

---

### 5. Import History Tracking

Each import execution creates an entry in `import_logs` with:
- Source (feed URL)
- Start & completion timestamps
- Counts of new, updated, and failed jobs
- Error payloads for debugging

This enables:
- Auditability
- Debugging failed imports
- Performance monitoring

---

### 6. Backend API (Node.js + Express)

Responsibilities:
- Expose paginated endpoints for import history
- Serve data to the admin UI
- Maintain clean separation between routes, services, and models

**Pagination**
- Server-driven pagination using `page` and `limit`
- Optimized using indexed sorting and lean queries

---

### 7. Frontend (Next.js Admin UI)

The frontend provides:
- Import history table
- Server-driven pagination
- Human-readable timestamps
- Responsive admin dashboard UI (Tailwind CSS)

**Design Decisions**
- Stateless UI driven by backend metadata
- Axios used for consistent HTTP handling
- TypeScript used for strong typing and safety

---

## Error Handling & Reliability

- Redis queue retries with exponential backoff
- Failed records are logged with reasons
- Database upserts prevent partial duplication
- Cron jobs are wrapped in try/catch to avoid silent failures

---

## Scalability Considerations

- Queue-based design supports millions of records
- Workers can be scaled independently
- MongoDB indexes ensure fast lookups
- Easy transition to microservices by splitting:
  - Fetch service
  - Worker service
  - API service

---

## MONGODB & REDIS Setup

The system can be deployed using:
- MongoDB 
- Redis via Docker (run command : docker run -d --name redis -p 6379:6379 redis)

---

## Key Design Decisions

| Decision                 | Justification                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Queue-based processing   | Enables asynchronous job handling, prevents blocking of the main application thread, and improves scalability under high load |
| MongoDB upserts          | Ensures idempotent operations by efficiently inserting new records or updating existing ones without duplication              |
| Redis (BullMQ)           | Provides a reliable and high-performance queue system for background job processing with retry and concurrency support        |
| Server-driven pagination | Efficiently handles large datasets by limiting payload size and reducing memory usage on the client                           |
| UTC timestamp storage    | Ensures consistent, timezone-agnostic date handling across distributed systems                                                |



## Conclusion

This architecture delivers a **robust, scalable, and maintainable job import system** capable of handling high-volume feeds while providing full transparency through import history tracking. It follows industry best practices and is production-ready.

