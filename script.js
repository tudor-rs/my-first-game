const display = document.querySelector('display');
let gameWidth = 600;
let gameHeight = 600;

let score = 0;
let scoreDisplay = document.createElement('div');
scoreDisplay.classList.add('score');
scoreDisplay.style.left = `${gameWidth - 100}px`;
scoreDisplay.style.bottom = `${gameHeight - 50}px`;

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
    constructor(width, height, velocity, positionX, positionY, rotation) {
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.positionX = positionX;
        this.positionY = positionY;
        this.rotation = rotation;

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

class Star {
    constructor(width, height, velocity, positionX, positionY) {
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.positionX = positionX;
        this.positionY = positionY;

        this.spawn = function () {
            starArray.push(this);
        }

        this.despawn = function () {
            let index = starArray.indexOf(this);
            starArray.splice(index, 1);
        }
    }
}

// player

const player = new Player(60, 50, 10, display.clientWidth / 2, 0);
const playerDiv = document.createElement('div');
playerDiv.classList.add('player');

let keyArray = [];

function checkUserInput() {
    if (keyArray[0] == true) {
        player.positionX -= player.velocity;
    }

    if (keyArray[1] == true) {
        player.positionY += player.velocity;
    }

    if (keyArray[2] == true) {
        player.positionX += player.velocity;
    }

    if (keyArray[3] == true) {
        player.positionY -= player.velocity;
    }

    if (keyArray[4] == true) {
        shoot();
    }

    if (keyArray[5] == true) {
        cancelAnimationFrame(animationFrameId);
        clearInterval(enemySpawnInterval);
    }
}

window.onkeydown = function (e) {
    switch (e.key) {
        case "ArrowLeft":
            keyArray[0] = true;
            break;

        case "ArrowUp":
            keyArray[1] = true;
            break;

        case "ArrowRight":
            keyArray[2] = true;
            break;

        case "ArrowDown":
            keyArray[3] = true;
            break;

        case " ":
            keyArray[4] = true;
            break;

        case "Escape":
            keyArray[5] = true;
            break;
    }
};

window.onkeyup = function (e) {
    switch (e.key) {
        case "ArrowLeft":
            keyArray[0] = false;
            break;

        case "ArrowUp":
            keyArray[1] = false;
            break;

        case "ArrowRight":
            keyArray[2] = false;
            break;

        case "ArrowDown":
            keyArray[3] = false;
            break;

        case " ":
            keyArray[4] = false;
            break;

        case "Escape":
            keyArray[5] = false;
            break;
    }
};

function checkPlayerBoundaries() {
    if (player.positionX + player.width >= gameWidth) {
        player.positionX = gameWidth - player.width;
    }

    else if (player.positionX < 0) {
        player.positionX = 0;
    }

    if (player.positionY + player.height >= gameHeight) {
        player.positionY = gameHeight - player.height;
    }

    else if (player.positionY < 0) {
        player.positionY = 0;
    }
}

// projectile

let projectileArray = [];
let cooldown = false;

function shoot() {
    if (cooldown == false) {
        let projectile = new Projectile(5, 5, 25, player.positionX + player.width / 2, player.positionY);
        projectile.launch();
        let audio = new Audio('./sounds/laser.wav');
        audio.play();
        cooldown = true;
        setTimeout(() => cooldown = false, 200);
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

// enemy

let enemyArray = [];

let enemySpawnInterval = setInterval(function () {
    let enemy = new Enemy(50, 40, 1, getRandomNumber(550), 550, getRandomNumber(360));
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

// starfall

let starArray = [];

let starfallInterval = window.setInterval(function () {
    let star = new Star(1, 1, 25, getRandomNumber(550), 550);
    star.spawn();
}, 100);

function starFall() {
    for (let star of starArray) {
        if (star.positionY < 0) {
            star.despawn();
        }

        else {
            star.positionY = star.positionY - star.velocity;
        }
    }
}

// game

let animationFrameId;

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
                    score++;
                }
            }
        }
    }

    checkPlayerBoundaries();
    updateEnemyPositions();
    updateProjectilePositions();
    starFall();
    draw();
}
requestAnimationFrame(game);

function stopGame() {
    cancelAnimationFrame(animationFrameId);
    clearInterval(enemySpawnInterval);
    clearInterval(starfallInterval);
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
        drawnEnemy.style.rotate = `${enemy.rotation}deg`;
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

    for (let star of starArray) {
        const starDiv = document.createElement('div');
        starDiv.classList.add('star');
        starDiv.style.left = `${star.positionX}px`;
        starDiv.style.bottom = `${star.positionY}px`;
        starDiv.style.width = `${star.width}px`;
        starDiv.style.height = `${star.height}px`;
        display.appendChild(starDiv);
    }

    scoreDisplay.innerText = score;
    display.appendChild(scoreDisplay);
}

// utility

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

// todo
// add enemy images
// laser sound doesn't play always according to what's on screen
// despaghettify the code
// add menu, game over screen