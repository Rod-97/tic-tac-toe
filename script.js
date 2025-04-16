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

function GameController() {
  const gameboard = Gameboard();
  const board = gameboard.getBoard();

  const playRound = (row, col, playerToken) => {
    const cell = board[row][col];
    if (cell.getValue() !== "") return;
    cell.addToken(playerToken);
  };

  return { playRound, board };
}

const game = GameController();
const cell1 = game.board[0][2];
const cell2 = game.board[1][1];
console.log(cell1.getValue()); // ""
console.log(cell2.getValue()); // ""
game.playRound(0, 2, "X");
game.playRound(1, 1, "O");
console.log(cell1.getValue()); // "X"
console.log(cell2.getValue()); // "O"
