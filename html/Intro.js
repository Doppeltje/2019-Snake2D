class Intro extends Phaser.Scene {
  constructor(){
    super({ key: "Intro" });
  }

  preload(){

  }

  create(){
    let textStyle = {
      font: "16px",
      fill: "white",
      wordWrap: true,
      wordWrapWidth: config.width,
      align: "center"
    };

    this.restartText = this.add.text(0, 0, "press R to restart", textStyle);
    this.key_r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.key_r.pressed = false;

    if (currentScore > 0){
      this.lastScoreText = this.add.text(
        config.width/2-70, 0, "last score: " + currentScore);
    }

    this.guideText = this.add.text(config.width/2-170, config.height-60,
      "use the arrow keys to move the snake.");
    this.guideText2 = this.add.text(config.width/2-150, config.height-30,
      "grab the pickups to earn points!");
  }

  update(){
    if (this.key_r.isDown && !this.key_r.pressed){
      console.log("R is pressed");
      this.scene.start("Game");
      this.key_r.pressed = true;
    }

    if (this.key_r.isUp){
      this.key_r.pressed = false;
    }
  }
}
