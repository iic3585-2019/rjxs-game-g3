const updatePlayers = game => (players) => {
  document.getElementById('players').innerHTML = players
    .map(
      player => `<div class="player-heading">
          ${player.name}
      </div>`,
    )
    .join('');
};

export default updatePlayers;
