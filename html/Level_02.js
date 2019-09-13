class Level_02 extends Phaser.Scene {
  constructor(){
    super({key:"Level_02"});
  }

  preload(){
    this.load.image('background', '/assets/Background.png');
    this.load.image('snake', '/assets/Snake_body.png');
    this.load.spritesheet('pickup', '/assets/PickupSpritesheet.png', {
      frameWidth: 20,
      frameHeight: 20
    });
  }

  create(){
    // Objects.
    let player;
    let pickup;
    let UP = 0;
    let DOWN = 1;
    let LEFT = 2;
    let RIGHT = 3;

    // Variables.
    let cursors;
    let highScore = [];
    let tileSize = 40;

    let Pickup = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,

      initialize:

      function Pickup(scene, x, y){
        Phaser.GameObjects.Image.call(this, scene);

        this.setTexture('pickup');
        this.setPosition(x * tileSize, y * tileSize);
        this.setOrigin(0);

        this.total = 0;

        scene.children.add(this);
      },

      grab: function(){
        this.total++;
      }
    });

    let Snake = new Phaser.Class({
      initialize:

      function Snake(scene, x, y){
        this.headPosition = new Phaser.Geom.Point(x, y);
        this.body = scene.add.group();
        this.head = this.body.create(x * tileSize, y * tileSize, 'snake');
        this.head.setOrigin(0);

        this.alive = true;
        this.speed = 100;
        this.moveTime = 0;

        this.tail = new Phaser.Geom.Point(x, y);

        this.heading = DOWN;
        this.direction = DOWN;
      },

      update: function(time){
        if (time >= this.moveTime){
          return this.move(time);
        }
      },

      faceLeft: function(){
        if (this.direction == UP || this.direction == DOWN){
          this.heading = LEFT;
        }
      },

      faceRight: function(){
        if (this.direction == UP || this.direction == DOWN){
          this.heading = RIGHT;
        }
      },

      faceUp: function(){
        if (this.direction == LEFT || this.direction == RIGHT){
          this.heading = UP;
        }
      },

      faceDown: function(){
        if (this.direction == LEFT || this.direction == RIGHT){
          this.heading = DOWN;
        }
      },

      move: function(){
        this.direction = this.heading;
        // Update body and place coordinates into this.tail.
        Phaser.Actions.ShiftPosition(
          this.body.getChildren(), this.headPosition.x * tileSize, this.headPosition.y * tileSize, 1, this.tail);

        // Update timer for next movement.
        this.moveTime = time + this.speed;
        return true;
      },

      grow: function(){
        let newPart = this.body.create(
          this.tail.x,
          this.tail.y,
          'snake');
        newPart.setOrigin(0);
      },

      collideWithPickup: function(pickup){
        if (this.head.x == pickup.x && this.head.y == pickup.y){
          this.grow();
          pickup.grab();

          return true;
        } else {
          return false;
        }
      }
    });

    player = new Snake(this, config.width/2/tileSize, config.height/2/tileSize);
    pickup = new Pickup(this, 2, 2);
    // Create keyboard controls.
    cursors = this.input.keyboard.createCursorKeys();
  }
}
