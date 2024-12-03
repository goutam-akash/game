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

    // Initialize attack state
    this.isAttacking = false;
    this.attackArea = null;
    this.health = 100;
    this.isDead = false;
  }

  update(aKey, dKey, wKey, ctrlKey) {
    // Ice player movement
    if (aKey.isDown) {
      this.setVelocityX(-160);
      if (!this.isAttacking) {
        this.anims.play("icePlayerWalk", true);
        this.setFlipX(true);
      }
    } else if (dKey.isDown) {
      this.setVelocityX(160);
      if (!this.isAttacking) {
        this.anims.play("icePlayerWalk", true);
        this.setFlipX(false);
      }
    } else {
      this.setVelocityX(0);
      if (!this.isAttacking) this.anims.stop();
    }

    // Ice player jump
    if (wKey.isDown && this.body.touching.down) {
      this.setVelocityY(-330);
    }

    // Handle attack when CTRL is pressed
    if (ctrlKey.isDown && !this.isAttacking) {
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
    if (!this.isAttacking) {
      this.isAttacking = true;

      // Play sound and animation
      this.jump();
      this.scene.sound.play("iceAttack");
      this.anims.play("iceAttack");

      // Create an attack area
      this.attackArea = this.scene.physics.add
        .image(this.x + (this.flipX ? -50 : 50), this.y, "iceParticle") // Adjust attack position
        .setSize(100, 100)
        .setAlpha(0.5);

      // Check for overlap with FirePlayer
      this.scene.physics.world.overlap(
        this.attackArea,
        this.scene.firePlayer,
        this.handleAttackCollision,
        null,
        this
      );

      // Reset attack state when animation completes
      this.once("animationcomplete", () => {
        this.isAttacking = false;
        if (this.attackArea) this.attackArea.destroy();
        this.attackArea = null;
        this.anims.play("icePlayerWalk", true);
      });

      console.log("Ice attack triggered!");
    }
  }

  takeDamage(amount) {
    if (this.isDead) return; // Prevent further damage after death
    this.health -= amount;
    console.log(`IcePlayer health: ${this.health}`);
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    if (!this.isDead) {
      this.isDead = true;
      this.scene.sound.play("deadSound");
      this.scene.time.delayedCall(1000, () => {
        this.scene.scene.start("GameOverScene", { winner: "Fire Player" });
      });
    }
  }

  handleAttackCollision(iceAttack, firePlayer) {
    if (firePlayer && !firePlayer.isDead) {
      firePlayer.takeDamage(10);
      console.log("FirePlayer hit by Ice Attack!");
    }
  }
}
