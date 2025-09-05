// 0 is empty
// 1 is red
// 2 is black
let board = [
      [0,1,0,1,0,1,0,1],
      [1,0,1,0,1,0,1,0],
      [0,1,0,1,0,1,0,1],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [2,0,2,0,2,0,2,0],
      [0,2,0,2,0,2,0,2],
      [2,0,2,0,2,0,2,0]
    ];

const boardEl = document.getElementById("board");

let selected = null;

function drawBoard() {
    // clear board
    boardEl.innerHTML = "";

    // 8x8 board setup
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.dataset.row = row;
            square.dataset.col = col;
            // dark/light pattern
            if ((row + col) % 2 === 0) {
                square.classList.add("light");
            } else {
                square.classList.add("dark");
            }

            if (board[row][col] === 1) {
                const piece = document.createElement("div");
                piece.classList.add("piece", "red");
                if (selected && selected.row == row && selected.col == col) {
                    piece.classList.add("selected");
                }
                square.appendChild(piece);
            } else if (board[row][col] === 2) {
                const piece = document.createElement("div");
                piece.classList.add("piece", "black");
                if (selected && selected.row == row && selected.col == col) {
                    piece.classList.add("selected");
                }
                square.appendChild(piece);
            }

            // Add click handler
            square.addEventListener("click", () => handleClick(row, col));

            boardEl.appendChild(square);
        }
    }
}


function handleClick(row, col) {
    if (selected) {
        
        const piece = board[selected.row][selected.col]

        // If clicking empty dark square, move
        if (isValidMove(selected.row, selected.col, row, col, piece)) {

            // move piece
            board[row][col] = piece;
            board[selected.row][selected.col] = 0;

            // check if capture happened
            if (Math.abs(row - selected.row) === 2) {
                const midRow = (row + selected.row) / 2;
                const midCol = (col + selected.col) / 2;
                board[midRow][midCol] = 0; // remove captured piece
            }
            
            selected = null; // reset
            drawBoard();
            return;
        }
        // If clicked same piece, deselect
        if (selected.row === row && selected.col === col) {
            selected = null;
            drawBoard();
            return;
        }
    } 

    // Select piece if square has one
    if (board[row][col] !== 0) {
    selected = { row, col };
    drawBoard();
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol, piece) {
    // must be empty dark square
    if (board[toRow][toCol] !== 0 || (toRow + toCol) % 2 === 0) {
        return false;
    }

    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    // Regular one-step diagonal move
    if (Math.abs(colDiff) === 1) {
        if (piece === 1 && rowDiff === 1) return true; // red moves down
        if (piece === 2 && rowDiff === -1) return true; // black moves up
    }

    // Capture move (jump)
    if (Math.abs(colDiff) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        const middlePiece = board[midRow][midCol];

        if (piece === 1 && rowDiff === 2 && middlePiece === 2) return true; // red jumps black
        if (piece === 2 && rowDiff === -2 && middlePiece === 1) return true; // black jumps red
    }

    return false;
}

drawBoard()