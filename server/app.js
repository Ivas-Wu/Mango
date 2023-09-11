// import { generateBoard } from './generateBoard';

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Data structure to store game sessions
const gameSessions = {};
const gameBoardSize = {};
const gameGenNum = {};
const gameTimer = {};
const gameCompletion = {};
const gameStatus = {}; // 0 not started, 1 started, 2 ended
const gameTurnTimer = {};

app.get('/', (req, res) => {
  res.send('Hello, Express with WebSocket!');
});

wss.on('connection', (ws) => {
  console.log('WebSocket connection established.');

  // Handle initial message from the client (joining a session)
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const action = data.action;
    console.log(data);

    if (action == 'join') {
      handleJoin(ws, data);
    }
    else if (action == 'start') {
      handleStart(ws, data);
    }
    else if (action == 'playAgain') {
      handlePlayAgain(ws, data);
    }
    else if (action == 'win') {
      handleWin(ws, data);
    }

  });

  // Handle WebSocket disconnections
  ws.on('close', () => {
    console.log('WebSocket connection closed.');

    // Remove the disconnected client from all game sessions it was part of
    for (const sessionId in gameSessions) {
      const session = gameSessions[sessionId];
      const index = session.indexOf(ws);
      if (index !== -1) {
        session.splice(index, 1);
        if (gameSessions[sessionId].length == 0) {
          gameStatus[sessionId] = 0;
          clearTimeout(gameTurnTimer[sessionId]);
          gameTurnTimer[sessionId] = null;
        }
        else {
          countPlayers(sessionId);
        }
        // console.log(session); // shift leader if leader left TODO
      }
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function handleJoin(ws, data) {
  const { sessionId } = data;
  if (sessionId) {
    let leader = false;
    // Create a new session if it doesn't exist
    if (!gameSessions[sessionId]) {
      gameSessions[sessionId] = [];
    }

    if (gameSessions[sessionId].length == 0) {
      leader = true;
    }

    // Add the client to the specified game session
    gameSessions[sessionId].push(ws);

    if (gameStatus[sessionId]) {
      // Maybe let them know game is in progress already?
    }

    // Notify the client that they've successfully joined the session
    ws.send(JSON.stringify({ action: 'joined', sessionId: sessionId }));
    ws.send(JSON.stringify({ leader: leader }));
    countPlayers(sessionId);
  } else {
    // Handle invalid or missing sessionId
    ws.send(JSON.stringify({ action: 'error', message: 'Invalid sessionId' }));
  }
}

function handleStart(ws, data) {
  const { sessionId, boardSize, numGen, timer, completion } = data;
  if (sessionId && boardSize != undefined && numGen != undefined && timer != undefined && completion != undefined) {
    gameBoardSize[sessionId] = boardSize;
    gameGenNum[sessionId] = numGen;
    gameTimer[sessionId] = timer;
    gameCompletion[sessionId] = completion;
    gameStatus[sessionId] = 1;

    gameSessions[sessionId].forEach(element => {
      // Timer UI is run in client and timer countdown is done on server atm without periodic updates so it can get desynced
      element.send(JSON.stringify({ action: 'start', board: generateBoard(boardSize), boardSize: boardSize, timer: timer, completion: completion }));
    });
    sendNumbers(sessionId);
  } else {
    ws.send(JSON.stringify({ action: 'error', message: 'Invalid something' }));
  }
}

function handlePlayAgain(ws, data) {
  const { sessionId } = data;
  if (sessionId) {
    gameStatus[sessionId] = 1;

    gameSessions[sessionId].forEach(element => {
      // Timer UI is run in client and timer countdown is done on server atm without periodic updates so it can get desynced
      element.send(JSON.stringify({ action: 'start', board: generateBoard(gameBoardSize[sessionId]), boardSize: gameBoardSize[sessionId], timer: gameTimer[sessionId], completion: gameCompletion[sessionId] }));
    });
    sendNumbers(sessionId);
  } else {
    ws.send(JSON.stringify({ action: 'error', message: 'Invalid sessionId' }));
  }
}

function handleWin(ws, data) {
  const { sessionId, name } = data;
  if (sessionId && name) {
    gameStatus[sessionId] = 2;
    gameSessions[sessionId].forEach(element => {
      element.send(JSON.stringify({ action: 'end', name: name }));
    });
    console.log("WIN");
  } else {
    ws.send(JSON.stringify({ action: 'error', message: 'Invalid sessionId' }));
  }
}

function countPlayers(sessionId) {
  gameSessions[sessionId].forEach(element => {
    element.send(JSON.stringify({ countPlayers: gameSessions[sessionId].length }));
  });
}

function sendNumbers(sessionId) {
  if (gameStatus[sessionId] == 1) {
    nums = generateNumbers(gameGenNum[sessionId], gameBoardSize[sessionId]);
    gameSessions[sessionId].forEach(element => {
      element.send(JSON.stringify({ numbers: nums }));
    });
    t = setTimeout(() => {
      sendNumbers(sessionId);
    }, gameTimer[sessionId] * 1000);
    gameTurnTimer[sessionId] = t;
  }
  else {
    console.log("Game is done!");
  }
}

function generateBoard(size) {
  let returnVal = [];
  const sqaureValues = generateNonDuplicateIntegers(1, size * size * 2, size * size);
  for (let i = 0; i < size * size; i++) {
    returnVal.push({
      value: sqaureValues[i],
      marked: false,
      complete: false,
      children: [],
    });
  }
  return returnVal;
}

function generateNumbers(num, size) {
  let returnVal = [];
  const gridNumbers = generateNonDuplicateIntegers(1, 2 * size + 1, num);
  for (let i = 0; i < num; i++) {
    returnVal.push({
      value: gridNumbers[i],
      marked: false,
      hold: false,
      used: false
    });
  }
  return returnVal;
}

function generateNonDuplicateIntegers(start, end, count) {
  if (count > end - start + 1) {
    throw new Error("Cannot generate more integers than the range allows.");
  }

  const numbers = new Set();
  while (numbers.size < count) {
    const number = Math.floor(Math.random() * (end - start + 1)) + start;
    if (!numbers.has(number)) {
      numbers.add(number);
    }
  }

  return Array.from(numbers);
}
