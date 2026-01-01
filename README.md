
# Multiplayer Tic Tac Toe

A real-time multiplayer Tic Tac Toe game built using HTML, CSS, JavaScript, Node.js, Express, and native WebSockets.

---

## Features

* Real-time multiplayer gameplay
* Turn-based move handling
* Win and draw detection
* Server-side game validation

---

## Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express
* Real-time Communication: WebSocket (`ws`)

---

## Project Structure

```text
TicTacToe/
├── index.js
├── package.json
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```

---

## Setup

1. Install dependencies

```bash
npm install
```

2. Start the server

```bash
npm start
```

3. Open the app

```
http://localhost:3000
```

Open the link in two browser tabs or on two devices to play.

---

## How It Works

* Clients connect to the server using WebSockets
* The server pairs two players into a game
* Moves are sent as WebSocket messages
* The server validates moves and broadcasts updates

---

## Future Improvements

* Matchmaking lobby
* Player identifiers
* Game restart support
* Persistent score tracking

---

## License

Open source for learning and personal use.

