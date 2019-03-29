import { fromEvent } from 'rxjs';
import Game from './game';
import configureObservers from './observers';
import './styles/index.scss';

const game = new Game();

fromEvent(window, 'load').subscribe(() => {
  configureObservers(game);
  game.start();
});

if (module.hot) {
  module.hot.accept();
}
