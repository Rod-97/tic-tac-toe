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

  const anyWinner = () => {
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

    return checkAllRows() || checkAllColumns();
  };

  const playRound = (row, col, playerToken) => {
    const cell = board[row][col];
    if (cell.getValue() !== "") return;
    cell.addToken(playerToken);
  };

  return { playRound, board, anyWinner };
}

const game = GameController();
game.playRound(0, 2, "X");
game.playRound(1, 1, "O");
console.log(game.anyWinner()); // false
game.playRound(2, 2, "X");
game.playRound(0, 1, "O");
console.log(game.anyWinner()); // false
game.playRound(0, 0, "X");
game.playRound(2, 1, "O");
console.log(game.anyWinner()); // true
