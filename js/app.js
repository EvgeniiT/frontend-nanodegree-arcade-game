// Enemies our player must avoid
let Enemy = function() {
    // Variables applied to each of our instances go here
    let x, y, speed, maxSpeed, minSpeed;
    this.sprite = 'images/enemy-bug.png';
    this.setRandomProp();
    this.setInitProp();
};

// Set start speed range of enemies
Enemy.prototype.setInitProp = function() {
  this.minSpeed = 100;
  this.maxSpeed = 300;
};

// Increase speed range of enemies
Enemy.prototype.incSpeed = function() {
  this.minSpeed += 50;
  this.maxSpeed += 50;
};

// Set random speed and vertical position, horisontal position -101px
// because of the width of enemy sprite.
Enemy.prototype.setRandomProp = function() {
  this.x = -101;
  this.y = 65 + (Math.floor(Math.random() * 3)) * 83;
  this.speed = this.minSpeed + (Math.floor(Math.random() * (this.maxSpeed-this.minSpeed)));
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  if (this.x <= 505) {
    this.x += this.speed * dt;
  }
  else {
    this.setRandomProp();
  }
  if (player.y == this.y) {
    if (Math.abs(player.x - this.x) < 80) {
      document.querySelector('#gameOverModal').style.display = 'block';
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player that moves
var Player = function() {
  let x, y;
  this.sprite = 'images/char-boy.png';
  this.setInitProp();
};

// Change sprite of player
// Parameter: pathToSprite, string, path to sprite/image of player
Player.prototype.changeSprite = function(pathToSprite) {
  this.sprite = pathToSprite;
};

// Set start position
Player.prototype.setInitProp = function() {
  this.x = 202;
  this.y = 397;
};

// Change position of player depends on x and y
// keeps the player inside canva
// moves the player to start position if he reachs the water
Player.prototype.update = function() {
  if (this.x > 404) {
    this.x = 404;
  } else if (this.x < 0) {
    this.x = 0;
  }

  if (this.y > 397) {
    this.y = 397;
  } else if (this.y < 0) {
    this.setInitProp();
  }
};

// Draw the player on the screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle move directions
Player.prototype.handleInput = function(moveDirection) {
  switch (moveDirection) {
    case 'left':
      this.x -= 101;
      break;
    case 'right':
      this.x += 101;
      break;
    case 'up':
      this.y -= 83;
      break;
    case 'down':
      this.y += 83;
      break;
    default:
      break;
  }
};

// Gems our player must collect
let Gems = function() {
  let x, y, sprite, collectedCounter;
  this.setInitProp();
  this.setRandomProp();
};

// Set start properties
Gems.prototype.setInitProp = function() {
  this.collectedCounter = 0;
  this.sprite = [
    'images/Gem Blue.png',
    'images/Gem Orange.png',
    'images/Gem Green.png'
  ];
};
// Set random position
Gems.prototype.setRandomProp = function() {
  this.x = 26 + Math.floor(Math.random() * 5) * 101;
  this.y = 117 + (Math.floor(Math.random() * 3)) * 83;
};

// Update position of the gem if it is collected by Player
// change view of the gem
// if all sprites of the gem collected increases speed of enemies
Gems.prototype.update = function() {
    // 50 and 26 compinsate differenses because of compression of gem png.
    if ((Math.abs(player.y + 50 - this.y) < 10) && (Math.abs(player.x + 26 - this.x) < 10)) {
      this.collectedCounter ++;
      if ((this.collectedCounter % this.sprite.length) == 0) {
        allEnemies.forEach(enemy => enemy.incSpeed());
      }
      let temp = this.sprite.shift();
      this.sprite.push(temp);
      this.setRandomProp();
    }
};

// Draw gem on the screen
Gems.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[0]), this.x, this.y, 51, 86);
};

// Create set of enemies
// Parameter: numberOfEnemies, how many enemies we want to create
function createEnemies(numbOfEnemies) {
  let enemiesArr = [];
  for (let i = 0; i<numbOfEnemies; i++) {
    enemiesArr[i] = new Enemy();
  }
  return enemiesArr
}

let allEnemies = createEnemies(3);
let player = new Player();
let gems = new Gems();

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', evt => {
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[evt.keyCode]);
});

// Listens for restart button click
// returns player to the start position
// sets init gems properties
// sets new enemies position
// hide game over modal window
document.querySelector('.restart').addEventListener('click', evt => {
  player.setInitProp();
  gems.setInitProp();
  gems.setRandomProp();
  allEnemies.forEach( enemy => {
    enemy.setInitProp();
    enemy.setRandomProp();
  });
  document.querySelector('#gameOverModal').style.display = 'none';
});

// listens for munu button click
// opens/closes menu modal window
document.querySelector('.menu').addEventListener('click', evt => {
  const menuModal = document.querySelector('#menuModal');
  if (window.getComputedStyle(menuModal).display != "block") {
    menuModal.style.display = "block";
  } else {
    menuModal.style.display = "none";
  }
});

// Listens for char icon click
// sets player sprite to this icon
document.querySelector('.selectChar').addEventListener('click', evt => {
  if (evt.target.getAttribute('src') != null) {
    player.changeSprite(evt.target.getAttribute('src'));
  }
});
