/* Class that represents food and its properties */
class Food {
  constructor() {
    this.position = createVector(0, 0);
  }

  /**
   * Places food in a random cell in game grid
   */
  placeRandomly() {
    this.position = createVector(
      floor(random(1, game.grid.x)),
      floor(random(1, game.grid.y))
    );
  }

  /**
   * Displays food in the current draw loop
   */
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
