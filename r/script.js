const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {};

const gravity = 0.5;

const player = {
    x: 100,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    speed: 5,
    dy: 0,
    jumping: false,
    ground: canvas.height - 150,
};

const walls = [
    {x: 200, y: player.ground - 50, width: 50, height: 50},
    {x: 300, y: player.ground - 50, width: 50, height: 50},
    // Add more walls as needed
];

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw ground
    ctx.fillStyle = 'green';
    ctx.fillRect(0, player.ground, canvas.width, canvas.height - player.ground);

    // Draw walls
    ctx.fillStyle = 'brown';
    for (let wall of walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }

    // Draw player
    ctx.fillStyle = 'red'; 
    ctx.fillRect(player.x, player.y - player.height, player.width, player.height); 
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
    if (player.y > player.ground) {
        player.y = player.ground;
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