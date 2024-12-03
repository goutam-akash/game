export default class IcePlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "iceWalkSprite");

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setBounce(0.2);
    this.setCollideWorldBounds(true);

    // Create animations
    scene.anims.create({
      key: "icePlayerWalk",
      frames: scene.anims.generateFrameNumbers("iceWalkSprite", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "iceAttack",
      frames: scene.anims.generateFrameNumbers("iceAttackSprite", {
        start: 0,
        end: 8,
      }),
      frameRate: 10,
      repeat: 0, // Attack animation plays only once
    });

    this.anims.play("icePlayerWalk", true); // Start with the walk animation
    this.health = 100; // Initialize health
    this.isDead = false;
  }

  update(aKey, dKey, wKey, ctrlKey) {
    // Ice player movement
    if (aKey.isDown) {
      this.setVelocityX(-160);
      this.anims.play("icePlayerWalk", true);
      this.setFlipX(true);
    } else if (dKey.isDown) {
      this.setVelocityX(160);
      this.anims.play("icePlayerWalk", true);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
      if (!this.anims.isPlaying || this.anims.currentAnim.key !== "iceAttack") {
        this.anims.stop();
      }
    }

    // Ice player jump
    if (wKey.isDown && this.body.touching.down) {
      this.setVelocityY(-330);
    }

    // Handle attack when CTRL is pressed
    if (ctrlKey.isDown) {
      this.attack();
    }
  }

  jump() {
    this.setVelocityY(-150);
  }

  attack() {
    // Ensure that the attack animation only plays if it's not already playing
    if (!this.anims.isPlaying || this.anims.currentAnim.key !== "iceAttack") {
      this.scene.sound.play('iceAttack');
      this.anims.play("iceAttack");
      // After the attack animation completes, switch back to the walk animation
      this.on('animationcomplete', () => {
        if (this.anims.currentAnim.key === 'iceAttack') {
          this.anims.play('icePlayerWalk', true);
        }
      });
    }
    console.log("Ice attack triggered!");
  }

  takeDamage(amount) {
    this.health -= amount;
    console.log(`IcePlayer health: ${this.health}`);
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    if (!this.isDead) {
      this.isDead = true;
      this.scene.sound.play('deadSound');
      this.anims.play('iceDeadSprite');
      this.scene.time.delayedCall(1000, () => {
        this.scene.scene.start('GameOverScene', { winner: 'Fire Player' });
      });
    }
  }
}