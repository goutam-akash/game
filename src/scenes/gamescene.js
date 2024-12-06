import IcePlayer from "../gameobjects/IcePlayer";
import FirePlayer from "../gameobjects/FirePlayer";

export class MainGameScene extends Phaser.Scene {
  constructor() {
    super("MainGameScene");
    this.isFireAttacking = false;
    this.isIceAttacking = false;
    this.isAttacking = false;
    this.redHealth = 100;
    this.blueHealth = 100;
    this.redHealthFill = null;
    this.blueHealthFill = null;
    this.icePlayer = null;
    this.firePlayer = null;
    this.cursors = null;
    this.aKey = null;
    this.dKey = null;
    this.wKey = null;
    this.ctrlKey = null;
    this.shiftKey = null;
  }

  preload() {
    this.load.image("bg", "assets/images/War.png");
    this.load.image("road", "assets/images/roadnew.png");
    this.load.image("redhealth", "assets/images/health/red_meter.png");
    this.load.image("bluehealth", "assets/images/health/blue_meter.png");
    this.load.image("redfill", "assets/images/health/redfill.png");
    this.load.image("bluefill", "assets/images/health/bluefill.png");

    this.load.audio('backgroundMusic', 'assets/sounds/Battlefield(loop).mp3');
    this.load.audio('fireballAttack', '/assets/sounds/Fireball 3.wav');
    this.load.image('flameParticle', 'assets/images/firePlayer/particles.png');
    this.load.audio('iceAttack', 'assets/sounds/Ice Throw 1.wav');
    this.load.audio('deadSound', 'assets/sounds/dead.mp3');
    this.load.spritesheet("iceWalkSprite", "assets/images/icePlayer/Walk1.png", {
      frameWidth: 193,
      frameHeight: 300,
    });
    this.load.spritesheet("iceAttackSprite", "assets/images/icePlayer/Attack_ice.png", {
      frameWidth: 514,
      frameHeight: 300,
    });

    this.load.spritesheet("iceDeadSprite", "assets/images/icePlayer/Dead.png", {
      frameWidth: 406,
      frameHeight: 300,
    });
    this.load.spritesheet("iceHurtSprite", "assets/images/icePlayer/Hurt.png", {
      frameWidth: 210,
      frameHeight: 275,
    });
    this.load.spritesheet(
      "fireWalkSprite",
      "assets/images/firePlayer/walk_fire123.png",
      {
        frameWidth: 108,
        frameHeight: 300,
      }
    );
    this.load.spritesheet(
      "fireAttackSprite",
      "assets/images/firePlayer/flame_new.png",
      {
        frameWidth: 504,
        frameHeight: 325,
      }
    );
    this.load.spritesheet(
      "fireHurtSprite",
      "assets/images/firePlayer/hurt_fire1.png",
      {
        frameWidth: 300,
        frameHeight: 300,
      }
    );
    this.load.spritesheet(
      "fireDeadSprite",
      "assets/images/firePlayer/dead_fire1.png",
      {
        frameWidth: 300,
        frameHeight: 300,
      }
    );
  }

  create() {
    // Create background and health bars
    this.background = this.add
      .tileSprite(0, 0, 3000, 600, "bg")
      .setOrigin(0.5, 0);
      this.redHealthFill = this.add.image(774, 55, "redfill").setTint(0xff4d4d); // Tint for a glowing effect
      this.blueHealthFill = this.add
        .image(327, 55, "bluefill")
        .setFlipX(true)
        .setTint(0x4db8ff); // Tint for cool tones
  
      this.add.image(750, 60, "redhealth").setTint(0x990000); // Base health bar color
      this.add.image(350, 60, "bluehealth").setFlipX(true).setTint(0x0033cc);

    this.load.audio('fireballAttack', 'game/public/assets/sounds/Fireball 3.wav');
    
    // Create background song
    let backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.5 });
    this.input.once('pointerdown', () => {

      backgroundMusic.play();
    });

    // Create platforms
    var platforms = this.physics.add.staticGroup();
    platforms.create(500, 650, "road").setOrigin(0.5, 0.5);

    // End Game button
    const endGameButton = this.add
    .text(533, 10, "End Game", {
      fontSize: "28px",
      color: "#ffffff",
      fontFamily: "Verdana, Arial, sans-serif",
      backgroundColor: "#d63333", // Bold red
      padding: { x: 15, y: 8 },
      borderRadius: 10,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 4,
        stroke: true,
        fill: true,
      },
    })
    .setOrigin(0.5);

    endGameButton
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        // Transition to the game over scene
        this.scene.start("GameOverScene");
      });

    // Create players
    this.icePlayer = new IcePlayer(this, 167, 100);
    this.firePlayer = new FirePlayer(this, 900, 100).setFlipX(true); // Pass scene context to FirePlayer

    this.physics.add.collider(this.firePlayer, platforms);

    this.physics.add.collider(this.icePlayer, platforms);

    this.physics.add.collider(this.firePlayer, this.icePlayer);

    // Create keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.ctrlKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.CTRL
    );
    this.shiftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
  }

  update() {
    this.icePlayer.update(this.aKey, this.dKey, this.wKey, this.ctrlKey);
    this.firePlayer.update(this.cursors, this.shiftKey);

    // Update IcePlayer health bar
    this.updateHealthBar();
  }

  updateHealthBar() {
    // Update Blue Health Bar (IcePlayer)
    const iceHealthPercent = Phaser.Math.Clamp(
      this.icePlayer.health / 100,
      0,
      1
    );
    this.blueHealthFill.displayWidth = 300 * iceHealthPercent; // Adjust based on max width
    this.blueHealthFill.x = 327 - (300 * (1 - iceHealthPercent)) / 2; // Keep it anchored to the left

    // Update Red Health Bar (FirePlayer)
    const fireHealthPercent = Phaser.Math.Clamp(
      this.firePlayer.health / 100,
      0,
      1
    );
    this.redHealthFill.displayWidth = 300 * fireHealthPercent; // Adjust based on max width
    this.redHealthFill.x = 774 + (300 * (1 - fireHealthPercent)) / 2; // Keep it anchored to the right

  }
}
