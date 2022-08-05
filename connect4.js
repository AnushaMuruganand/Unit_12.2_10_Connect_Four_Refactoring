/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game{
    constructor(p1, p2, height, width) {
        this.players = [p1, p2];
        this.HEIGHT = height;
        this.WIDTH = width;
        this.board = [];
        this.currPlayer = p1;
        this.makeBoard();
        this.makeHtmlBoard();
    }

    /** makeBoard: create in-JS board structure:
    *   board = array of rows, each row is array of cells  (board[y][x])
    */
    makeBoard() {
        for (let y = 0; y < this.HEIGHT; y++) {
            this.board.push(Array.from({ length: this.WIDTH }));
          }
    }

    /** makeHtmlBoard: make HTML table and row of column tops. */
    makeHtmlBoard() {
        const board = document.getElementById('board');
        board.innerHTML = '';
    
        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');

        // store a reference to the handleClick bound function 
        // so that we can remove the event listener correctly later
        this.handleGameClickBind = this.handleClick.bind(this);
        top.addEventListener('click', this.handleGameClickBind);
    
        for (let x = 0; x < this.WIDTH; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }
    
        board.append(top);
    
        // make main part of board
        for (let y = 0; y < this.HEIGHT; y++) {
            const row = document.createElement('tr');
            for (let x = 0; x < this.WIDTH; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }
            board.append(row);
        }
    }

    /** findSpotForCol: given column x, return top empty y (null if filled) */

    findSpotForCol(x) {
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
            return y;
          }
        }
        return null;
      }
    
    /** placeInTable: update DOM to place piece into HTML table of board */
    
    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currPlayer.color;
        piece.style.top = -50 * (y + 2);
    
        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }
    
    /** endGame: announce game end */
    
    endGame(msg) {
        alert(msg);

        // To remove the event listener after the game has ended so that we cannot make further moves
        document.getElementById('column-top').removeEventListener("click", this.handleGameClickBind);
    }

    /** handleClick: handle click of column top to play piece */

    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;
    
        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }
    
        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);
        
        // check for win
        if (this.checkForWin()) {
            return this.endGame(`Player ${this.currPlayer.color} won!`);
        }
        
        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
            return this.endGame('Tie!');
        }
        
        // switch players
        this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */

    checkForWin() {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer
        
        const _win = (cells) => cells.every(
            ([y, x]) =>
                y >= 0 &&
                y < this.HEIGHT &&
                x >= 0 &&
                x < this.WIDTH &&
                this.board[y][x] === this.currPlayer
        );
    
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
        
                // find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
}

class Player{
    constructor(color) {
        this.color = color;
    }
}

document.getElementById('start-game').addEventListener('click', function () {
    const p1 = new Player(document.getElementById('p1-color').value);
    const p2 = new Player(document.getElementById('p2-color').value);
    new Game(p1, p2, 6, 7);
});
