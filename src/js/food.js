class Food {
  constructor() {
    this.position = createVector(0, 0);
  }

  placeRandomly() {
    this.position = createVector(
      floor(random(1, game.grid.x)),
      floor(random(1, game.grid.y))
    );
  }

  display() {
    if (game.mode == game.Modes.ARCADE) {
      fill(0, 255, 100);
    } else if (game.mode == game.Modes.EXPLORATION) {
      fill(100, 0, 255);
    } else {
      fill(255, 0, 100);
    }
    rect(
      this.position.x * game.gridCellSize() - game.gridCellSize() / 20,
      this.position.y * game.gridCellSize() - game.gridCellSize() / 20,
      game.gridCellSize() + game.gridCellSize() / 10,
      game.gridCellSize() + game.gridCellSize() / 10
    );
  }
}
