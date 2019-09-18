let config = {
  type: Phaser.WEBGL,
  width: 720,
  height: 540,
  backgroundColor: '#6B737B',
  parent: 'test1',
  scene: [ Intro, Game ]
};

// Objects.
let snake;
let pickup;
let cursors;
let key_r;

// Directions.
let UP = 0;
let DOWN = 1;
let LEFT = 2;
let RIGHT = 3;

// Variables.
let highScore = [];
let tileSize = 36;
let currentScore = 0;

let game = new Phaser.Game(config);
