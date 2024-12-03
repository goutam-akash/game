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

  attack() {
    if (!this.isAttacking) {
      this.isAttacking = true;

      // Play sound and animation
      this.scene.sound.play("fireballAttack");
      this.anims.play("fireAttack");

      // Create an attack area
      this.attackArea = this.scene.physics.add
        .image(this.x, this.y, "flameParticle")
        .setSize(100, 100)
        .setAlpha(0.5);

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

  handleAttackCollision(fireAttack, icePlayer) {
    icePlayer.takeDamage(20);
    console.log("IcePlayer hit by Fire Attack!");
  }
}