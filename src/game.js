import { nextPosition } from './ball';
import { racketPositionY } from './racket';

export const KEYS = {
  LEFT: 37,
  RIGHT: 39,
  A: 65,
  D: 68,
  R: 82,
};

export const STATUSES = { STOPED: 'STOPED', RUNNING: 'RUNNING', GAMEOVER: 'GAMEOVER' };

export function changeScore(racket) {
  racket.score++;
}

export function drawScore(scoreHTML, score) {
  scoreHTML.innerHTML = score;
}

export function isGameOver(racketHTML, ballHTML, ball, bottom) {
  const bottomPos = racketHTML.offsetHeight;
  const posY = nextPosition(ball.y, ball.speed, ball.directionY) - bottomPos;
  const racketPosY = racketPositionY(racketHTML, ballHTML);
  return bottom ? posY > racketPosY : posY + 20 < racketPosY;
}

export function endGame(racket, racket2) {
  racket.status = STATUSES.GAMEOVER;
  racket2.status = STATUSES.GAMEOVER;
}

export function drawEndGame(gameOverHTML, winnerHTML, playerNum) {
  gameOverHTML.style.display = 'block';
  gameOverHTML.innerHTML = `${playerNum === 1 ? 'Eva' : 'Adam'} won!<br/>press R to play again`;
  winnerHTML.style.display = 'block';
}

export function restart(racket1, racket2, ball, gameOverHTML, evaHTML, adamHTML) {
  racket1.status = STATUSES.STOPED;
  racket2.status = STATUSES.STOPED;
  ball.speed = 2;
  ball.x = 135;
  ball.y = 150;
  ball.directionX = -1;
  ball.directionY = -1;
  gameOverHTML.style.display = 'none';
  evaHTML.style.display = 'none';
  adamHTML.style.display = 'none';
}
