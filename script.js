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

function anyWinner(board) {
  const checkAllRows = () => {
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
  };

  const checkAllColumns = () => {
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
  };

  const checkDiagonals = () => {
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
  };

  return checkAllRows() || checkAllColumns() || checkDiagonals();
}

function isBoardFull(board) {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board.length; y++) {
      if (board[x][y].getValue() === "") return false;
    }
  }
  return true;
}

function displayBoard(boardArg) {
  const board = document.createElement("div");
  board.classList.add("board");

  for (let row = 0; row < boardArg.length; row++) {
    for (let col = 0; col < boardArg.length; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add(`${row}-${col}`);
      board.appendChild(cell);
    }
  }

  document.body.appendChild(board);
}

function GameController() {
  const gameboard = Gameboard();
  const board = gameboard.getBoard();
  const player1 = "X";
  const player2 = "O";
  let currentPlayer = player1;
  displayBoard(board);

  const play = () => {
    const playRound = (row, col) => {
      const cell = board[row][col];
      if (cell.getValue() !== "") return;
      cell.addToken(currentPlayer);
      const cellUI = document.getElementsByClassName(`${row}-${col}`)[0];
      cellUI.textContent = currentPlayer;

      if (anyWinner(board) || isBoardFull(board)) {
        const winnerDiv = document.createElement("div");
        winnerDiv.classList.add("winner-div");
        if (anyWinner(board)) {
          winnerDiv.textContent = `Player ${currentPlayer} won!`;
        }
        if (!anyWinner(board) && isBoardFull(board)) {
          winnerDiv.textContent = "It's a tie!";
        }
        document.body.appendChild(winnerDiv);
        return;
      }

      if (currentPlayer === player1) currentPlayer = player2;
      else currentPlayer = player1;
    };

    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        if (anyWinner(board) || cell.textContent !== "") return;
        const cellPosition = cell.classList[1].split("-");
        const row = cellPosition[0];
        const col = cellPosition[1];
        playRound(row, col);
      });
    });
  };

  return { play };
}

const game = GameController();
game.play();
