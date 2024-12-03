import IcePlayer from '../gameobjects/IcePlayer';
import FirePlayer from '../gameobjects/FirePlayer';

export class MainGameScene extends Phaser.Scene {
  constructor() {
    super('MainGameScene');
    this.isFireAttacking = false;
    this.isIceAttacking = false;
    this.redHealth = 100;
    this.blueHealth = 100;
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
    this.load.spritesheet("fireWalkSprite", "assets/images/firePlayer/walk_fire123.png", {
      frameWidth: 108,
      frameHeight: 300,
    });
    this.load.spritesheet("fireAttackSprite", "assets/images/firePlayer/flame_new.png", {
      frameWidth: 504,
      frameHeight: 325,
    });
    this.load.spritesheet("fireHurtSprite", "assets/images/firePlayer/hurt_fire1.png", {
      frameWidth: 300,
      frameHeight: 300,
    });
    this.load.spritesheet("fireDeadSprite", "assets/images/firePlayer/dead_fire1.png", {
      frameWidth: 300,
      frameHeight: 300,
    });
  }

  create() {
    // Create background and health bars
    this.background = this.add.tileSprite(0, 0, 3000, 600, "bg").setOrigin(0.5, 0);
    this.redHealthFill = this.add.image(774, 55, "redfill");
    this.blueHealthFill = this.add.image(327, 55, "bluefill").setFlipX(true);
    this.add.image(750, 60, "redhealth");
    this.add.image(350, 60, "bluehealth").setFlipX(true);
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
    const endGameButton = this.add.text(533, 10, 'End Game', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    endGameButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      // Transition to the game over scene
      this.scene.start('GameOverScene');
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
    this.ctrlKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  }

  update() {
    this.icePlayer.update(this.aKey, this.dKey, this.wKey, this.ctrlKey);
    this.firePlayer.update(this.cursors, this.shiftKey);

    // Update IcePlayer health bar
    this.updateHealthBar();
  }

  updateHealthBar() {
    // Calculate the health bar fill based on IcePlayer's health
    const healthPercent = this.icePlayer.health / 100;
    this.blueHealthFill.setScale(healthPercent, 1); // Adjust the fill scale based on health
  }
}