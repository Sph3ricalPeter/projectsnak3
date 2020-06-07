/**
 * This class specifies the behaviour of the snake
 */
class Snake {
  constructor() {
    this.head = createVector(0, 0);
    this.tailLength = 1;
    this.tail = [];
    this.speed = createVector(1, 0);
  }

  /**
   * Updates snake's segments in the current draw loop
   */
  update() {
    // shift tail by 1
    if (this.tailLength === this.tail.length) {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }

    // place last segment at the front
    this.tail[this.tailLength - 1] = createVector(this.head.x, this.head.y);

    // move head
    this.head.add(this.speed);

    // head port from wall to wall
    {
      if (this.head.x < 0) {
        this.head.x = game.grid.x - 1;
      } else if (this.head.x > game.grid.x - 1) {
        this.head.x = 0;
      }

      if (this.head.y < 0) {
        this.head.y = game.grid.y - 1;
      } else if (this.head.y > game.grid.y - 1) {
        this.head.y = 0;
      }
    }
  }

  /**
   * Displays all snakes segments in the current draw loop
   */
  display() {
    // draw tail
    for (var i = 0; i < this.tail.length; i++) {
      this.drawSegment(
        this.tail[i].x,
        this.tail[i].y,
        game.gridCellSize(),
        game.gridCellSize()
      );
    }

    // draw head
    this.drawSegment(
      this.head.x,
      this.head.y,
      game.gridCellSize(),
      game.gridCellSize()
    );
  }

  /**
   * Changes snake's direction
   * @param {number} x The desired value of x
   * @param {number} y The desired value of y
   */
  dir(x, y) {
    this.speed.set(x, y);
  }

  /**
   * Checks whether the snake's head reached food
   * @param {vector} pos Current position of food in the game grid
   * @return {boolean} true if food was consumed, false if not
   */
  eat(pos) {
    let d = dist(this.head.x, this.head.y, pos.x, pos.y);
    if (d < 1) {
      this.tailLength++;
      return true;
    }
    return false;
  }

  /**
   * Checks whether the snake's head is colliding with any of the snake tail segments or any exploration-mode walls
   * @return {boolean} true if collision is happening, false otherwise
   */
  isColliding() {
    for (let i = 0; i < this.tail.length; i++) {
      let d = dist(this.head.x, this.head.y, this.tail[i].x, this.tail[i].y);
      if (d < 1) {
        return true;
      }
    }
    if (game.mode == game.Modes.EXPLORATION) {
      for (let i = 0; i < game.explorWalls.length; i++) {
        let d = dist(
          this.head.x,
          this.head.y,
          game.explorWalls[i][0],
          game.explorWalls[i][1]
        );
        if (d < 1) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Reset the snake to initial size
   */
  die() {
    this.tailLength = 1;
    this.tail = [];
  }

  /**
   * Draws one snake segment in the current draw loop
   * @param {number} x X position of the segment in game grid
   * @param {number} y Y position of the segment in game grid
   * @param {number} size size of the segment in pixels
   */
  drawSegment(x, y, size) {
    fill(game.snakeColor);
    noStroke();
    rect(
      x * size - size / 20,
      y * size - size / 20,
      size + size / 10,
      size + size / 10
    );
  }
}
