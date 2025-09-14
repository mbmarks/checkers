// 0 is empty
// 1 is red
// 2 is black
let board = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
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

            const pieceType = board[row][col]
            if (pieceType === 1 || pieceType === 2) {
                const piece = document.createElement("div");
                piece.classList.add("piece", pieceType === 1 ? "red" : "black");
                if (selected && selected.row == row && selected.col == col) {
                    piece.classList.add("selected");
                }

                // make draggable
                piece.draggable = true;
                piece.addEventListener("dragstart", (e) => {
                    dragSource = { row, col };
                    e.dataTransfer.setData("text/plain", `${row},${col}`);
                });

                square.appendChild(piece);
            }

            // Add click handler
            square.addEventListener("click", () => handleClick(row, col));

            square.addEventListener("dragover", (e) => e.preventDefault());

            square.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!dragSource) return;
                attemptMove(dragSource.row, dragSource.col, row, col);
                dragSource = null;
            });

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

function attemptMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (isValidMove(fromRow, fromCol, toRow, toCol, piece)) {
        board[toRow][toCol] = piece;
        board[fromRow][fromCol] = 0;

        // capture
        if (Math.abs(toRow - fromRow) === 2) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;
            board[midRow][midCol] = 0;
        }

        drawBoard();
        return true;
    }
    return false;
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