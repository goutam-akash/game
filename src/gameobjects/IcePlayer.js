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
    this.isAttacking = false; // Track whether the player is attacking
    this.attackCooldown = false; // Prevent spam attacks
    this.attackArea = null; // Track the attack area
  }

  update(aKey, dKey, wKey, ctrlKey) {
    // Ice player movement
    if (aKey.isDown) {
      this.setVelocityX(-160);
      if (!this.isAttacking) {
        this.anims.play("icePlayerWalk", true);
      }
      this.setFlipX(true);
    } else if (dKey.isDown) {
      this.setVelocityX(160);
      if (!this.isAttacking) {
        this.anims.play("icePlayerWalk", true);
      }
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
      if (!this.isAttacking) {
        this.anims.stop();
      }
    }

    // Ice player jump
    if (wKey.isDown && this.body.touching.down) {
      this.setVelocityY(-330);
    }

    // Handle attack when CTRL is pressed
    if (ctrlKey.isDown && !this.isAttacking) {
      this.attack();
    }

    // If the player is attacking, check collision
    if (this.isAttacking && this.attackArea) {
      this.scene.physics.world.overlap(
        this.attackArea,
        this.scene.firePlayer, // Ensure this is the correct player (FirePlayer)
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
      this.anims.play("iceAttack");

      // Create attack area (hitbox) but don't check for collisions immediately
      this.attackArea = this.scene.physics.add
        .image(this.x, this.y, "flameParticle") // Temporary visual for the attack area
        .setSize(100, 100) // Adjust the size of the attack hitbox
        .setAlpha(0.5);

      // Disable collision checks during attack animation
      this.attackArea.setActive(false).setVisible(false);

      // Reset attack state when animation completes
      this.once("animationcomplete", () => {
        // Enable attack hitbox and check for collisions only after animation is done
        this.attackArea.setActive(true).setVisible(true);

        // Check for collisions with FirePlayer here
        this.scene.physics.world.overlap(
          this.attackArea,
          this.scene.firePlayer, // Ensure this is the correct player (FirePlayer)
          this.handleAttackCollision,
          null,
          this
        );

        // After the attack animation completes, reset the attack state
        this.isAttacking = false;
        this.attackArea.destroy();
        this.attackArea = null;
        this.anims.play("icePlayerWalk", true); // Resume walking animation
      });

      console.log("Ice attack triggered!");
    }
  }

  handleAttackCollision(attackArea, firePlayer) {
    if (firePlayer) {
      firePlayer.takeDamage(20);
      console.log("FirePlayer hit by Ice Attack!");
    } else {
      console.log("Collision detected but no valid firePlayer!");
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    console.log(`IcePlayer health: ${this.health}`);
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    console.log("IcePlayer has died!");
    this.setAlpha(0); // Hide the player when they die
    this.anims.play("iceDeadSprite");
  }
}
