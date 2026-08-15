const board = document.getElementById('game-board');
const ctx = board.getContext('2d');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');

const gridSize = 20;
const tileSize = board.width / gridSize;

let snake;
let direction;
let nextDirection;
let food;
let score;
let isGameOver;
let lastTimestamp = 0;
const moveInterval = 140;

function setStatus(message) {
  statusEl.textContent = message;
}

function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  isGameOver = false;
  scoreEl.textContent = String(score);
  setStatus('Aperte as setas para jogar');
  food = randomFood();
  draw();
}

function randomFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

  return newFood;
}

function isCollision(x, y) {
  if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
    return true;
  }

  return snake.some(segment => segment.x === x && segment.y === y);
}

function updateGame() {
  if (isGameOver) {
    return;
  }

  direction = nextDirection;
  const head = snake[0];
  const nextHead = {
    x: head.x + direction.x,
    y: head.y + direction.y
  };

  if (isCollision(nextHead.x, nextHead.y)) {
    isGameOver = true;
    setStatus('GAME OVER! Pressione espaço para reiniciar');
    return;
  }

  snake.unshift(nextHead);

  if (nextHead.x === food.x && nextHead.y === food.y) {
    score += 1;
    scoreEl.textContent = String(score);
    setStatus('Coração pego!');
    food = randomFood();
  } else {
    snake.pop();
  }
}

function drawGrid() {
  ctx.fillStyle = '#020817';
  ctx.fillRect(0, 0, board.width, board.height);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 1;

  for (let i = 0; i <= gridSize; i += 1) {
    const pos = i * tileSize;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, board.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(board.width, pos);
    ctx.stroke();
  }
}

function drawFood() {
  const centerX = food.x * tileSize + tileSize / 2;
  const centerY = food.y * tileSize + tileSize / 2;

  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f43f5e';
  ctx.fillText('❤', centerX, centerY + 1);
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const x = segment.x * tileSize;
    const y = segment.y * tileSize;
    const size = tileSize - 2;

    ctx.fillStyle = index === 0 ? '#fab4dd' : '#e627c6';
    ctx.fillRect(x + 1, y + 1, size, size);
  });
}

function draw() {
  drawGrid();
  drawFood();
  drawSnake();
}

function handleKeydown(event) {
  const key = event.key.toLowerCase();

  const directionMap = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 }
  };

  const newDirection = directionMap[key];

  if (!newDirection) {
    if (isGameOver && (event.code === 'Space' || event.key === 'Enter')) {
      resetGame();
    }
    return;
  }

  event.preventDefault();

  if (newDirection.x === -direction.x && newDirection.y === -direction.y) {
    return;
  }

  nextDirection = newDirection;
}

document.addEventListener('keydown', handleKeydown);

function gameLoop(timestamp) {
  const delta = timestamp - lastTimestamp;

  if (delta >= moveInterval) {
    updateGame();
    draw();
    lastTimestamp = timestamp;
  }

  requestAnimationFrame(gameLoop);
}

resetGame();
requestAnimationFrame(gameLoop);
