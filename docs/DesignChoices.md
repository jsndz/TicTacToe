# Architecture Decision Document

## Title

**Using Separate HTML Pages and Separate JavaScript Files for High-Scale Multiplayer Tic Tac Toe**

---

## 1. Objective

The goal of this architecture is to build a **highly performant, low-latency multiplayer Tic Tac Toe game** capable of supporting **millions of concurrent users** with:

* Minimal server load
* Minimal browser CPU and memory usage
* Predictable performance on low-end devices
* Clean separation of concerns
* Easy scalability and maintainability

---

## 2. Chosen Architecture

### Summary

* **Multiple HTML pages** (Multi-Page Application – MPA)
* **Separate JavaScript files per page**
* HTML and static assets served via Node.js (or CDN)
* Node.js backend focused on real-time multiplayer logic (WebSockets)

---

## 3. High-Level Structure

```
public/
├─ lobby.html        # Lobby / room creation
├─ game.html         # Game board
├─ lobby.js          # Lobby-specific logic
├─ game.js           # Game-specific logic
├─ common.css        # Shared styles
└─ common.js         # (Optional) shared utilities
```

---

## 4. Why Separate HTML Pages?

### 4.1 Performance at Scale

Each HTML page is a **static file** that can be:

* Cached aggressively
* Served directly from a CDN
* Served with near-zero CPU cost

For millions of users:

* Page loads do **not** stress the Node.js server
* Server resources are preserved for WebSocket connections

---

### 4.2 Browser Memory & Stability

A full page navigation:

* Destroys the existing DOM
* Clears JavaScript memory
* Removes event listeners
* Forces a clean garbage collection boundary

This is critical for:

* Long-running sessions
* Mobile devices
* Preventing memory leaks

---

### 4.3 Operational Simplicity

Separate pages:

* Reduce application state complexity
* Simplify debugging
* Make reconnection logic predictable
* Reduce edge cases in lobby → game transitions

---

## 5. Why Separate JavaScript Files?

### 5.1 JavaScript Parsing Cost

JavaScript is expensive to:

* Download
* Parse
* Execute

Even unused code:

* Consumes memory
* Registers functions
* Increases GC pressure

By splitting JS files:

* Only required logic is loaded
* CPU usage is minimized
* Memory footprint per user is reduced

---

### 5.2 Clear Execution Boundaries

| Page       | Loaded JS | Responsibilities           |
| ---------- | --------- | -------------------------- |
| lobby.html | lobby.js  | Room creation, matchmaking |
| game.html  | game.js   | Board logic, moves, sync   |

This prevents:

* Accidental state sharing
* Zombie listeners
* Socket lifecycle bugs

---

### 5.3 Cache Efficiency

Separate JS files allow:

* Independent cache invalidation
* Smaller cache busts
* Faster repeat visits

Example:

* Updating lobby UI does **not** invalidate game logic cache
* Game fixes do **not** affect lobby users

---

## 6. How Asset Loading Works

The server does **not decide** which JS to send dynamically.

Instead:

* The browser downloads JS files referenced in the HTML
* Each page includes only what it needs

### Example

**lobby.html**

```html
<script src="/lobby.js" defer></script>
```

**game.html**

```html
<script src="/game.js" defer></script>
```

This guarantees minimal asset loading per page.

---

## 7. Comparison With Single-Page Approach

| Aspect                 | Separate Pages + JS | Single Page App |
| ---------------------- | ------------------- | --------------- |
| Browser memory         | Very low            | High            |
| Long session stability | Excellent           | Risky           |
| Cache efficiency       | Excellent           | Poor            |
| Complexity             | Low                 | High            |
| JS execution cost      | Minimal             | Always high     |
| Debugging              | Simple              | Complex         |

---

## 8. Server Load Implications

With this architecture:

* HTTP requests are stateless
* Static files served efficiently
* Node.js focuses on:

  * WebSocket connections
  * Game state synchronization

This separation allows:

* Horizontal scaling
* Predictable latency
* High concurrency

---

## 9. Industry Alignment

This architecture aligns with how:

* Online chess platforms
* Browser-based multiplayer games
* Real-time web applications

handle performance and scale.

---

## 10. Final Decision

**Separate HTML pages with separate JavaScript files** are chosen because they:

* Minimize client CPU and memory usage
* Reduce server load
* Scale cleanly to millions of users
* Avoid common SPA performance pitfalls
* Simplify long-term maintenance

This design prioritizes **correctness, performance, and scalability over convenience**.

---

## 11. Future Enhancements (Optional)

* ES modules for shared utilities
* CDN cache-control tuning
* HTTP/3 + Brotli compression
* Graceful WebSocket reconnection

---

**Status:** Accepted
