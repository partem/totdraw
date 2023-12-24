const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {};

const gravity = 0.5;

const player = {
    x: 400,
    y: canvas.height - 150 - 200,
    width: 50,
    height: 50,
    speed: 5,
    dy: 0,
    jumping: false,
    ground: canvas.height - 150,
};

const walls = [
    {x: 100, y: player.ground - 50, width: 150, height: 50},
    {x: 125, y: player.ground - 100, width: 100, height: 50},
    {x: 150, y: player.ground - 150, width: 50, height: 50},
];

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Load the sprite sheet
var spriteSheet = document.getElementById('spriteSheet');

// Function to draw the bumblebee sprite
function drawBee(x, y) {
    ctx.drawImage(spriteSheet, 640, 100, 512, 300, x, y, 50, 50);
}

// Function to draw the wall sprite
function drawWall(x, y, width, height) {
    for (let i = 0; i < width / 50; i++) {
        ctx.drawImage(spriteSheet, 100, 10, 50, 50, x + i * 50, y, 50, 50);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw ground
    ctx.fillStyle = 'green';
    ctx.fillRect(0, player.ground, canvas.width, canvas.height - player.ground);

    // Draw walls
    for (let wall of walls) {
        drawWall(wall.x, wall.y, wall.width, wall.height);
    }

    // Draw player
    drawBee(player.x, player.y);
}

gameLoop();

window.addEventListener('keydown', function(e) {
    keys[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
    delete keys[e.keyCode];
});

function update() {
    if (keys[37] && !collidingWithWall(player.x - player.speed, player.y)) { // Left arrow
        player.x -= player.speed;
    }
    if (keys[39] && !collidingWithWall(player.x + player.speed, player.y)) { // Right arrow
        player.x += player.speed;
    }
    if (keys[38] && player.jumping == false) { // Up arrow
        player.dy = -10;
        player.jumping = true;
    }
    player.dy += gravity;
    player.y += player.dy;
    if (player.y + player.height > player.ground) {
        player.y = player.ground - player.height;
        player.dy = 0;
        player.jumping = false;
    }
    for (let wall of walls) {
        if (collidingWithWall(player.x, player.y + player.dy)) {
            player.y = wall.y - player.height;
            player.dy = 0;
            player.jumping = false;
        }
    }
}
/*
function collidingWithWall(x, y) {
    for (let wall of walls) {
        if (x < wall.x + wall.width &&
            x + player.width > wall.x &&
            y < wall.y + wall.height &&
            y + player.height > wall.y) {
            return true;
        }
    }
    return false;
}
*/
function collidingWithWall(x, y) {
    for (let wall of walls) {
        if (x + player.width > wall.x && 
            y + player.height > wall.y &&
            x < wall.x + wall.width) {
            return true;
        }
    }
    return false;
}

