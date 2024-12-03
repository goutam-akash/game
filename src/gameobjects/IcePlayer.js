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
        // Check if attack hits FirePlayer
        if (this.isAttacking && this.attackArea) {
          this.scene.physics.world.overlap(
            this.attackArea,
            this.scene.firePlayer,
            this.handleAttackCollision,
            null,
            this
          );
        }
  }

  jump() {
    this.setVelocityY(-150);
  }

  attack() {
    // Ensure that the attack animation only plays if it's not already playing
    if (!this.isAttacking) {
      this.isAttacking = true;

      // Play sound and animation
      this.jump();
      this.scene.sound.play('iceAttack');
      this.anims.play("iceAttack");
  
      // Create an attack area
      this.attackArea = this.scene.physics.add
        .image(this.x, this.y, "iceParticle")
        .setSize(100, 100)
        .setAlpha(0.5)
        .setPosition(this.flipX ? this.x - 50 : this.x + 50, this.y);
  
      // Check for overlap with FirePlayer
      this.scene.physics.world.overlap(
        this.attackArea,
        this.scene.firePlayer,
        this.handleAttackCollision,
        null,
        this
      );
  
      // Reset attack state when animation completes
      this.on('animationcomplete', () => {
        if (this.anims.currentAnim.key === 'iceAttack') {
          this.attackArea?.destroy();
          this.attackArea = null;
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
  
  handleAttackCollision(attackArea, firePlayer) {
    firePlayer.takeDamage(20);
    console.log("FirePlayer hit by Ice Attack!");
  }
}
