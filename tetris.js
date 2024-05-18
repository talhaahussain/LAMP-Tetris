function initialise() {
    var audio = new Audio("tetris.mp3"); // bg music
    audio.loop = true; // permanently loops bg music
    const tetris_bg = document.querySelector('.tetris-bg');
    const scoreDisplay = document.querySelector('#score');
    const startButton = document.getElementById('start');
    const instructionsButton = document.getElementById('instructions');
    let cells = Array.from(document.querySelectorAll('.tetris-bg div'));
    const cell = 10; // size of single square unit cell (width and height are identical)
    let score = 0;
    let rowsCleared = 0;
    let interval = 1000; // milliseconds
    let running = false; // allows running of game; if set to true, game will run

    const colours = [ // tetromino colours, according to colorswall.com
        '#00ffff', // light blue, for I tetromino
        '#0000ff', // blue, for J tetromino
        '#ff7f00', // orange, for L tetromino
        '#ffff00', // yellow, for O tetromino
        '#00ff00', // green, for S tetromino
        '#800080', // purple, for T tetromino
        '#ff0000', // red, for Z tetromino
    ];
      
    // Tetromino creation
    const iTetromino = [
        [1, cell + 1, cell * 2 + 1, cell * 3 + 1], // default rotation (0 degrees)
        [cell, cell + 1, cell + 2, cell + 3], // 90 degrees
        [1, cell + 1, cell * 2 + 1, cell * 3 + 1], // 180 degrees
        [cell, cell + 1, cell + 2, cell + 3] // 270 degrees
    ];

    const jTetromino = [
        [1, cell + 1, cell * 2 + 1, 2],
        [cell, cell + 1, cell + 2, cell * 2 + 2],
        [1, cell + 1, cell * 2 + 1, cell * 2],
        [cell, cell * 2, cell * 2 + 1, cell * 2 + 2]
    ];

    const lTetromino = [
        [0, 1, cell + 1, cell * 2 + 1],
        [2, cell, cell + 1, cell + 2],
        [1, cell + 1, cell * 2 + 1, cell * 2 + 2],
        [cell, cell + 1, cell + 2, cell * 2]
    ];

    const oTetromino = [
        [0, 1, cell, cell + 1],
        [0, 1, cell, cell + 1],
        [0, 1, cell, cell + 1],
        [0, 1, cell, cell + 1]
    ];

    const sTetromino = [
        [0, cell, cell + 1, cell * 2 + 1],
        [cell + 1, cell + 2, cell * 2, cell * 2 + 1],
        [0, cell, cell + 1,cell * 2 + 1],
        [cell + 1, cell + 2, cell * 2, cell * 2 + 1],
    ];
    
    const tTetromino = [
        [1, cell, cell + 1, cell + 2],
        [1, cell + 1, cell + 2, cell * 2 + 1],
        [cell, cell + 1, cell + 2, cell * 2 + 1],
        [1, cell, cell + 1, cell * 2 + 1]
    ];

    const zTetromino = [
        [cell, cell + 1, cell * 2 + 1, cell * 2 + 2], 
        [2, cell + 1, cell + 2, cell * 2 + 1],
        [cell, cell + 1, cell * 2 + 1, cell * 2 + 2],
        [2, cell + 1, cell + 2, cell * 2 + 1]
    ];
    
    // defining variables and constants in global space to allow free manipulation by methods
    const tetrominoes = [iTetromino, jTetromino, lTetromino, oTetromino, sTetromino, tTetromino, zTetromino];
    let random; // will allow for random selection of tetrominos
    let currentPosition; // indicates vertical position of current tetromino
    let currentRotation; // indicates orientation of current tetromino
    let currentBlock; // indicates current tetromino

    function control(e) { // Allows control of tetrominoes
        if (running) { // only accepts inputs if running
            if (e.keyCode === 37) {
                movePiece("left");
            }
            if (e.keyCode === 39) {
                movePiece("right");
            }
            if (e.keyCode === 40) { // down arrow
                dropPiece("soft"); // a soft drop will cause the piece to move down faster
            }
            if (e.keyCode === 32) { // spacebar
                dropPiece("hard"); // a hard drop immediately places the piece on the floor of the grid
            }
            if (e.keyCode == 38) { // up arrow
                rotatePiece("clockwise"); // ...will rotate current piece clockwise
            }
            if (e.keyCode == 90) { // Z key
                rotatePiece("anticlockwise"); // ...will rotate current piece anticlockwise
            }
        }
    }
    document.addEventListener('keydown', control); // eventlistener for keyboard input

    function render() { // Renders tetrominoes onscreen
        currentBlock.forEach(index => {
            cells[currentPosition + index].classList.add("tetromino");
            cells[currentPosition + index].style.backgroundColor = colours[random]; // colours tetromino
        })
    }

    function unrender() { // Unrenders tetrominoes from screen
        currentBlock.forEach(index => {
            cells[currentPosition + index].classList.remove("tetromino");
            cells[currentPosition + index].style.backgroundColor = ''; // wipes colour
        })
    }

    function newPiece() { // Spawns new tetromino
        currentPosition = 4; // start from top of grid
        random = Math.floor(Math.random() * tetrominoes.length); // allows for random selection of new tetromino
        currentRotation = 0; // reset orientation
        currentBlock = tetrominoes[random][currentRotation]; // assigns new tetromino, random to current block
        score ++; // increment score and display
        scoreDisplay.innerHTML = score;
    }

    function stopPiece() { // Checks if current tetromino has reached bottom 
        if (currentBlock.some(index => cells[currentPosition + index + cell].classList.contains('bottom'))) { 
        // if the current block is in contact with bottom of grid/tetromino that has been placed prior...
            currentBlock.forEach(index => cells[currentPosition + index].classList.add('bottom')); // add current block to placed tetrominoes
            newPiece(); // create new piece, and allow user to take control of the new piece
            render();
        }
    }

    function movePiece(direction) { // Moves current tetromino in specified direction
        if (direction == "down") {
            unrender();
            currentPosition += cell; // moves current piece down by one cell unit space
            render();
            stopPiece(); // checks if current piece has contacted ground/other pieces
        }
        if (direction == "left") {
            unrender();
            const isAtLeftEdge = currentBlock.some(index => (currentPosition + index) % cell === 0);
            if (!isAtLeftEdge) currentPosition -= 1;
            if (currentBlock.some(index => cells[currentPosition + index].classList.contains("bottom"))) {
                // disallows wrapping of block around to right edge
                currentPosition += 1; // immediately revert position prior to render if true
            }
            render()
        }
        if (direction == "right") {
            unrender();
            const isAtRightEdge = currentBlock.some(index => (currentPosition + index) % cell === cell - 1);
            if (!isAtRightEdge) currentPosition += 1;
            if (currentBlock.some(index => cells[currentPosition + index].classList.contains("bottom"))) {
                // disallows wrapping of block around to left edge
                currentPosition -= 1; // immediately revert position prior to render if true
            }
            render();
        }
    }

    function rotatePiece(direction) { // Rotates current tetromino in specified direction
        if (direction == "clockwise") {
            unrender();
            currentRotation ++; // increment rotation by 1, moving tetromino to next rotation state
            if (currentRotation === currentBlock.length) {
                currentRotation = 0; // reset tetromino rotation back to original
            }
            currentBlock = tetrominoes[random][currentRotation];
            if (currentBlock.some(index => (currentPosition + index) % cell === cell - 1) && currentBlock.some(index => (currentPosition + index) % cell === 0)) {
            // this is done to disallow clipping to other side of board    
                currentRotation --; // if clipping takes place, rotate back immediately before rendering again
            }
            currentBlock = tetrominoes[random][currentRotation];
            render();
        }
        if (direction == "anticlockwise") {
            unrender();
            currentRotation --; // decrement rotation by 1, moving tetromino to previous rotation state
            if (currentRotation === -1) {
                currentRotation = currentBlock.length - 1; // set tetromino rotation to last
            }
            currentBlock = tetrominoes[random][currentRotation]
            if (currentBlock.some(index => (currentPosition + index) % cell === cell - 1) && currentBlock.some(index => (currentPosition + index) % cell === 0)) {
            // this is done to disallow clipping to other side of board
                currentRotation ++; // if clipping takes place, rotate back immediately before rendering again
            }
            currentBlock = tetrominoes[random][currentRotation];
            render();
        }
    }

    function dropPiece(drop) { // Drops current tetromino with specified force
        if (drop == "soft") {
            movePiece("down"); // accelerates current piece down
        }
        if (drop == "hard") {
            while (true) { 
                movePiece("down"); // continually drops current piece
                if (currentPosition === 4) { 
                    /* when currentPosition is 4, this means a new piece has been picked up;
                    therefore, the hard drop must stop, or all pieces will hard drop until player loses.*/
                    return; // breaks out of method
                }
            }
        }
    }

    function clearRow() { // Checks if a row in grid is full, and eliminates if so
        for (let i = 0; i < 199; i += cell) { // Checking all cells in grid
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if (row.every(index => cells[index].classList.contains("bottom"))) {
                unrender(); // this is done to eliminate a bug where tetromino colours would be stuck in the air
                rowsCleared += 1;
                row.forEach(index => {
                    // removes relevant cells from screen
                    cells[index].classList.remove("bottom");
                    cells[index].classList.remove("tetromino");
                    cells[index].style.backgroundColor = '';
                })
                const cellsRemoved = cells.splice(i, cell);
                cells = cellsRemoved.concat(cells); 
                cells.forEach(cell => tetris_bg.appendChild(cell)); // adds blank grid cells back to game to stop the gamespace from shrinking
                render(); // rendering current tetromino back into game
            }
        }
    }

    function gameOver() { // Checks if the game is over
        if (currentBlock.some(index => cells[currentPosition + index].classList.contains("bottom"))) {
            alert("Game Over! You cleared " + rowsCleared + " row(s)."); // alerts user with no. of rows cleared
            document.getElementById("scoreInput").value = score;
            document.getElementById("scoreForm").submit(); // submits score in POST request to tetris.php
            return true; 
        }
    }

    function gameLoop() { // Continually runs, allows game to take place until termination
        if (running) {
            movePiece("down");
            clearRow();
            if (gameOver()) { // if gameOver is true...
                running = false; // set running to false, terminating the game.
            }
        }
    }

    startButton.addEventListener('click', () => {
        startButton.style.display = "none"; // start button disappears onclick
        instructionsButton.style.display = "none"; // instructions button disappears once game has started
        audio.play(); // bg music plays once game starts, will loop forever
        timer = setInterval(gameLoop, interval); /* calls 'gameLoop' once per second. This allows the game to play.
        The game runs at 1 frame per second, this can be adjusted to make gameplay faster/slower. In a potential future version,
        the game may adapt, getting faster as the user progresses. This will be done by steadily reducing 'interval' variable. */
        running = true; // this enables gameloop to run
        newPiece(); // spawn first piece
    })
    
    instructionsButton.addEventListener('click', () => {
        // alerts user with keybindings
        alert("INSTRUCTIONS: \n Use the left and right arrows to move falling pieces. \n Use the down arrow for a soft drop. \n Use the spacebar for a hard drop. \n Use the up arrow and Z to rotate.");
    })
} 