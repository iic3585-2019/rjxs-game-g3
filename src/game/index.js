import { Subject } from 'rxjs';
import Graph from './graph';
import createPlayers from './util';

export default class Game {
  state = {
    players: [],
    keyPressed: '',
  };

  constructor() {
    this.subject = new Subject();
    this.observable = this.subject.asObservable();
    this.graph = new Graph();

    const vertices = ['A', 'B', 'C', 'D', 'E', 'F'];

    // adding vertices
    for (let i = 0; i < vertices.length; i += 1) {
      this.graph.addVertex(vertices[i]);
    }

    // adding edges
    this.graph.addEdge('A', 'B');
    this.graph.addEdge('A', 'D');
    this.graph.addEdge('A', 'E');
    this.graph.addEdge('B', 'C');
    this.graph.addEdge('D', 'E');
    this.graph.addEdge('E', 'F');
    this.graph.addEdge('E', 'C');
    this.graph.addEdge('C', 'F');

    // prints all vertex and
    // its adjacency list
    // A -> B D E
    // B -> A C
    // C -> B E F
    // D -> A E
    // E -> A D F C
    // F -> E C
    this.graph.printGraph();
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
