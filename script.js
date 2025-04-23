function Cell() {
  let value = "";
  const addToken = (playerToken) => (value = playerToken);
  const getValue = () => value;
  return { addToken, getValue };
}

function Gameboard() {
  const board = [];
  const rows = 3;
  const cols = 3;

  for (let x = 0; x < rows; x++) {
    board[x] = [];
    for (let y = 0; y < cols; y++) {
      board[x].push(Cell());
    }
  }

  const getBoard = () => board;
  return { getBoard };
}

function checkAllRows(board) {
  let firstToken;
  for (let x = 0; x < board.length; x++) {
    firstToken = board[x][0].getValue();
    if (firstToken === "") continue;
    for (let y = 0; y < board.length; y++) {
      if (board[x][y].getValue() !== firstToken) break;
      if (y === board.length - 1) return true;
    }
  }
  return false;
}

function checkAllColumns(board) {
  let firstToken;
  for (let y = 0; y < board.length; y++) {
    firstToken = board[0][y].getValue();
    if (firstToken === "") continue;
    for (let x = 0; x < board.length; x++) {
      if (board[x][y].getValue() !== firstToken) break;
      if (x === board.length - 1) return true;
    }
  }
  return false;
}

function checkDiagonals(board) {
  const checkFirstDiagonal = () => {
    const firstToken = board[0][0].getValue();
    if (firstToken === "") return false;

    for (let i = 1; i < board.length; i++) {
      if (board[i][i].getValue() !== firstToken) break;
      if (i === board.length - 1) return true;
    }

    return false;
  };

  const checkSecondDiagonal = () => {
    let x = 0;
    let y = board.length - 1;
    const firstToken = board[x][y].getValue();
    if (firstToken === "") return false;

    while (x < board.length && y >= 0) {
      if (board[x][y].getValue() !== firstToken) break;
      if (x === board.length - 1 && y === 0) return true;
      x++;
      y--;
    }

    return false;
  };

  return checkFirstDiagonal() || checkSecondDiagonal();
}

function GameController(name1, name2) {
  let gameboard = Gameboard();
  let board = gameboard.getBoard();
  const player1 = { name: name1, token: "X" };
  const player2 = { name: name2, token: "O" };
  let currentPlayer = player1;

  const anyWinner = () => {
    return (
      checkAllRows(board) || checkAllColumns(board) || checkDiagonals(board)
    );
  };

  const isBoardFull = () => {
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board.length; y++) {
        if (board[x][y].getValue() === "") return false;
      }
    }
    return true;
  };

  const playRound = (row, col) => {
    const cell = board[row][col];
    if (cell.getValue() !== "") return;
    cell.addToken(currentPlayer.token);
    if (anyWinner(board)) {
      console.log(currentPlayer.name + " won!");
      return;
    }
    if (isBoardFull(board)) {
      console.log("It's a tie!");
      return;
    }
    if (currentPlayer.token === player1.token) currentPlayer = player2;
    else currentPlayer = player1;
  };

  const getBoard = () => board;

  const getCurrentPlayer = () => currentPlayer;

  const reset = () => {
    gameboard = Gameboard();
    board = gameboard.getBoard();
    currentPlayer = player1;
  };

  return {
    playRound,
    getBoard,
    getCurrentPlayer,
    anyWinner,
    isBoardFull,
    reset,
  };
}

function DisplayController(board) {
  const init = () => {
    const main = document.createElement("main");
    main.classList.add("main");
    const boardUI = document.createElement("div");
    boardUI.classList.add("board");

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.classList.add(`${row}-${col}`);
        boardUI.appendChild(cell);
      }
    }

    main.appendChild(boardUI);
    document.body.appendChild(main);
  };

  const addResetBtn = () => {
    const resetBtn = document.createElement("button");
    resetBtn.classList.add("reset-btn");
    resetBtn.textContent = "RESET";
    document.body.appendChild(resetBtn);
  };

  const getElements = (className) => {
    const elements = document.querySelectorAll(`.${className}`);
    return elements;
  };

  const populateCell = (row, col, token) => {
    const cell = document.getElementsByClassName(`${row}-${col}`)[0];
    cell.textContent = token;
  };

  const displayWinner = (name) => {
    const main = document.getElementsByClassName("main")[0];
    const winnerDiv = document.createElement("div");
    winnerDiv.classList.add("winner-div");
    if (name) winnerDiv.textContent = `${name} won!`;
    else winnerDiv.textContent = "It's a tie!";
    main.appendChild(winnerDiv);
  };

  const reset = () => {
    const main = document.getElementsByClassName("main")[0];
    main.remove();
    init();
  };

  return { init, addResetBtn, getElements, populateCell, displayWinner, reset };
}

function AppController() {
  const getPlayerNames = () => {
    const name1 = prompt("Player 1: ");
    const name2 = prompt("Player 2: ");
    return { name1, name2 };
  };

  const bindCellEvents = (game, UI) => {
    const cells = UI.getElements("cell");

    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        if (cell.textContent !== "" || game.anyWinner() || game.isBoardFull()) {
          return;
        }

        const cellPosition = cell.classList[1].split("-");
        const row = cellPosition[0];
        const col = cellPosition[1];
        const currentPlayer = game.getCurrentPlayer();
        game.playRound(row, col, currentPlayer.token);
        UI.populateCell(row, col, currentPlayer.token);

        if (game.anyWinner()) {
          UI.displayWinner(currentPlayer.name);
          return;
        }

        if (game.isBoardFull()) {
          UI.displayWinner();
          return;
        }
      });
    });
  };

  const play = () => {
    const { name1, name2 } = getPlayerNames();
    const game = GameController(name1, name2);
    const board = game.getBoard();
    const UI = DisplayController(board);
    UI.addResetBtn();
    UI.init();

    bindCellEvents(game, UI);

    const resetBtn = UI.getElements("reset-btn")[0];

    resetBtn.addEventListener("click", () => {
      game.reset();
      UI.reset();
      bindCellEvents(game, UI);
    });
  };

  return { play };
}

const { play } = AppController();
play();
