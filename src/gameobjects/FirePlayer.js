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

    this.anims.play("firePlayerWalk", true); // Start with the walk animation
    this.health = 100; // Initialize health
    this.isAttacking = false; // Track whether the player is attacking
    this.attackCooldown = false; // Prevent spam attacks
    this.attackArea = null; // Track the attack area

    // // Initialize attack state
    // this.isAttacking = false;
    // this.attackArea = null;
    // this.health = 100; // Initialize health
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

      // Create attack area (hitbox) but don't check for collisions immediately
      this.attackArea = this.scene.physics.add
        .image(this.x, this.y, "flameParticle")
        .setSize(100, 100)
        .setAlpha(0.5);

      // Disable collision checks during attack animation
      this.attackArea.setActive(false).setVisible(false);

      // Reset attack state when animation completes
      this.once("animationcomplete", () => {
        // Enable attack hitbox and check for collisions only after animation is done
        this.attackArea.setActive(true).setVisible(true);

        // Check for collisions with IcePlayer here
        this.scene.physics.world.overlap(
          this.attackArea,
          this.scene.icePlayer,
          this.handleAttackCollision,
          null,
          this
        );

        // After the attack animation completes, reset the attack state
        this.isAttacking = false;
        this.attackArea.destroy();
        this.attackArea = null;
        this.anims.play("firePlayerWalk", true); // Resume walking animation
      });

      console.log("Fire attack triggered!");
    }
  }

  handleAttackCollision(fireAttack, icePlayer) {
    icePlayer.takeDamage(20); // FirePlayer damage to IcePlayer
    console.log("IcePlayer hit by Fire Attack!");
  }

  takeDamage(amount) {
    this.health -= amount;
    console.log(`FirePlayer's health: ${this.health}`);
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    console.log("FirePlayer has died!");
    this.setAlpha(0); // Hide the player when they die
    this.anims.play("fireDeadSprite");
  }
}
