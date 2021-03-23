$('#instructions').html(`
<p>Pick between Easy, Medium, or Hard</p>
<p>Arrow keys to move snake</p>`)

let gameState = {
  board: [
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
  ],

  apple: [5, 8],
  score: 0,
  highScore: 0,
  intervalId: null,

  snake: {
    body: [[10, 4], [10, 5], [10, 6], [10, 7]],
    nextDirection: [-1, 0],
  }
}


function displayHighScore() {
  $('#high-score').append(gameState.highScore);
}

retrieveData()
displayHighScore()

function storeData() {
  localStorage.setItem('gameState',
    JSON.stringify(gameState))
}

function retrieveData() {
  const storage = localStorage.getItem('gameState')
  const prevGs = JSON.parse(storage)

  if (storage !== null) {
    gameState = prevGs
    refreshBoard()
    refreshSnake()
  };
}


function renderBoard() {
  const board = $('#board');
  board.empty();
  gameState.board.forEach(function (row, y) {
    row.forEach(function (cell, x) {

      const cellElem = $(`<div class="cell" data-y="${y}" data-x="${x}"></div>`);
      if (cell === 'snake') {
        cellElem.css('background-color', 'limegreen')
      }

      else if (cell !== 'snake' && cell !== 'apple') {
        cellElem.css('background-color', 'blueviolet')
      }

      else if (cell === 'apple') {
        cellElem.css('background-color', 'red')
        cellElem.css('border-radius', '50px')
        console.log(gameState.apple)
      }
      board.append(cellElem);
    })
  })
}


function addAppleToBoard() {
  const y = gameState.apple[0];
  const x = gameState.apple[1];
  gameState.board[y][x] = 'apple';
}

function placeRandomApple() {
  const appleX = Math.floor(Math.random() * 12);
  const appleY = Math.floor(Math.random() * 12);
  gameState.apple = [appleX, appleY];
  if (gameState.apple !== 'snake') {
    placeRandomApple()
  }
}

function addSnakeToBoard() {
  for (let i = 0; i < gameState.snake.body.length; ++i) {
    let segment = gameState.snake.body[i];
    const y = segment[0];
    const x = segment[1];
    if (gameState.board[y]) {
      gameState.board[y][x] = 'snake';
    }
  }
}

function snakeLength() {
  const length = gameState.snake.body.length
  $("#current-score").empty()
  $("#current-score").append(length)
}


function gameOver() {
  const head = gameState.snake.body[0];
  const headY = head[0];
  const headX = head[1];
  const directionY = headY + gameState.snake.nextDirection[0];
  const directionX = headX + gameState.snake.nextDirection[1];
  if (gameState.board[directionY] && gameState.board[directionY][directionX] === 'snake') {
    stopGame();
    $('.game-over').html(`<h3>BRUH, THAT'S GAME OVER!!<h3>
    <p>Try again?</p>
    <button class="play-again">Yes</button>`);
    $('.play-again').click(function () {
      $('.game-over').empty();
      refreshBoard();
      refreshSnake();
      addAppleToBoard();
      addSnakeToBoard();
      renderBoard();
    })
  }
  else if ((gameState.board[directionY] && gameState.board[directionY][directionX]) === undefined) {
    stopGame();
    $('.game-over').html(`<h3>BRUH, THAT'S GAME OVER!!<h3>
      <p>Try again?</p>
      <button class="play-again">Yes</button>`);
    $('.play-again').click(function () {
      $('.game-over').empty();
      refreshBoard();
      refreshSnake();
      addAppleToBoard();
      addSnakeToBoard();
      renderBoard();
    })
  }

  if (gameState.snake.body.length > gameState.highScore) {
    gameState.highScore = gameState.snake.body.length
  }

  $('#high-score').empty()
  displayHighScore()
  storeData();
}

function moveSnake() {
  const head = gameState.snake.body[0];
  const headY = head[0];
  const headX = head[1];
  const directionY = headY + gameState.snake.nextDirection[0];
  const directionX = headX + gameState.snake.nextDirection[1];
  gameOver(snakeLength());
  if (gameState.board[directionY] && gameState.board[directionY][directionX] === 'apple') {
    gameState.snake.body.unshift([directionY, directionX])
    placeRandomApple()

  }

  else {
    gameState.snake.body.pop()
    gameState.snake.body.unshift([directionY, directionX])
  }
}

function refreshSnake() {
  gameState.snake.body = [[10, 4], [10, 5], [10, 6], [10, 7]]
  gameState.snake.nextDirection = [-1, 0]
}

function refreshBoard() {
  return gameState.board = [
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
  ]
}

function tick() {
  refreshBoard();
  addSnakeToBoard();
  addAppleToBoard();
  moveSnake();
  renderBoard();
}

const startGameEasy = () => {
  gameState.intervalId = setInterval(tick, 1500 / 5)
}
const startGameMedium = () => {
  gameState.intervalId = setInterval(tick, 1500 / 10)
}

const startGameHard = () => {
  gameState.intervalId = setInterval(tick, 1500 / 15)
}

function stopGame() {
  clearInterval(gameState.intervalId);
}

function onBoardClick(event) {

  if (event.key === 'ArrowUp' && gameState.snake.nextDirection[0] !== 1) {
    gameState.snake.nextDirection = [-1, 0];
  }
  else if (event.key === 'ArrowDown' && gameState.snake.nextDirection[0] !== -1) {
    gameState.snake.nextDirection = [1, 0];
  }
  else if (event.key === 'ArrowRight' && gameState.snake.nextDirection[1] !== -1) {
    gameState.snake.nextDirection = [0, 1];
  }
  else if (event.key === 'ArrowLeft' && gameState.snake.nextDirection[1] !== 1) {
    gameState.snake.nextDirection = [0, -1];
  }
  else if (event.code === 'Space') {
    event.preventDefault();
  }
}

$(document).keydown(onBoardClick);

$('.start-easy').click(function () {
  startGameEasy()
})

$('.start-medium').click(function () {
  startGameMedium()
})

$('.start-hard').click(function () {
  startGameHard()
})

$('.pause').click(function () {
  stopGame()
})

$('.up').click(function () {
  if (gameState.snake.nextDirection[0] !== 1) {
    gameState.snake.nextDirection = [-1, 0]
  }
})

$('.down').click(function () {
  if (gameState.snake.nextDirection[0] !== -1) {
    gameState.snake.nextDirection = [1, 0]
  }
})

$('.left').click(function () {
  if (gameState.snake.nextDirection[1] !== 1) {
    gameState.snake.nextDirection = [0, -1]
  }
})

$('.right').click(function () {
  if (gameState.snake.nextDirection[1] !== -1) {
    gameState.snake.nextDirection = [0, 1]
  }
})

addAppleToBoard();
addSnakeToBoard();
renderBoard();