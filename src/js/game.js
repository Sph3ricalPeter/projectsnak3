/* 
  This is the main script of Project SNAK3
*/

/*
  Constants
*/
const fps = 60;
const nFramesPerSnakeStep = 5;

const gridCellSizePercent = 2;
const minCanvasWidth = 1000;

/* 
  Game grid cell size & numbers per width/height
*/
var cellSize = (window.innerWidth / 100) * gridCellSizePercent;
var cellsPerWidth = parseInt(window.innerWidth / cellSize);
var cellsPerHeight = parseInt((cellsPerWidth * 9) / 21);

/* 
  Canvas size
*/
var canvasWidth = window.innerWidth;
var canvasHeight = cellSize * cellsPerHeight;

/* 
  Components
*/
var canvas;
var game;
var ui;
var audio;
var score;

var font;

/* 
  Display alterations
*/
var smallScreen = false;
var rip = false;

/* 
  Load font before app starts
*/
function preload() {
  font = loadFont("ttf/acknowledge/acknowtt.ttf");
}

/* 
  App start
*/
function setup() {
  /* 
    Die if screen width is not enough
  */
  if (canvasWidth < minCanvasWidth) {
    console.log("RIP");
    rip = true;
    document.querySelector("#canvas-wrapper").style.display = "none";
    return;
  }

  // p5
  frameRate(fps);
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvas-wrapper");

  // Score
  score = new Score();
  score.loadHiscores();

  // Audio
  audio = new AudioManager();

  // UI
  ui = new UI();

  // game
  game = new Game();
  game.food.placeRandomly();

  // canvas resize event
  window.addEventListener("resize", () => {
    updateCanvasScale();
  });

  // prevent view movement with keyboard
  window.addEventListener(
    "keydown",
    function (e) {
      // space and arrow keys
      if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    },
    false
  );
}

/* 
  Updates scale of canvas to fit window width
  Also updates number of hiscores shown
*/
function updateCanvasScale() {
  cellSize = (window.innerWidth / 100) * gridCellSizePercent;
  cellsPerWidth = parseInt(window.innerWidth / cellSize);
  cellsPerHeight = parseInt((cellsPerWidth * 9) / 21);

  canvasWidth = window.innerWidth;
  canvasHeight = cellSize * cellsPerHeight;
  resizeCanvas(canvasWidth, canvasHeight);

  if (smallScreen != canvasWidth < minCanvasWidth) {
    smallScreen = canvasWidth < minCanvasWidth;
    if (!smallScreen) {
      ui.showUIByState();
    }
  }

  ui.hiscores.resize(false);
}

/* 
  Main update function provided by p5.js
*/
function draw() {
  if (rip) {
    return;
  }

  background(51);

  // game
  game.update();

  // UI
  ui.update();
}

/* 
  Handle input
*/
function keyPressed() {
  /* 
    Snake movement
  */
  if (keyCode === UP_ARROW && game.snake.speed.y != 1) {
    game.snake.dir(0, -1);
  } else if (keyCode === DOWN_ARROW && game.snake.speed.y != -1) {
    game.snake.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW && game.snake.speed.x != -1) {
    game.snake.dir(1, 0);
  } else if (keyCode === LEFT_ARROW && game.snake.speed.x != 1) {
    game.snake.dir(-1, 0);
  }

  /* 
    Submit nick pick via enter
  */
  if (keyCode === ENTER && ui.state == ui.States.NickPicker) {
    ui.nickPicker.getPlayerInfoFromInput();
    game.restart();
    game.play();
    ui.changeState(ui.States.HUD);
  }

  /* 
    Escape to main menu
    */
  if (keyCode === ESCAPE) {
    game.state = game.States.PAUSED;
    ui.changeState(ui.States.MainMenu);
  }
}

/* 
  Main class controlling the game
*/
class Game {
  constructor() {
    this.grid = createVector(cellsPerWidth, cellsPerHeight);

    this.snake = new Snake();
    this.snakeColor = "#ffffff";

    this.food = new Food();
    this.snakeStepCounter = 0;

    /*
      Game mode parameters
    */
    this.arcadeStepIncrease = 0;
    this.nExplorationWalls = 0;
    this.explorWalls = [];

    /* 
      Game stats determine game-flow
    */
    this.States = {
      PLAYING: 0,
      PAUSED: 1,
    };

    this.state = this.States.PAUSED;

    /* 
     Game Modes determine playstyle
    */
    this.Modes = {
      CLASSIC: 0,
      ARCADE: 1,
      EXPLORATION: 2,
    };

    this.mode = this.Modes.CLASSIC;
  }

  /* 
    Size of a single grid cell = snake segment = piece of food
  */
  gridCellSize() {
    return (gridCellSizePercent * canvasWidth) / 100;
  }

  /* 
    Resumes the game
  */
  play() {
    this.state = this.States.PLAYING;
    if (this.mode == this.Modes.EXPLORATION) {
      this.spawnWalls();
    }
  }

  /* 
    Pauses the game
  */
  pause() {
    this.state = this.States.PAUSED;
  }

  update() {
    // game
    if (this.state == this.States.PLAYING) {
      /* 
        Increase step in arcade mode
      */
      if (this.mode == this.Modes.ARCADE) {
        this.arcadeStepIncrease += 0.001;
      }

      this.snakeStepCounter += 1 + this.arcadeStepIncrease;

      /* 
        Snake step is slower then game update
        Counter is used to determin when next step happens
      */
      if (this.snakeStepCounter > nFramesPerSnakeStep) {
        this.snakeStepCounter = 0;

        // Check snake's head collision with snake tail or walls in exploration mode
        if (this.snake.isColliding()) {
          this.state = this.States.PAUSED;

          // save hiscore on death
          score.recordHiscore();
          score.current = 0;

          this.snake.die();

          // show game over UI
          ui.changeState(ui.States.GameOver);
          ui.fader.fadeWhiteToAlpha(1);

          audio.playHurt();
        }

        // snake hasn't died so it can move
        this.snake.update();

        // eat food
        if (this.snake.eat(this.food.position)) {
          score.current++;
          audio.playEat();
          this.food.placeRandomly();
          if (this.mode == this.Modes.EXPLORATION) {
            this.spawnWalls();
          }
        }
      }

      this.snake.display();

      // draw walls in exploration mode
      if (this.mode == this.Modes.EXPLORATION) {
        for (let i = 0; i < this.explorWalls.length; i++) {
          fill(150);
          rect(
            this.explorWalls[i][0] * this.gridCellSize() -
              this.gridCellSize() / 20,
            this.explorWalls[i][1] * this.gridCellSize() -
              this.gridCellSize() / 20,
            this.gridCellSize() + this.gridCellSize() / 10,
            this.gridCellSize() + this.gridCellSize() / 10
          );
        }
      }

      this.food.display();
    }
  }

  // restarts the game, resets snake progress and walls in exploration mode
  restart() {
    this.snake = new Snake();
    this.arcadeStepIncrease = 0.001;
    this.nExplorationWalls = 0;
    this.play();
  }

  // spawns n walls randomly
  spawnWalls() {
    this.nExplorationWalls += 0.5;
    this.explorWalls = [];

    for (let i = 0; i < this.nExplorationWalls; i++) {
      // vertical walls
      let isVertical = Math.floor(Math.random() * 10) < 5; // 0..9 < 5 in 50% of cases
      if (isVertical) {
        let col = Math.floor(Math.random() * cellsPerWidth);
        console.log(`col ${col}`);

        let start = Math.floor(Math.random() * (cellsPerHeight - 2));
        let end =
          start +
          2 +
          Math.floor(Math.random() * (cellsPerHeight - (start + 2))); // min wall length = 2

        for (let i = start; i < end; i++) {
          this.explorWalls.push([col, i]);
        }

        console.log(
          `start: ${start}, end: ${end}, nWalls: ${this.explorWalls.length}`
        );
      } else {
        // horizontal walls
        let row = Math.floor(Math.random() * cellsPerHeight);
        console.log(`row ${row}`);

        let start = Math.floor(Math.random() * (cellsPerWidth - 2));
        let end =
          start + 2 + Math.floor(Math.random() * (cellsPerWidth - (start + 2))); // min wall length = 2

        for (let i = start; i < end; i++) {
          this.explorWalls.push([i, row]);
        }

        console.log(
          `start: ${start}, end: ${end}, nWalls: ${this.explorWalls.length}`
        );
      }
    }
  }
}
