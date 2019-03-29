import { Subject } from 'rxjs';
import createPlayers from './util';

export default class Game {
  state = {
    players: [],
    keyPressed: '',
  };

  constructor() {
    this.subject = new Subject();
    this.observable = this.subject.asObservable();
  }

  currentPlayers = () => this.state.players.filter(player => !player.won);

  currentPlayer = () => this.state.players[this.state.turnIndex];

  respondToInput = (keyPressed) => {
    this.state.keyPressed = keyPressed;
    this.subject.next(this.state);
  };

  start = () => {
    this.state.players = createPlayers();
    this.subject.next(this.state);
  };

  subscribe = f => this.observable.subscribe(f);

  pipe = f => this.observable.pipe(f);
}
