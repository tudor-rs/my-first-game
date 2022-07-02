const display = document.querySelector('display');
let enemyArray = [];

class Player {
    constructor(width, height, velocity, positionX, positionY) {
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.positionX = positionX;
        this.positionY = positionY;
    }
}

class Enemy {
    constructor(width, height, velocity, positionX, positionY) {
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.positionX = positionX;
        this.positionY = positionY;

        this.spawn = function () {
            enemyArray.push(this);
        }

        this.despawn = function () {
            let index = enemyArray.indexOf(this);
            enemyArray.splice(index, 1);
        }
    }
}

const player = new Player(50, 50, 50, display.clientWidth / 2, 0);
const playerDiv = document.createElement('div');
playerDiv.classList.add('player');

function updatePlayerPosition() {
    playerDiv.style.left = player.positionX + 'px';
    playerDiv.style.bottom = player.positionY + 'px';
}

document.body.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "ArrowLeft":
            player.positionX -= player.velocity;
            updatePlayerPosition();
            break;

        case "ArrowUp":
            player.positionY += player.velocity;
            updatePlayerPosition();
            break;

        case "ArrowRight":
            player.positionX += player.velocity;
            updatePlayerPosition();
            break;

        case "ArrowDown":
            player.positionY -= player.velocity;
            updatePlayerPosition();
            break;

        case "Escape":
            clearInterval(game);
            clearInterval((enemySpawnInterval));
            break;
    }
});

let enemySpawnInterval = setInterval(function () {
    let enemy = new Enemy(50, 50, 15, getRandomNumber(550), 550);
    enemy.spawn();
}, 500);

function updateEnemyPositions() {
    for (let enemy of enemyArray) {
        enemy.positionY = enemy.positionY - enemy.velocity;
        if (enemy.positionY < 0) {
            enemy.despawn();
        }
    }
}

function draw() {
    display.innerText = ' ';

    for (let enemy of enemyArray) {
        const drawnEnemy = document.createElement('div'); // change this variable name
        drawnEnemy.classList.add('enemy');
        drawnEnemy.style.left = `${enemy.positionX}px`;
        drawnEnemy.style.bottom = `${enemy.positionY}px`;
        drawnEnemy.style.width = `${enemy.width}px`;
        drawnEnemy.style.height = `${enemy.height}px`;
        display.appendChild(drawnEnemy);
    }

    playerDiv.style.width = player.width + 'px';
    playerDiv.style.height = player.height + 'px';
    playerDiv.style.left = player.positionX + 'px';
    playerDiv.style.bottom = player.positionY + 'px';
    display.appendChild(playerDiv);
}

let game = setInterval(function () {
    updateEnemyPositions();

    for (let enemy of enemyArray) {
        let collision = checkCollision(enemy);
        if (collision) {
            clearInterval(enemySpawnInterval);
            clearInterval(game);
            console.log('GAME OVER!');
        }
    }

    draw();

}, 1000 / 16);

function checkCollision(enemy) {
    let x = false;
    let y = false;

    if ((enemy.positionX <= player.positionX + player.width) &&
        (enemy.positionX + enemy.width >= player.positionX)) {
        x = true;
    }

    if ((enemy.positionY <= player.positionY + player.height) &&
        (enemy.positionY + enemy.height >= player.positionY)) {
        y = true;
    }

    if (x && y) {
        return true;
    }
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}