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
            board[row][col] = board[selected.row][selected.col]; // move piece
            board[selected.row][selected.col] = 0; // clear old spot
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

    // only move 1 diagonal
    if (colDiff !== 1) return false;

    if (piece === 1) { 
    // red moves downward (increasing row)
    return rowDiff === 1;
    } else if (piece === 2) {
    // black moves upward (decreasing row)
    return rowDiff === -1;
    }
    return false;
}

drawBoard()