export default class FirePlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "fireWalkSprite");

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setBounce(0.2);
    this.setCollideWorldBounds(true);

    // Create animations
    scene.anims.create({
      key: "firePlayerWalk",
      frames: scene.anims.generateFrameNumbers("fireWalkSprite", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "fireAttack",
      frames: scene.anims.generateFrameNumbers("fireAttackSprite", {
        start: 0,
        end: 14,
      }),
      frameRate: 15,
      repeat: 0,
    });

    // Initialize attack state
    this.isAttacking = false;
    this.attackArea = null;
    this.health = 100;
    this.isDead = false;
  }

  update(cursors, shiftKey) {
    // Fire player movement
    if (cursors.left.isDown) {
      this.setVelocityX(-160);
      if (!this.isAttacking) {
        this.anims.play("firePlayerWalk", true);
        this.setFlipX(true);
      }
    } else if (cursors.right.isDown) {
      this.setVelocityX(160);
      if (!this.isAttacking) {
        this.anims.play("firePlayerWalk", true);
        this.setFlipX(false);
      }
    } else {
      this.setVelocityX(0);
      if (!this.isAttacking) this.anims.stop();
    }

    if (cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-330);
    }

    // Attack logic
    if (shiftKey.isDown && !this.isAttacking) {
      this.attack();
    }

    // Check if attack hits IcePlayer
    if (this.isAttacking && this.attackArea) {
      this.scene.physics.world.overlap(
        this.attackArea,
        this.scene.icePlayer,
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
      this.scene.sound.play("fireballAttack");
      this.anims.play("fireAttack");

      // Create an attack area
      this.attackArea = this.scene.physics.add
        .image(this.x, this.y, "flameParticle")
        .setSize(100, 100)
        .setAlpha(0.5);
        

      // Check for overlap with FirePlayer
      this.scene.physics.world.overlap(
        this.attackArea,
        this.scene.icePlayer,
        this.handleAttackCollision,
        null,
        this
      );
      

      // Reset attack state when animation completes
      this.once("animationcomplete", () => {
        this.isAttacking = false;
        this.attackArea.destroy();
        this.attackArea = null;
        this.anims.play("firePlayerWalk", true);
      });

      console.log("Fire attack triggered!");
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
        this.scene.scene.start("GameOverScene", { winner: "Ice Player" });
      });
    }
  }

handleAttackCollision(fireAttack, icePlayer) {
  if (icePlayer && !icePlayer.isDead) {
    icePlayer.takeDamage(10);
    console.log("Ice Player hit by Ice Attack!");
  }
}
}