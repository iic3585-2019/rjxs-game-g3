import { STATUSES, KEYS } from './game';
import { nextPosition } from './ball';

export function makeRacket() {
    return {
        status: STATUSES.STOPED,
        pressedKeys: [],
        score: 0,
    }
}

export function moveRacket(racketHTML, racket) {
    const left = racketHTML.offsetLeft;
    if (racket.pressedKeys[KEYS.LEFT]) {
      return left - 5;
    }
    if (racket.pressedKeys[KEYS.RIGHT]) {
      return left + 5;
    }
    return left;
  }
  
export function moveRacket2(racket2HTML, racket2) {
    // console.log('moveRacket-2', racket2.pressedKeys);
    const left = racket2HTML.offsetLeft;
    if (racket2.pressedKeys[KEYS.A]) {
        return left - 5;
    }
    if (racket2.pressedKeys[KEYS.D]) {
        return left + 5;
    }
    return left;
}

export function drawRacket(racketHTML, pixelPos) {
    racketHTML.style.left = `${pixelPos}px`;
}

export function drawRacket2(racket2HTML, pixelPos) {
    racket2HTML.style.left = `${pixelPos}px`;
}

export function racketPositionY(racketHTML, ballHTML) {
    const ballSize = ballHTML.offsetHeight;
    return racketHTML.offsetTop - ballSize / 2; // subtracting size of ball for doesn't pass through racket
}
  
export function isRacketHit(racketHTML, ballHTML, ball) {
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
  
export function isRacketHit2(racket2HTML, ballHTML, ball) {
    const racketBorderLeft = racket2HTML.offsetLeft;
    const racketBorderRight = racketBorderLeft + racket2HTML.offsetWidth;
    const posX = nextPosition(ball.x, ball.speed, ball.directionX);
    const posY = nextPosition(ball.y, ball.speed, ball.directionY);
    const racketPosY = racketPositionY(racket2HTML, ballHTML);
    const res = posX >= racketBorderLeft && posX <= racketBorderRight && posY <= racketPosY+20; // adding racket height to because ball is hitting from below
    if (res) {
      console.log('racket-2 hit');
    }
    return res;
}