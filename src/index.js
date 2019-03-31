import { fromEvent, interval, zip } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import './styles/index.scss';

import {
  makeRacket,
  moveRacket,
  moveRacket2,
  drawRacket,
  drawRacket2,
  isRacketHit,
  isRacketHit2,
} from './racket';
import {
  makeBall,
  moveBallDirX,
  moveBallDirY,
  moveBallPos,
  changeBallPos,
  drawBall,
  changeDirY,
  buildPos,
} from './ball';
import {
  KEYS,
  STATUSES,
  changeScore,
  drawScore,
  isGameOver,
  endGame,
  drawEndGame,
  restart,
} from './game';

function isRunning() {
  return racket.status === STATUSES.RUNNING;
}

function isStoped() {
  return racket.status === STATUSES.STOPED;
}

function isRunning2() {
  return racket2.status === STATUSES.RUNNING;
}

function isStoped2() {
  return racket2.status === STATUSES.STOPED;
}

const racket = makeRacket();

const racket2 = makeRacket();

const ball = makeBall();

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
  const newDirX = loop.pipe(map(() => moveBallDirX(playgroundHTML, ball)));
  const newDirY = loop.pipe(map(() => moveBallDirY(playgroundHTML, ball)));
  const newPosX = newDirX.pipe(map(dirX => moveBallPos(ball, dirX)));
  const newPosY = newDirY.pipe(map(dirY => moveBallPos(ball, dirY)));
  const newBallPos = zip(newDirX, newDirY, newPosX, newPosY, buildPos);
  const moveRacketPos = loop.pipe(map(() => moveRacket(racketHTML, racket)));
  const moveRacketPos2 = loop2.pipe(map(() => moveRacket2(racket2HTML, racket2)));
  const hit = loop.pipe(filter(() => isRacketHit(racketHTML, ballHTML, ball)));
  const hit2 = loop2.pipe(filter(() => isRacketHit2(racket2HTML, ballHTML, ball)));
  const gameOver = loop.pipe(filter(() => isGameOver(racketHTML, ballHTML, ball, 1)));
  const gameOver2 = loop2.pipe(filter(() => isGameOver(racket2HTML, ballHTML, ball, 0)));

  keyDown.subscribe((event) => {
    if (event.which === KEYS.LEFT || event.which === KEYS.RIGHT) {
      racket.pressedKeys[event.which] = true;
    } else if (event.which === KEYS.A || event.which === KEYS.D) {
      racket2.pressedKeys[event.which] = true;
    } else if (
      event.which == KEYS.R
      && racket.status === STATUSES.GAMEOVER
      && racket2.status === STATUSES.GAMEOVER
    ) {
      restart(racket, racket2, ball, gameOverHTML);
    }
  });
  keyUp.subscribe((event) => {
    if (event.which === KEYS.LEFT || event.which === KEYS.RIGHT) {
      racket.pressedKeys[event.which] = false;
    } else if (event.which === KEYS.A || event.which === KEYS.D) {
      racket2.pressedKeys[event.which] = false;
    }
  });

  stoped.subscribe((event) => {
    racket.status = STATUSES.RUNNING;
    startHTML.style.display = 'none';
  });

  stoped2.subscribe((event) => {
    racket2.status = STATUSES.RUNNING;
    startHTML.style.display = 'none';
  });

  newBallPos.subscribe((pos) => {
    changeBallPos(ball, pos.directionX, pos.x, pos.directionY, pos.y);
    drawBall(ballHTML, ball);
  });

  moveRacketPos.subscribe((pixelPos) => {
    drawRacket(racketHTML, pixelPos);
  });

  moveRacketPos2.subscribe((pixelPos) => {
    drawRacket2(racket2HTML, pixelPos);
  });

  hit.subscribe((hit) => {
    changeDirY(ball);
  });

  hit2.subscribe((hit2) => {
    changeDirY(ball);
  });

  gameOver.subscribe(() => {
    endGame(racket, racket2);
    changeScore(racket);
    drawScore(scoreHTML, racket.score);
    drawEndGame(gameOverHTML, 1);
  });

  gameOver2.subscribe(() => {
    endGame(racket, racket2);
    changeScore(racket2);
    drawScore(scoreHTML2, racket2.score);
    drawEndGame(gameOverHTML, 2);
  });
}

window.onload = load;
