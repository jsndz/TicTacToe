## Data Structure Choice (Summary)

### We use:

```js
rooms = Map<roomId, Map<userId, User>>
usersById = Map<userId, User>
```

---

## Why this works

* **`rooms`** → who is in which room
* **`usersById`** → fast lookup of a user by `userId` (needed for WebSocket attach)

Each structure has **one clear responsibility**.

---

## “Is User stored twice?”

**No.**

```js
rooms.get(roomId).set(userId, user);
usersById.set(userId, user);
```

* `new User(...)` creates **one object**
* Both Maps store a **reference** to the same object
* References are pointers, not copies

---

## Why not `roomId → [userId]`?

That would:

* require extra lookups (`userId → User`)
* add more code & cleanup logic
* often use **more memory** (strings cost more than references)

---

