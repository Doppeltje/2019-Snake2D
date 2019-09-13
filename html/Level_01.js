class Level_01 extends Phaser.Scene {
  constructor(){
    super({key:"Level_01"});
  }

  preload(){
    this.load.image('background', '/assets/Background.png');
    this.load.image('player', '/assets/Snake_body.png');
    this.load.spritesheet('pickup', '/assets/PickupSpritesheet.png', {
      frameWidth: 20,
      frameHeight: 20
    });
  }


  create(){
    // Images.
    this.background = this.add.image(config.width/2, config.height/2, 'background');

    // Player.
    this.player = this.physics.add.image(config.width/2, config.height/2, 'player');
    this.player.direction = "down";
    this.player.speed = 3;
    this.player.setCollideWorldBounds(true);

    // Pickups.
    this.pickups = this.physics.add.group({
      key: "pickup",
      repeat: 0,
      setXY: {
        x: 100,
        y: 100,
        stepX: 0
      }
    });
    this.anims.create({
      key: 'loop',
      frames: this.anims.generateFrameNumbers('pickup', {
        start: 0, end: 1
      }),
      frameRate: 1,
      repeat: -1
    });

    // Physics.
    this.physics.add.collider(this.player, this.pickups);
    this.physics.add.overlap(this.player, this.pickups, this.collectPickup, null, this);


    // UI.
    this.scoreText = this.add.text(config.width/2 - 80, 0, "SCORE: " + gameScore, {
      font: "30px Impact"
    });


    // Keyboard controls.
    this.input.keyboard.on('keyup', function(e){
      if (isPlaying){
        if (e.key == "d" && this.player.direction != "left"){
          this.player.direction = "right";
        }

        if (e.key == "s" && this.player.direction != "up"){
          this.player.direction = "down";
        }

        if (e.key == "a" && this.player.direction != "right"){
          this.player.direction = "left";
        }

        if (e.key == "w" && this.player.direction != "down"){
          this.player.direction = "up";
        }
      }

      if (e.keyCode == 32){ // Spacebar.
        isPlaying = !isPlaying;
      }
    }, this);
  }

  moveObject(object, dir){
    if (dir == "right"){
      object.x += object.speed * 16;
    } else if (dir == "down"){
      object.y += object.speed;
    } else if (dir == "left"){
      object.x -= object.speed;
    } else if (dir == "up"){
      object.y -= object.speed;
    } else {

    }
  }

  collectPickup(player, pickup){
    pickup.disableBody(true, true);
    this.increaseScore();
    this.spawnNewPickup();
  }

  increaseScore(){
    gameScore++;
    this.scoreText.setText("SCORE: " + gameScore);
  }

  spawnNewPickup(){
    this.pickups = this.physics.add.group({
      key: "pickup",
      repeat: 0,
      setXY: {
        x: Phaser.Math.Between(0, config.width),
        y: Phaser.Math.Between(0, config.height),
        stepX: 0
      }
    });
    this.physics.add.collider(this.player, this.pickups);
    this.physics.add.overlap(this.player, this.pickups, this.collectPickup, null, this);
  }

  update(){
    if (isPlaying){
      this.moveObject(this.player, this.player.direction);
    }
  }
}
