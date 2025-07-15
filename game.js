// 游戏配置
const config = {
    canvasWidth: 300,
    canvasHeight: 300,
    gridSize: 15,
    speed: 150,
    loveMessages: [
        "宝贝，你是最棒的！❤",
        "永远爱你！💕",
        "你就是我的小可爱～😘",
        "今天也要开开心心的呀！🌈",
        "有你的每一天都很美好！✨"
    ]
};

// 游戏状态
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop = null;
let isGameRunning = false;

// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const loveMessageElement = document.getElementById('loveMessage');

// 设置画布大小
canvas.width = config.canvasWidth;
canvas.height = config.canvasHeight;

// 初始化游戏
function initGame() {
    snake = [
        { x: 7, y: 7 },
        { x: 6, y: 7 },
        { x: 5, y: 7 }
    ];
    score = 0;
    direction = 'right';
    nextDirection = 'right';
    scoreElement.textContent = score;
    generateFood();
    showLoveMessage();
}

// 生成食物
function generateFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * (config.canvasWidth / config.gridSize)),
            y: Math.floor(Math.random() * (config.canvasHeight / config.gridSize))
        };
        // 确保食物不会生成在蛇身上
        if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            break;
        }
    }
}

// 显示爱心消息
function showLoveMessage() {
    const randomMessage = config.loveMessages[Math.floor(Math.random() * config.loveMessages.length)];
    loveMessageElement.textContent = randomMessage;
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    // 绘制蛇
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 蛇头绘制成心形
            drawHeart(segment.x * config.gridSize + config.gridSize/2, 
                     segment.y * config.gridSize + config.gridSize/2, 
                     config.gridSize/2);
        } else {
            // 蛇身
            ctx.fillStyle = `rgba(255, 105, 180, ${1 - index / snake.length})`;
            ctx.fillRect(segment.x * config.gridSize, 
                        segment.y * config.gridSize, 
                        config.gridSize - 1, 
                        config.gridSize - 1);
        }
    });

    // 绘制食物（小心形）
    drawHeart(food.x * config.gridSize + config.gridSize/2, 
             food.y * config.gridSize + config.gridSize/2, 
             config.gridSize/3);
}

// 绘制心形
function drawHeart(x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + size);
    ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size/2);
    ctx.bezierCurveTo(x - size, y + size * 1.5, x, y + size * 1.75, x, y + size * 2);
    ctx.bezierCurveTo(x, y + size * 1.75, x + size, y + size * 1.5, x + size, y + size/2);
    ctx.bezierCurveTo(x + size, y, x, y, x, y + size);
    ctx.fillStyle = '#ff69b4';
    ctx.fill();
    ctx.restore();
}

// 移动蛇
function moveSnake() {
    direction = nextDirection;
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        showLoveMessage();
    } else {
        snake.pop();
    }

    // 检查游戏结束条件
    if (isGameOver(head)) {
        endGame();
        return;
    }

    // 穿墙
    head.x = (head.x + config.canvasWidth / config.gridSize) % (config.canvasWidth / config.gridSize);
    head.y = (head.y + config.canvasHeight / config.gridSize) % (config.canvasHeight / config.gridSize);

    snake.unshift(head);
    draw();
}

// 检查游戏是否结束
function isGameOver(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// 游戏结束
function endGame() {
    clearInterval(gameLoop);
    isGameRunning = false;
    startBtn.textContent = '重新开始';
    loveMessageElement.textContent = `游戏结束啦！最终得分：${score}分 💕`;
}

// 开始游戏
function startGame() {
    if (isGameRunning) {
        clearInterval(gameLoop);
        isGameRunning = false;
        startBtn.textContent = '开始游戏';
    } else {
        initGame();
        isGameRunning = true;
        startBtn.textContent = '暂停';
        gameLoop = setInterval(moveSnake, config.speed);
    }
}

// 事件监听
startBtn.addEventListener('click', startGame);

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// 移动端控制
document.getElementById('upBtn').addEventListener('click', () => {
    if (direction !== 'down' && isGameRunning) nextDirection = 'up';
});
document.getElementById('downBtn').addEventListener('click', () => {
    if (direction !== 'up' && isGameRunning) nextDirection = 'down';
});
document.getElementById('leftBtn').addEventListener('click', () => {
    if (direction !== 'right' && isGameRunning) nextDirection = 'left';
});
document.getElementById('rightBtn').addEventListener('click', () => {
    if (direction !== 'left' && isGameRunning) nextDirection = 'right';
});

// 移动端触摸事件防止滚动
document.addEventListener('touchmove', (e) => {
    if (isGameRunning) {
        e.preventDefault();
    }
}, { passive: false });
