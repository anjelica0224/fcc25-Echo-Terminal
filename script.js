const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const foodSize = 10;
const baseSpeed = 200;
const speedFactor = 5;
const minSpeed = 30;

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

let snake = [{ x: 10, y: 10 }];
let food = spawnFood();
let dx = 1;
let dy = 0;
let score = 0;
let gameOver = false;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;

function drawSnake() {
    // Draw snake with retro glow effect
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const isHead = i === 0;
        
        // Create gradient for snake segments
        if (isHead) {
            ctx.fillStyle = "#0ff";
            ctx.shadowColor = "#0ff";
            ctx.shadowBlur = 15;
        } else {
            const alpha = 1 - (i / snake.length) * 0.5;
            ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
            ctx.shadowColor = "#0ff";
            ctx.shadowBlur = 8;
        }
        
        ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
        
        // Add border to snake segments
        ctx.strokeStyle = "#0ff";
        ctx.lineWidth = 1;
        ctx.strokeRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
    }
    ctx.shadowBlur = 0; // Reset shadow
}

function drawFood() {
    // Animated food with pulsing effect
    const time = Date.now() * 0.005;
    const pulse = Math.sin(time) * 0.3 + 0.7;
    
    ctx.fillStyle = "#ff006e";
    ctx.shadowColor = "#ff006e";
    ctx.shadowBlur = 15 * pulse;
    
    const offset = (gridSize - foodSize) / 2;
    ctx.fillRect(
        food.x * gridSize + offset, 
        food.y * gridSize + offset, 
        foodSize, 
        foodSize
    );
    
    // Add glowing border
    ctx.strokeStyle = "#ff006e";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 5;
    ctx.strokeRect(
        food.x * gridSize + offset, 
        food.y * gridSize + offset, 
        foodSize, 
        foodSize
    );
    
    ctx.shadowBlur = 0; // Reset shadow
}

function drawScore() {
    // Update external score display

    const highScoreDisplay = document.getElementById("highScoreDisplay");
    highScoreDisplay.textContent = `HIGH SCORE: ${highScore.toString().padStart(4, '0')}`;

    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = `CURRENT SCORE: ${score.toString().padStart(4, '0')}`;
    
    // Optional: Draw grid lines for retro feel
    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= canvas.width / gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= canvas.height / gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

let nextDx = 1;
let nextDy = 0;

function moveSnake() {
    dx = nextDx;
    dy = nextDy;
    
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
        // Addinng high score
        let isNewHigh = false;
        if (score > highScore) {
            highScore = score;
            isNewHigh = true;
            localStorage.setItem("highScore", highScore);
        }

        // Create retro game over effect
        ctx.fillStyle = "rgba(255, 0, 110, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#0ff";
        ctx.font = "bold 32px 'Courier New'";
        ctx.textAlign = "center";
        ctx.shadowColor = "#0ff";
        ctx.shadowBlur = 15;
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = "bold 18px 'Courier New'";
        ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

        if (isNewHigh) {
            ctx.fillStyle = "#ff006e";
            ctx.shadowColor = "#ff006e";
            ctx.shadowBlur = 20;
            ctx.font = "bold 20px 'Courier New'";
            ctx.fillText("NEW HIGH SCORE!", canvas.width / 2, canvas.height / 2 + 40);
        } 
        else {
            // Otherwise just show existing high score
            ctx.fillText(`HIGH SCORE: ${highScore}`, canvas.width / 2, canvas.height / 2 + 40);
        }

        ctx.shadowBlur = 0;
        ctx.textAlign = "left";
        
        restartButton.style.display = "block";
    }
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && dy === 0) {
        nextDx = 0; nextDy = -1;
    } else if (e.key === "ArrowDown" && dy === 0) {
        nextDx = 0; nextDy = 1;
    } else if (e.key === "ArrowLeft" && dx === 0) {
        nextDx = -1; nextDy = 0;
    } else if (e.key === "ArrowRight" && dx === 0) {
        nextDx = 1; nextDy = 0;
    }
});


const restartButton = document.createElement("button");
restartButton.innerText = "Restart Game";
document.body.appendChild(restartButton);

restartButton.addEventListener("click", () => {
    snake = [{ x: 10, y: 10 }];
    dx = 1; dy = 0;
    score = 0;
    food = spawnFood();
    gameOver = false;
    restartButton.style.display = "none";
    
    // Update score display
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = "SCORE: 0000";
    
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

if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
}


gameLoop();
