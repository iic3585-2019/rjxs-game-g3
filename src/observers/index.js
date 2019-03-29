import { map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import updatePlayers from './players';

const updateKeyPressed = (key) => {
  document.getElementById('game-wrapper').innerHTML = key;
};

export default (game) => {
  game.pipe(map(state => state.players)).subscribe(updatePlayers(game));
  game.pipe(map(state => state.keyPressed)).subscribe(updateKeyPressed);

  fromEvent(document, 'keydown')
    .pipe(map(event => event.key.toLowerCase()))
    .subscribe(game.respondToInput);
};
