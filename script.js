function Cell() {
  let value = 0;
  const addToken = (player) => (value = player);
  const getValue = () => value;
  return { addToken, getValue };
}

function Gameboard() {
  const board = [];
  const rows = 3;
  const columns = 3;

  for (let x = 0; x < rows; x++) {
    board[x] = [];
    for (let y = 0; y < columns; y++) {
      board[x].push(Cell());
    }
  }

  const getBoard = () => board;
  return { getBoard };
}

const gameboard = Gameboard();
console.log(gameboard.getBoard());
