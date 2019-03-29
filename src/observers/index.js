import { map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import updatePlayers from './players';

export default (game) => {
  game.pipe(map(state => state.players)).subscribe(updatePlayers(game));

  fromEvent(document, 'keydown')
    .pipe(map(event => event.key.toLowerCase()))
    .subscribe(game.respondToInput);
};
