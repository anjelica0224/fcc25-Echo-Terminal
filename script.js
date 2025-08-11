const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const foodSize = 10;

const baseSpeed   = 200;  
const speedFactor =   5;  
const minSpeed    =  30;  

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

let snake    = [{ x: 10, y: 10 }];
let food     = spawnFood();
let dx       = 1;
let dy       = 0;
let score    = 0;
let gameOver = false;

function drawSnake() {
  ctx.fillStyle = "green";
  for (let segment of snake) {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  }
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, foodSize, foodSize);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = spawnFood();
  } else {
    snake.pop();
  }

  const hitWall = (
    head.x < 0 ||
    head.x >= canvas.width / gridSize ||
    head.y < 0 ||
    head.y >= canvas.height / gridSize
  );
  const hitSelf = snake
    .slice(1)
    .some(seg => seg.x === head.x && seg.y === head.y);

  if (hitWall || hitSelf) {
    gameOver = true;
    alert("Game Over");
    restartButton.style.display = "block";
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0; dy = -1;
  } else if (e.key === "ArrowDown" && dy === 0) {
    dx = 0; dy = 1;
  } else if (e.key === "ArrowLeft" && dx === 0) {
    dx = -1; dy = 0;
  } else if (e.key === "ArrowRight" && dx === 0) {
    dx = 1; dy = 0;
  }
});

const restartButton = document.createElement("button");
restartButton.innerText = "Restart Game";
Object.assign(restartButton.style, {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "none"
});
document.body.appendChild(restartButton);

restartButton.addEventListener("click", () => {
  snake = [{ x: 10, y: 10 }];
  dx = 1; dy = 0;
  score = 0;
  food = spawnFood();
  gameOver = false;
  restartButton.style.display = "none";
  gameLoop();  
});

function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  drawSnake();
  drawFood();
  drawScore();

  const delay = Math.max(minSpeed, baseSpeed - score * speedFactor);
  setTimeout(gameLoop, delay);
}

gameLoop();
