class Game extends Phaser.Scene{
  constructor(){
    super({ key: "Game" });
  }

  preload(){
    this.load.image('snake', '/assets/Snake_body.png');
    this.load.image('pickup', '/assets/Pickup.png');
  }

  create(){
    // Score.
    let scoreText;
    currentScore = 0;

    let textStyle = { align: "center" };
    scoreText = this.add.text(config.width/2-50, 5, "score: " + currentScore, textStyle);
    // Check if mobile or desktop.
    if (!this.sys.game.device.input.touch){
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      this.buildMobileControls();
    }

    // Pickup.
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
        this.speed = 150;
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

      move: function(time){
        // If you go beyond border of the game, you die.
        switch (this.heading){
             case LEFT:
               this.headPosition.x--;
               if (this.headPosition.x < 0){
                 this.alive = false;
               }
               break;

             case RIGHT:
               this.headPosition.x++;
               if (this.headPosition.x > config.width / tileSize){
                 this.alive = false;
               }
               break;

             case UP:
               this.headPosition.y--;
               if (this.headPosition.y < 0){
                 this.alive = false;
               }
               break;

             case DOWN:
               this.headPosition.y++;
               if (this.headPosition.y > config.height / tileSize){
                 this.alive = false;
               }
               break;
           }

        this.direction = this.heading;
        // Update body and place coordinates into this.tail.
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * tileSize, this.headPosition.y * tileSize, 1, this.tail);

        // Create variable to compare head xy and body xy.
        let hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

        // Check if head hits body.
        if (hitBody){
          this.alive = false;
          return false;
        } else {
          // Update timer for next movement.
          this.moveTime = time + this.speed;
          return true;
        }
      },

      // Extend the snake if player touches pickup.
      grow: function(){
        let newPart = this.body.create(this.tail.x, this.tail.y, 'snake');
        newPart.setOrigin(0);
      },

      // Check if player hits pickup.
      collideWithPickup: function(pickup){
        if (this.head.x == pickup.x && this.head.y == pickup.y){
          this.grow();
          pickup.grab();
          this.increaseScore();
          return true;
        } else {
          return false;
        }
      },

      increaseScore: function(){
        // Score.
        currentScore = pickup.total;
        scoreText.text = "score: " + currentScore;
        // Increase difficulty.
        this.speed -= 1;
      },

      updateGrid: function(grid){
        this.body.children.each(function(segment){
          let bx = segment.x / tileSize;
          let by = segment.y / tileSize;

          grid[by][bx] = false;
        });
        return grid;
      }
    });

    pickup = new Pickup(this, 2, 2);
    snake = new Snake(this, 5, 5);
  }



  update (time, delta){
    if (!snake.alive){
      this.scene.start("Intro");
      return;
    }

    if (this.cursors.left.isDown){
      snake.faceLeft();
    } else if (this.cursors.right.isDown){
      snake.faceRight();
    } else if (this.cursors.up.isDown){
      snake.faceUp();
    } else if (this.cursors.down.isDown){
      snake.faceDown();
    }

    if (snake.update(time)){
      if (snake.collideWithPickup(pickup)){
        this.repositionPickup();
      }
    }
  }

  // Make sure food is placed on the grid except on the snake.
  repositionPickup(){
    let testGrid = [];

    for (let y = 0; y < config.height/tileSize; y++){
      testGrid[y] = [];

      for (let x = 0; x < config.width/tileSize; x++){
        testGrid[y][x] = true;
      }
    }

    snake.updateGrid(testGrid);

    let validLocations = [];

    for (let y = 0; y < config.height/tileSize; y++){
      for (let x = 0; x < config.width/tileSize; x++){
        if (testGrid[y][x] == true){
          validLocations.push({ x: x, y: y });
        }
      }
    }

    if (validLocations.length > 0){
      let pos = Phaser.Math.RND.pick(validLocations);

      pickup.setPosition(pos.x * tileSize, pos.y * tileSize);

      return true;
    } else {
      return false;
    }
  }

  buildMobileControls(){
    let isDrawing = false;
    // On mouse down.
    this.input.on('pointerdown', function(pointer){
      isDrawing = true;
    });
    // On mouse up.
    this.input.on('pointerup', function(){
      isDrawing = false;
    });

    this.input.on('pointermove', function(pointer){
      if (isDrawing){
        if (pointer.downX < pointer.upX){
          snake.faceRight();
        } else if (pointer.downX > pointer.upX){
          snake.faceLeft();
        } else if (pointer.downY < pointer.upY){
          snake.faceDown();
        } else if (pointer.downY > pointer.upY){
          snake.faceUp();
        }
      }
    });
  }
}
