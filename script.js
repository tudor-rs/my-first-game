const display = document.querySelector('display');
let enemyArray = [];
let projectileArray = [];
let animationFrameId;

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

class Projectile {
    constructor(width, height, velocity, positionX, positionY) {
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.positionX = positionX;
        this.positionY = positionY;

        this.launch = function () {
            projectileArray.push(this);
        }

        this.purge = function () {
            let index = projectileArray.indexOf(this);
            projectileArray.splice(index, 1);
        }
    }
}

function shoot() {
    let projectile = new Projectile(5, 5, 25, player.positionX + player.width / 2, player.height);
    projectile.launch();
}

const player = new Player(50, 50, 10, display.clientWidth / 2, 0);
const playerDiv = document.createElement('div');
playerDiv.classList.add('player');

let keyPressed;

function checkUserInput() {
    switch (keyPressed) {
        case "ArrowLeft":
            player.positionX -= player.velocity;
            break;

        case "ArrowUp":
            player.positionY += player.velocity;
            break;

        case "ArrowRight":
            player.positionX += player.velocity;
            break;

        case "ArrowDown":
            player.positionY -= player.velocity;
            break;

        case " ":
            shoot();
            break;

        case "Escape":
            cancelAnimationFrame(animationFrameId);
            clearInterval(enemySpawnInterval);
            break;
    }
}

window.onkeydown = function (e) {
    switch (e.key) {
        case "ArrowLeft":
            keyPressed = "ArrowLeft"; 
            break;

        case "ArrowUp":
            keyPressed = 'ArrowUp';
            break;

        case "ArrowRight":
            keyPressed = 'ArrowRight';
            break;

        case "ArrowDown":
            keyPressed = 'ArrowDown';
            break;

        case " ":
            shoot();
            break;

        case "Escape":
            cancelAnimationFrame(animationFrameId);
            clearInterval(enemySpawnInterval);
            break;
    }
};

window.onkeyup = function (e) {
    switch (e.key) {
        case "ArrowLeft":
            keyPressed = '';
            break;

        case "ArrowUp":
            keyPressed = '';
            break;

        case "ArrowRight":
            keyPressed = '';
            break;

        case "ArrowDown":
            keyPressed = '';
            break;

        case " ":
            keyPressed = '';
            break;

        case "Escape":
            keyPressed = '';
            break;
    }
};

let enemySpawnInterval = setInterval(function () {
    let enemy = new Enemy(50, 50, 1, getRandomNumber(550), 550);
    enemy.spawn();
}, 1000);

function updateEnemyPositions() {
    for (let enemy of enemyArray) {
        enemy.positionY = enemy.positionY - enemy.velocity;
        if (enemy.positionY < 0) {
            enemy.despawn();
            stopGame();
        }
    }
}

function updateProjectilePositions() {
    for (let projectile of projectileArray) {
        projectile.positionY = projectile.positionY + projectile.velocity;
        if (projectile.positionY > 600) {
            projectile.purge();
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

    for (let projectile of projectileArray) {
        const projectileDiv = document.createElement('div');
        projectileDiv.classList.add('projectile');
        projectileDiv.style.left = `${projectile.positionX}px`;
        projectileDiv.style.bottom = `${projectile.positionY}px`;
        projectileDiv.style.width = `${projectile.width}px`;
        projectileDiv.style.height = `${projectile.height}px`;
        display.appendChild(projectileDiv);
    }

    playerDiv.style.width = player.width + 'px';
    playerDiv.style.height = player.height + 'px';
    playerDiv.style.left = player.positionX + 'px';
    playerDiv.style.bottom = player.positionY + 'px';
    display.appendChild(playerDiv);
}

function game() {
    animationFrameId = requestAnimationFrame(game);

    checkUserInput();

    for (let enemy of enemyArray) {
        if (checkCollision(enemy, player)) {
            clearInterval(enemySpawnInterval);
            cancelAnimationFrame(animationFrameId);
            console.log('GAME OVER!');
        }
    }

    if (projectileArray.length > 0) {
        for (let projectile of projectileArray) {
            for (let enemy of enemyArray) {
                if (checkCollision(enemy, projectile)) {
                    enemy.despawn();
                    projectile.purge();
                }
            }
        }
    }

    updateEnemyPositions();
    updateProjectilePositions();
    draw();
}
requestAnimationFrame(game);

function stopGame() {
    cancelAnimationFrame(animationFrameId);
    clearInterval(enemySpawnInterval);
}

function checkCollision(firstObject, secondObject) {
    let x = false;
    let y = false;

    if ((firstObject.positionX <= secondObject.positionX + secondObject.width) &&
        (firstObject.positionX + firstObject.width >= secondObject.positionX)) {
        x = true;
    }

    if ((firstObject.positionY <= secondObject.positionY + secondObject.height) &&
        (firstObject.positionY + firstObject.height >= secondObject.positionY)) {
        y = true;
    }

    if (x && y) {
        return true;
    }
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}