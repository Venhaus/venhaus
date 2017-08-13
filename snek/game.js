// TODO (2) only execute code if canvas is supported by browser
// TODO (2) restart button
// TODO (2) option for teleporting borders

// TODO (3) remove console logs

var currentDirection;
var previousDirection;
var gameCanvas = document.getElementById("gameCanvas");
var context = gameCanvas.getContext("2d");
var gameHeight = 400;
var gameWidth = 400;
var verticalPixels = 10;
var horizontalPixels = 10;
var pixelHeight = gameHeight / verticalPixels;
var pixelWidth = gameWidth / horizontalPixels;
var applePos;
var snakeArray = [];
var gameLost = false;
var delay = 300;

function Point(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}
Point.prototype.imitate = function(point) {
  this.x = point.x;
  this.y = point.y;
  return this;
};
Point.prototype.equals = function(point) {
  return (this.x == point.x && this.y == point.y);
};

function rndPoint() {
  return (new Point(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)));
}

function setApplePos() {
  applePos = rndPoint();
  //var appleFlag = false;
  for (let index in snakeArray) {
    if (snakeArray[index].equals(applePos)) {
      setApplePos();
      break;
    }
  }
}

function move(event) {
  if (event.keyCode == 37) {
    currentDirection = "left";
  } else if (event.keyCode == 38) {
    currentDirection = "up";
  } else if (event.keyCode == 39) {
    currentDirection = "right";
  } else if (event.keyCode == 40) {
    currentDirection = "down";
  }
}

function paintContext() {
  context.fillStyle = "white";
  context.fillRect(0, 0, gameWidth, gameHeight);
  context.fillStyle = "red";
  context.fillRect(Math.floor(applePos.x * pixelWidth + pixelWidth * 0.02), Math.floor(applePos.y * pixelHeight + pixelWidth * 0.02), Math.floor(pixelWidth * 0.96), Math.floor(pixelHeight * 0.96));
  context.fillStyle = "green";
  for (let index in snakeArray) {
    context.fillRect(Math.floor(snakeArray[index].x * pixelWidth + pixelWidth * 0.02), Math.floor(snakeArray[index].y * pixelHeight + pixelWidth * 0.02), Math.floor(pixelWidth * 0.96), Math.floor(pixelHeight * 0.96));
  }
  //Paint Snek eyes
  context.fillStyle = "black";
  if (currentDirection == "down") {
    context.fillRect(Math.floor(snakeArray[0].x*pixelWidth + pixelWidth * 0.2), Math.floor(snakeArray[0].y*pixelHeight + pixelHeight * 0.7), Math.floor(pixelWidth * 0.1), Math.floor(pixelHeight *0.1));
    context.fillRect(Math.floor(snakeArray[0].x*pixelWidth + pixelWidth * 0.7), Math.floor(snakeArray[0].y*pixelHeight + pixelHeight * 0.7), Math.floor(pixelWidth * 0.1), Math.floor(pixelHeight *0.1));
  } else if (currentDirection == "up") {
    context.fillRect(Math.floor(snakeArray[0].x*pixelWidth + pixelWidth * 0.2), Math.floor(snakeArray[0].y*pixelHeight + pixelHeight * 0.2), Math.floor(pixelWidth * 0.1), Math.floor(pixelHeight *0.1));
    context.fillRect(Math.floor(snakeArray[0].x*pixelWidth + pixelWidth * 0.7), Math.floor(snakeArray[0].y*pixelHeight + pixelHeight * 0.2), Math.floor(pixelWidth * 0.1), Math.floor(pixelHeight *0.1));
  } else if (currentDirection == "left") {
    context.fillRect(Math.floor(snakeArray[0].x*pixelWidth + pixelWidth * 0.2), Math.floor(snakeArray[0].y*pixelHeight + pixelHeight * 0.2), Math.floor(pixelWidth * 0.1), Math.floor(pixelHeight *0.1));
    context.fillRect(Math.floor(snakeArray[0].x*pixelWidth + pixelWidth * 0.2), Math.floor(snakeArray[0].y*pixelHeight + pixelHeight * 0.7), Math.floor(pixelWidth * 0.1), Math.floor(pixelHeight *0.1));
  } else if (currentDirection == "right") {
    context.fillRect(Math.floor(snakeArray[0].x*pixelWidth + pixelWidth * 0.7), Math.floor(snakeArray[0].y*pixelHeight + pixelHeight * 0.2), Math.floor(pixelWidth * 0.1), Math.floor(pixelHeight *0.1));
    context.fillRect(Math.floor(snakeArray[0].x*pixelWidth + pixelWidth * 0.7), Math.floor(snakeArray[0].y*pixelHeight + pixelHeight * 0.7), Math.floor(pixelWidth * 0.1), Math.floor(pixelHeight *0.1));
  }
}

function game() {
  //Move Snek tail
  for (let i = snakeArray.length - 1; i > 0; i--) {
    snakeArray[i] = new Point(snakeArray[i - 1].x, snakeArray[i - 1].y);
  }

  //Prevent Snek from turning 180 degrees
  if (currentDirection == "down" && previousDirection == "up" || currentDirection == "up" && previousDirection == "down" || currentDirection == "left" && previousDirection == "right" || currentDirection == "right" && previousDirection == "left") {
    currentDirection = previousDirection;
  }

  //Move Snek head
  if (currentDirection == "left" && snakeArray[0].x != 0) {
    snakeArray[0].x--;
  } else if (currentDirection == "right" && snakeArray[0].x != horizontalPixels - 1) {
    snakeArray[0].x++;
  } else if (currentDirection == "up" && snakeArray[0].y != 0) {
    snakeArray[0].y--;
  } else if (currentDirection == "down" && snakeArray[0].y != verticalPixels - 1) {
    snakeArray[0].y++;
  }
  previousDirection = currentDirection;

  //Check if Snek touches itself
  if (snakeArray.length > 1) {
    let snakeSubArray = snakeArray.slice(1);
    for (let index in snakeSubArray) {
      if (snakeArray[0].equals(snakeSubArray[index])) {
        gameLost = true;
        alert("You lost! \n Final Score: " + snakeArray.length);
      }
    }
  }

  //If Snek touches apple...
  if (snakeArray[0].x == applePos.x && snakeArray[0].y == applePos.y) {
    snakeArray.push(new Point().imitate(snakeArray[snakeArray.length - 1]));
    setApplePos();
    delay = delay * 0.95;
  }

  //Update canvas context or end game
  if (!gameLost) {
    paintContext();
    window.setTimeout(game, delay);
  }
} //end game()

document.addEventListener("keydown", move);

gameCanvas.setAttribute("height", gameHeight + "px");
gameCanvas.setAttribute("width", gameWidth + "px");

//Initialize
snakeArray[0] = rndPoint();
setApplePos();
window.setTimeout(game, delay);
