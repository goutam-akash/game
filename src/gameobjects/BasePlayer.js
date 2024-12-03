// // Base Player class to share common functionality
// export default class BasePlayer extends Phaser.Physics.Arcade.Sprite {
//     constructor(scene, x, y, walkSprite, attackSprite) {
//         super(scene, x, y, walkSprite);
//         scene.add.existing(this);
//         scene.physics.world.enable(this);
        
//         this.setBounce(0.2);
//         this.setCollideWorldBounds(true);
        
//         this.isAttacking = false;
//         this.attackArea = null;
//         this.health = 100;
//         this.isDead = false;
//         this.attackCooldown = false;
//         this.ATTACK_DAMAGE = 10;
//         this.COOLDOWN_TIME = 500; // 500ms cooldown between attacks
        
//         // Store sprite keys
//         this.walkSprite = walkSprite;
//         this.attackSprite = attackSprite;
//     }

//     takeDamage(amount) {
//         if (this.isDead) return;
        
//         this.health = Math.max(0, this.health - amount);
//         console.log(`${this.constructor.name} health: ${this.health}`);
        
//         if (this.health <= 0) {
//             this.die();
//         }
//     }

//     die() {
//         if (!this.isDead) {
//             this.isDead = true;
//             this.scene.sound.play("deadSound");
//             this.scene.time.delayedCall(1000, () => {
//                 this.scene.scene.start("GameOverScene", { 
//                     winner: this instanceof IcePlayer ? "Fire Player" : "Ice Player" 
//                 });
//             });
//         }
//     }

//     startCooldown() {
//         this.attackCooldown = true;
//         this.scene.time.delayedCall(this.COOLDOWN_TIME, () => {
//             this.attackCooldown = false;
//         });
//     }

//     cleanupAttack() {
//         if (this.attackArea) {
//             this.attackArea.destroy();
//             this.attackArea = null;
//         }
//         this.isAttacking = false;
//         this.anims.play(`${this.walkSprite}Walk`, true);
//     }
// }
