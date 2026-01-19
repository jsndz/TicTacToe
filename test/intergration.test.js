const axios2 = require("axios");

const axios = {
  post: async (...args) => {
    try {
      const res = await axios2.post(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },

  get: async (...args) => {
    try {
      const res = await axios2.get(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },

  put: async (...args) => {
    try {
      const res = await axios2.put(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },

  delete: async (...args) => {
    try {
      const res = await axios2.delete(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
};

const SERVER_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3000";
let roomId = "";
let creatorId = "";
let opponentId = "";

describe("join", () => {
  test("create room", async () => {
    const res = await axios.post(`${SERVER_URL}/rooms`, { username: "jaison" });
    roomId = res.data.roomId;
    creatorId = res.data.userId;
    expect(res.status).toBe(200);
  });
  test("join room", async () => {
    const res = await axios.post(`${SERVER_URL}/rooms/${roomId}/join`, {
      username: "james",
    });
    opponentId = res.data.userId;
    expect(res.status).toBe(200);
  });
  test("play game until winner is decided", (done) => {
    const wsX = new WebSocket(`${WS_URL}?userId=${creatorId}`);
    const wsO = new WebSocket(`${WS_URL}?userId=${opponentId}`);

    let gameOver = false;

    const cleanup = (err) => {
      if (gameOver) return;
      gameOver = true;
      wsX.close();
      wsO.close();
      err ? done(err) : done();
    };

    // failsafe
    const killSwitch = setTimeout(
      () => cleanup(new Error("Game did not finish")),
      8000
    );

    wsX.onopen = () => {
      wsX.send(
        JSON.stringify({
          type: "join",
          payload: { userId: creatorId, roomId },
        })
      );
    };

    wsO.onopen = () => {
      wsO.send(
        JSON.stringify({
          type: "join",
          payload: { userId: opponentId, roomId },
        })
      );
    };

    wsX.onmessage = (ev) => {
      const data = JSON.parse(ev.data);

      if (data.type === "start-game") {
        expect(data.payload.yourSymbol).toBe("X");

        wsX.send(
          JSON.stringify({ type: "move", payload: { position: 0 } })
        );
      }

      if (data.type === "movement") {
        const { game, winner } = data.state;

        if (winner) {
          expect(winner).toBe("X");
          clearTimeout(killSwitch);
          cleanup();
        }
      }
    };

    wsO.onmessage = (ev) => {
      const data = JSON.parse(ev.data);

      if (data.type === "movement") {
        const { game } = data.state;

        const filled = game.filter(Boolean).length;

        // deterministic O moves
        if (filled === 1) {
          wsO.send(
            JSON.stringify({ type: "move", payload: { position: 1 } })
          );
        }

        if (filled === 3) {
          wsO.send(
            JSON.stringify({ type: "move", payload: { position: 2 } })
          );
        }
      }
    };

    // X follow-up moves
    wsX.onmessage = (ev) => {
      const data = JSON.parse(ev.data);

      if (data.type === "movement") {
        const filled = data.state.game.filter(Boolean).length;

        if (filled === 2) {
          wsX.send(
            JSON.stringify({ type: "move", payload: { position: 4 } })
          );
        }

        if (filled === 4) {
          wsX.send(
            JSON.stringify({ type: "move", payload: { position: 8 } })
          );
        }
      }
    };

    wsX.onerror = cleanup;
    wsO.onerror = cleanup;
  });
});


