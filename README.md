
# 🧠 MindMaze 2.0

MindMaze 2.0 is a **real-time quiz platform** built for large-scale live events. It is designed to deliver low-latency interactions, instant score updates, and dynamic leaderboards while maintaining stability under heavy concurrent usage.

The platform successfully handled **~7,000 real-time submissions** during a live event with consistent performance and responsive UI updates.

---

## 🚀 Tech Stack

* **Frontend:** Next.js
* **Backend & Database:** Supabase
* **Real-time Features:** Supabase Realtime (Sockets)

---

## ✨ Features

* **Real-Time Quiz System**

  * Instant answer submission and validation
  * Time-based scoring with accurate synchronization

* **Live Leaderboards**

  * Real-time rank updates using Supabase sockets
  * No page refresh required
  * Time-responsive leaderboard rendering

* **Scalable Architecture**

  * Optimized backend queries for high-throughput events
  * Efficient handling of ~7,000 concurrent submissions

* **Interactive UI**

  * Smooth, responsive user experience
  * Works seamlessly across desktop and mobile devices

---

## 🏗 Architecture Overview

* Event-driven architecture using Supabase Realtime
* Real-time leaderboard updates via socket subscriptions
* Stateless frontend synchronized with backend events

---

## 📈 Performance Highlights

* Handled ~7,000 submissions during a single live event
* Low-latency leaderboard updates
* Single session per user at a time
* Stable performance under high concurrency

---


