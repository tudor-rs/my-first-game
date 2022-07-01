const DISPLAY = document.querySelector('display');
let enemyArray = [];
let playerVelocity = 50;

const PLAYER = document.createElement('div');
PLAYER.classList.add('player');
DISPLAY.appendChild(PLAYER);

const playerWidth = 50;
const playerHeight = 50;
PLAYER.style.width = playerWidth + 'px';
PLAYER.style.height = playerHeight + 'px';

let playerPositionX = DISPLAY.clientWidth / 2;
let playerPositionY = 0;
PLAYER.style.left = playerPositionX + 'px';
PLAYER.style.bottom = playerPositionY + 'px';

document.body.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "ArrowLeft":
            playerPositionX -= playerVelocity;
            move();
            getPlayerPosition();
            break;

        case "ArrowUp":
            playerPositionY += playerVelocity;
            move();
            getPlayerPosition();
            break;

        case "ArrowRight":
            playerPositionX += playerVelocity;
            move();
            getPlayerPosition();
            break;

        case "ArrowDown":
            playerPositionY -= playerVelocity;
            move();
            getPlayerPosition();
            break;

        case "Escape":
            clearInterval(interval);
            clearInterval((spawnEnemies));
            break;
    }
});

function getPlayerPosition() {
    console.log(`X: ${playerPositionX} Y: ${playerPositionY}`);
}

function move() {
    PLAYER.style.left = playerPositionX + 'px';
    PLAYER.style.bottom = playerPositionY + 'px';
}

class Enemy {
    constructor(width, height, velocity, positionX, positionY) {
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.positionX = positionX;
        this.positionY = positionY;

        const ENEMY = document.createElement('div');
        DISPLAY.appendChild(ENEMY);
        ENEMY.classList.add('enemy');
        ENEMY.style.width = width + 'px';
        ENEMY.style.height = height + 'px';
        ENEMY.style.left = positionX + 'px';
        ENEMY.style.bottom = positionY + 'px';

        this.updatePosition = function () {
            positionY = positionY - velocity;
            ENEMY.style.bottom = positionY + 'px';
        };

        this.getPositionX = function () {
            return positionX;
        }

        this.getPositionY = function () {
            return positionY;
        };

        this.removeFromScreen = function () {
            DISPLAY.removeChild(ENEMY);
        }
    }
}

function checkCollision(enemy) {
    let x = false;
    let y = false;

    if ((enemy.getPositionX() <= playerPositionX + playerWidth) &&
        (enemy.getPositionX() + enemy.width >= playerPositionX)) {
        x = true;
    }

    if ((enemy.getPositionY() <= playerPositionY + playerHeight) &&
        (enemy.getPositionY() + enemy.height >= playerPositionY)) {
        y = true;
    }

    if (x && y) {
        return true;
    }
}

function getRandomPositionX(limit) {
    return Math.floor(Math.random() * limit);
}

let spawnEnemies = setInterval(function () {
    let enemy = new Enemy(50, 50, 10, getRandomPositionX(600), 600);
    enemyArray.push(enemy);
}, 500);


let interval = setInterval(function () {
    for (let i = 0; i < enemyArray.length; i++) {
        enemyArray[i].updatePosition();

        if (checkCollision(enemyArray[i])) {
            clearInterval(interval);
            clearInterval((spawnEnemies));
            console.log('--< GAME OVER >--');
        }

        else if (enemyArray[i].getPositionY() < 0 - enemyArray[i].height) {
            enemyArray.splice(enemyArray[i], 1);
            enemyArray[i].removeFromScreen();
        }

        // MUST DELETE FROM DOM HIDDEN ENEMIES
    }

}, 1000 / 16);