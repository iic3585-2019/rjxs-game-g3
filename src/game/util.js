import Player from './player';

const createPlayers = () => {
  // TODO: change parameters to corresponding event
  const p1 = new Player('Adam', 'q', 'a');
  const p2 = new Player('Eve', 'b', 'n');

  const players = [p1, p2];
  return players;
};

export default createPlayers;
