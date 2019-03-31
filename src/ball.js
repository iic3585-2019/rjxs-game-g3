export function makeBall() {
  return {
    speed: 2,
    acceleration: 0.5,
    x: 135,
    y: 150,
    directionX: -1,
    directionY: -1,
  };
}

export function nextPosition(currentPosition, speed, direction) {
  return currentPosition + speed * direction;
}

export function moveBallDirX(playgroundHTML, ball) {
  const width = playgroundHTML.offsetWidth;
  let { directionX } = ball;
  const positionX = nextPosition(ball.x, ball.speed, ball.directionX);
  if (positionX > width) {
    directionX = -1;
  }
  if (positionX < 0) {
    directionX = 1;
  }
  return directionX;
}

export function moveBallDirY(playgroundHTML, ball) {
  const height = playgroundHTML.offsetHeight;
  let { directionY } = ball;
  const positionY = nextPosition(ball.y, ball.speed, ball.directionY);
  if (positionY > height) {
    directionY = -1;
  }
  if (positionY < 0) {
    directionY = 1;
  }
  return directionY;
}

export function moveBallPos(ball, direction) {
  return ball.speed * direction;
}

export function changeBallPos(ball, dirX, posX, dirY, posY) {
  ball.directionX = dirX;
  ball.directionY = dirY;
  ball.x += posX;
  ball.y += posY;
}

export function drawBall(ballHTML, ball) {
  ballHTML.style.left = `${ball.x}px`;
  ballHTML.style.top = `${ball.y}px`;
}

export function changeDirY(ball) {
  ball.directionY *= -1;
  ball.speed += ball.acceleration;
}

export function buildPos(dirX, dirY, x, y) {
  return {
    directionX: dirX,
    directionY: dirY,
    x,
    y,
  };
}
