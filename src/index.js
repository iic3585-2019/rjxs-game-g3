import { fromEvent, interval, zip } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import './styles/index.scss';

const STATUSES = { STOPED: 'STOPED', RUNNING: 'RUNNING', GAMEOVER: 'GAMEOVER' };

const pong = {
  status: STATUSES.STOPED,
  pressedKeys: [],
  score: 0,
  isHit: 0,
  ball: {
    speed: 3,
    x: 135,
    y: 100,
    directionX: -1,
    directionY: -1,
  },
};

const pong2 = {
  status: STATUSES.STOPED,
  pressedKeys: [],
  score: 0,
  isHit: 0,
  ball: {
    speed: 3,
    x: 135,
    y: 20,
    directionX: -1,
    directionY: -1,
  },
};

const KEYS = {
  LEFT: 37,
  RIGHT: 39,
  A: 65,
  D: 68,
};

function moveRacket(racketHTML, pong) {
  // console.log('moveRacket-1', pong.pressedKeys);
  const left = racketHTML.offsetLeft;
  if (pong.pressedKeys[KEYS.LEFT]) {
    return left - 5;
  }
  if (pong.pressedKeys[KEYS.RIGHT]) {
    return left + 5;
  }
  return left;
}

function moveRacket2(racket2HTML, pong2) {
  // console.log('moveRacket-2', pong2.pressedKeys);
  const left = racket2HTML.offsetLeft;
  if (pong2.pressedKeys[KEYS.A]) {
    return left - 5;
  }
  if (pong2.pressedKeys[KEYS.D]) {
    return left + 5;
  }
  return left;
}

function drawRacket(racketHTML, pixelPos) {
  racketHTML.style.left = `${pixelPos}px`;
}

function drawRacket2(racket2HTML, pixelPos) {
  racket2HTML.style.left = `${pixelPos}px`;
}

function nextPosition(currentPosition, speed, direction) {
  return currentPosition + speed * direction;
}

function moveBallDirectionX(playgroundHTML, ball) {
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

function moveBallDirectionY(playgroundHTML, ball) {
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

function moveBallPosition(ball, direction) {
  return ball.speed * direction;
}

function changeBallPosition(ball, dirX, posX, dirY, posY) {
  ball.directionX = dirX;
  ball.directionY = dirY;
  ball.x += posX;
  ball.y += posY;
}

function drawBall(ballHTML, ball) {
  ballHTML.style.left = `${ball.x}px`;
  ballHTML.style.top = `${ball.y}px`;
}

function racketPositionY(racketHTML, ballHTML) {
  const ballSize = ballHTML.offsetHeight;
  return racketHTML.offsetTop - ballSize / 2; // subtracting size of ball for doesn't pass through racket
}

function racket2PositionY(racket2HTML, ballHTML) {
  const ballSize = ballHTML.offsetHeight;
  return racket2HTML.offsetTop - ballSize / 2; // subtracting size of ball for doesn't pass through racket
}

function isRacketHit(racketHTML, ballHTML, ball) {
  const racketBorderLeft = racketHTML.offsetLeft;
  const racketBorderRight = racketBorderLeft + racketHTML.offsetWidth;
  const posX = nextPosition(ball.x, ball.speed, ball.directionX);
  const posY = nextPosition(ball.y, ball.speed, ball.directionY);
  const racketPosY = racketPositionY(racketHTML, ballHTML);
  const res = posX >= racketBorderLeft && posX <= racketBorderRight && posY >= racketPosY;
  if (res) {
    console.log('racket-1 hit');
  }
  return res;
}

function isRacketHit2(racket2HTML, ballHTML, ball) {
  const racketBorderLeft = racket2HTML.offsetLeft;
  const racketBorderRight = racketBorderLeft + racket2HTML.offsetWidth;
  const posX = nextPosition(ball.x, ball.speed, ball.directionX);
  const posY = nextPosition(ball.y, ball.speed, ball.directionY);
  const racketPosY = racket2PositionY(racket2HTML, ballHTML);
  const res = posX >= racketBorderLeft && posX <= racketBorderRight && posY <= racketPosY+20; // adding racket height to because ball is hitting from below
  if (res) {
    console.log('racket-2 hit');
  }
  return res;
}

function changeScore(pong) {
  pong.score++;
}

function drawScore(scoreHTML, score) {
  scoreHTML.innerHTML = score;
}

function changeDirectionY(ball) {
  ball.directionY *= -1;
}

function isGameOver(racketHTML, ballHTML, ball) {
  const bottomPos = racketHTML.offsetHeight;
  const posY = nextPosition(ball.y, ball.speed, ball.directionY) - bottomPos;
  const racketPosY = racketPositionY(racketHTML, ballHTML);
  return posY > racketPosY;
}

function isGameOver2(racketHTML, ballHTML, ball) {
  const bottomPos = racketHTML.offsetHeight;
  const posY = nextPosition(ball.y, ball.speed, ball.directionY) - bottomPos;
  const racketPosY = racketPositionY(racketHTML, ballHTML);
  return posY+20 < racketPosY;
}

function endGame(pong) {
  pong.status = STATUSES.GAMEOVER;
  pong2.status = STATUSES.GAMEOVER;
}

function drawEndGame(gameOverHTML, playerNum) {
  gameOverHTML.style.display = 'block';
  gameOverHTML.innerHTML = "player"+playerNum+" won!<br/>press F5 to play again"
}

function isRunning() {
  return pong.status === STATUSES.RUNNING;
}

function isStoped() {
  return pong.status === STATUSES.STOPED;
}

function isRunning2() {
  return pong.status === STATUSES.RUNNING;
}

function isStoped2() {
  return pong.status === STATUSES.STOPED;
}

function buildPosition(dirX, dirY, x, y) {
  return {
    directionX: dirX,
    directionY: dirY,
    x,
    y,
  };
}

function load() {
  const playgroundHTML = document.getElementById('playground');
  const racketHTML = document.getElementById('racket-1');
  const racket2HTML = document.getElementById('racket-2');
  const ballHTML = document.getElementById('ball');
  const scoreHTML = document.getElementById('score');
  const scoreHTML2 = document.getElementById('score2');
  const startHTML = document.getElementById('start-message');
  const gameOverHTML = document.getElementById('game-over');
  const keyDown = fromEvent(document, 'keydown');
  const keyUp = fromEvent(document, 'keyup');
  const gameInterval = interval(16);
  const loop = gameInterval.pipe(filter(isRunning));
  const loop2 = gameInterval.pipe(filter(isRunning2));
  const stoped = keyDown.pipe(filter(isStoped));
  const stoped2 = keyDown.pipe(filter(isStoped2));
  const newDirX = loop.pipe(map(() => moveBallDirectionX(playgroundHTML, pong.ball)));
  const newDirY = loop.pipe(map(() => moveBallDirectionY(playgroundHTML, pong.ball)));
  const newPosX = newDirX.pipe(map(dirX => moveBallPosition(pong.ball, dirX)));
  const newPosY = newDirY.pipe(map(dirY => moveBallPosition(pong.ball, dirY)));
  const newBallPos = zip(newDirX, newDirY, newPosX, newPosY, buildPosition);
  const moveRacketPos = loop.pipe(map(() => moveRacket(racketHTML, pong)));
  const moveRacketPos2 = loop2.pipe(map(() => moveRacket2(racket2HTML, pong2)));
  const hit = loop.pipe(filter(() => isRacketHit(racketHTML, ballHTML, pong.ball)));
  const hit2 = loop2.pipe(filter(() => isRacketHit2(racket2HTML, ballHTML, pong.ball)));
  const gameOver = loop.pipe(filter(() => isGameOver(racketHTML, ballHTML, pong.ball)));
  const gameOver2 = loop2.pipe(filter(() => isGameOver2(racket2HTML, ballHTML, pong.ball)));

  keyDown.subscribe((event) => {
    if (event.which === KEYS.LEFT || event.which === KEYS.RIGHT) {
      pong.pressedKeys[event.which] = true;
    } else if (event.which === KEYS.A || event.which === KEYS.D) {
      pong2.pressedKeys[event.which] = true;
    }
  });
  keyUp.subscribe((event) => {
    if (event.which === KEYS.LEFT || event.which === KEYS.RIGHT) {
      pong.pressedKeys[event.which] = false;
    } else if (event.which === KEYS.A || event.which === KEYS.D) {
      pong2.pressedKeys[event.which] = false;
    }
  });

  stoped.subscribe((event) => {
    pong.status = STATUSES.RUNNING;
    startHTML.style.display = 'none';
  });

  stoped2.subscribe((event) => {
    pong2.status = STATUSES.RUNNING;
    startHTML.style.display = 'none';
  });

  newBallPos.subscribe((pos) => {
    changeBallPosition(pong.ball, pos.directionX, pos.x, pos.directionY, pos.y);
    drawBall(ballHTML, pong.ball);
  });

  moveRacketPos.subscribe((pixelPos) => {
    drawRacket(racketHTML, pixelPos);
  });

  moveRacketPos2.subscribe((pixelPos) => {
    drawRacket2(racket2HTML, pixelPos);
  });

  hit.subscribe((hit) => {
    changeDirectionY(pong.ball);
    changeScore(pong);
    drawScore(scoreHTML, pong.score);
  });

  hit2.subscribe((hit2) => {
    changeDirectionY(pong.ball);
    changeScore(pong2);
    drawScore(scoreHTML2, pong2.score);
  });

  gameOver.subscribe(() => {
    endGame(pong);
    drawEndGame(gameOverHTML, 2);
  });

  gameOver2.subscribe(() => {
    endGame(pong);
    drawEndGame(gameOverHTML, 1);

  });
}

window.onload = load;
