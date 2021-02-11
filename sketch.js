// X is User
// O is AI


// Tic Tac Toe Matrix
var real_grid = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

// Different HTML Elements
const $message = document.getElementById("message");
const $cells = document.querySelectorAll(".cell");
const $restartButton = document.getElementById("Restart");

// Click Listener to restart the game
$restartButton.addEventListener("click", clearGrid);

// Click Listener to listen user input
$cells.forEach((item) => {
  item.addEventListener("click", () => {

    // Provide position on tic tac toe matrix of user input
    let {row,col} = getPosition(item.id);

    // If game is not ended and position is empty then only play the game
    if(real_grid[row][col] == null && checkResult(real_grid) == null)
    {

      //  
      item.classList.add("not-allowed");
      console.log(real_grid)

      // Fill the tic tac toe matrix and give visual representation to user
      gridFill(item.id, "X");

      // Check the result
      let result = checkResult(real_grid)

      // If game is ended stop the game
      if(result!=null)
        stopGame(result);
      else
      { 
        // Time delay of 0.5 s for ai turn to give user a real time game 
        setTimeout(() => {
          aiTurn()
        },300)
      }
      
    }

  });

});

// Function to fill tic tac toe matrix and to give user a visual representation
function gridFill(id, text) {

  // Get position of input in tic tac toe matrix
  let {row,col} = getPosition(id);

  // Fill the matrix if position is empty
  if(real_grid[row][col] == null)
  {
    // Fill the tic tac toe matrix
    real_grid[row][col] = text;

    // Display the input to user
    document.getElementById(id).innerHTML = text;
    $cells[id-1].classList.add('not-allowed');
  }

}

// Function for ai's turn
function aiTurn() {

  // Get the optimal move position for ai using minimax
  let move = aiMove(real_grid);
  let id;

  // Find the id using matrix position
  if(move!=null){
  id = 3 * move.row + move.col + 1;
  }

  // Fill the tic tac toe matrix
  gridFill(id, "O");

  // Check the result
  let result = checkResult(real_grid)

  // If game is ended stop the game
  if(result!=null)
    stopGame(result)

}

// Function to restart the game
function clearGrid() {

  // Clear all grids 
  $cells.forEach((item) => {
    item.innerHTML = null;
    item.classList.remove("not-allowed");
  });

  // Clear the tic tac toe matrix
  for(let row=0;row<3;row++)
  {
    for(let col=0;col<3;col++)
      real_grid[row][col] = null;
  }

  // Clear the result message
  $message.innerHTML = null;

  // Disable the restart button
  $restartButton.disabled = true;

}

// Function to check the result
function checkResult(grid) {

  // Result of the game
  let result = null;
  
  // If their is any row in which all three colums have same symbol then 
  // player with that symbol won the match
  for (let row = 0; row < 3; row++) {
    if (grid[row][0] === grid[row][1] && grid[row][1] === grid[row][2] && grid[row][0]!=null) {
      result = grid[row][0];
      return result;
    }
  }
  
  // If their is any column in which all three rows have same symbol then 
  // player with that symbol won the match
  for (let col = 0; col < 3; col++) {
    if (grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col] && grid[0][col]!=null) {
      result = grid[0][col];
      return result;
    }
  }
  
  // If right diagonal is equal
  if ( grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2] && grid[0][0] != null ) {
    result = grid[0][0];
    return result;
  }
  
  // If left diagonal is equal
  if ( grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0] && grid[0][2] != null ) {
    result = grid[0][2];
    return result;
  }

  // Legal moves to play in game 
  let legalMove = 0;

  // Check all the position in tic tac toe matrix
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {

      // Increase legal move by 1 if position is empty
      if (grid[row][col] == null) legalMove++;
    }
  }
  // If legal moves are zero then game is tied
  if (legalMove === 0) {
    result = "T";
  }

  // Return the result
  return result;
}

// Fuction to calculate ai's move
function aiMove(grid) {

  let move;
  let bestScore = -Infinity;
  let depth = 0;
  

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (grid[row][col] == null) {
        grid[row][col] = "O";
        let score = minimax(grid, depth, false,-Infinity,+Infinity);
        grid[row][col] = null;
        if (score > bestScore) {
          bestScore = score;
          move = { row, col };
        }
      }
    }
  }

  return move;

}

// Map the score according to the result obtained for minimax algorithm
var scoreMapping = {
  O: 10,
  X: -10,
  T: 0
};

function minimax(grid, depth, maximize,alpha,beta) {

  let result = checkResult(grid);

  if (result != null) {
    return scoreMapping[result];
  }
  

  if (maximize) {
    
    let bestScore = -Infinity;
      let pruned = false;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (grid[row][col] == null) {
          grid[row][col] = "O";
          let score = minimax(grid, depth + 1, false,alpha,beta) - depth;
          grid[row][col] = null;
          if (score > bestScore) {
            bestScore = score;
          }
          alpha = (bestScore>alpha)?bestScore:alpha
          if(alpha>=beta)
          {
              pruned = true;
              break;
          }
        }
      }

      if(pruned)
          break;
    }

    return bestScore;
  }

  if (!maximize) {

    let bestScore = +Infinity;
      let pruned = false;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (grid[row][col] == null) {
          grid[row][col] = "X";
          let score = minimax(grid, depth + 1, true,alpha,beta) + depth;
          grid[row][col] = null;
          if (score < bestScore) {
            bestScore = score;
          }
          beta = (bestScore<beta)?bestScore:beta
          if(alpha>=beta)
          {
              pruned = true;
              break;
          }
        }
      }

      if(pruned)
          break;

    }

    return bestScore;
  }

}

// Function to stop the game
function stopGame(result) {

  $cells.forEach((item) => {
    item.classList.add("not-allowed");
  });

  // Enable the restart button
  $restartButton.disabled = false;

  // Show result to the user
  if(result === 'X')
    $message.innerHTML = "You Won the Match"
  else if(result === 'O')
    $message.innerHTML = "You Loose the Match"
  else
    $message.innerHTML = "The Game is Tied"  

}

// Function to find the position of input in tic tac toe matrix
// using grid id
function getPosition(id){

  let position;
  let col = id % 3;
  let row = id / 3;

  if (col === 0) {
    col = 3;
  }
  col--;

  if (row - Math.floor(row) === 0) {
    row = row - 1;
  }

  row = Math.floor(row);
  position = {row,col};
  return position;

}