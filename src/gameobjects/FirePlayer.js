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
        repeat: 0, // Attack animation plays only once
      });

      scene.anims.create({
        key: "fireHurt",
        frames: scene.anims.generateFrameNumbers("fireHurtSprite", { start: 0, end: 2 }),
        frameRate: 10,
        repeat: 0,
      });
  
      scene.anims.create({
        key: "fireDead",
        frames: scene.anims.generateFrameNumbers("fireDeadSprite", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0,
      });
  
      this.isHurt = false; 
  
      // Initialize attack state
      this.isAttacking = false;
    }
  
    update(cursors, shiftKey) {
        if (this.isHurt) return;
      // Fire player movement (using arrow keys)
      if (cursors.left.isDown) {
        this.setVelocityX(-160);
        this.anims.play("firePlayerWalk", true);
        this.setFlipX(true);
      } else if (cursors.right.isDown) {
        this.setVelocityX(160);
        this.anims.play("firePlayerWalk", true);
        this.setFlipX(false);
      } else {
        this.setVelocityX(0);
        if (!this.anims.isPlaying || this.anims.currentAnim.key !== "fireAttack") {
          this.anims.stop();
        }
      }
  
      if (cursors.up.isDown && this.body.touching.down) {
        this.setVelocityY(-330);
      }
  
      // Handle attack when Shift key is pressed
      if (shiftKey.isDown && !this.isAttacking) {
        this.jump();
        this.attack();
      }
    }
    jump(){this.setVelocityY(-150);}
  
    attack() {
        
      if (!this.isAttacking) {
        this.isAttacking = true;  // Set the flag to true to prevent overlap
  
        // Play the attack animation
        this.anims.play("fireAttack");
  
        // After the attack animation completes, switch back to the walk animation
        this.on("animationcomplete", () => {
          if (this.anims.currentAnim.key === "fireAttack") {
            this.anims.play("firePlayerWalk", true); // Return to walk animation
            this.isAttacking = false; // Reset the attack flag
          }
        });
  
        console.log("Fire attack triggered!");
      }
    }
  }
  