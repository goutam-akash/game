import Phaser from 'phaser';

export class CharacterNameScene extends Phaser.Scene {
  constructor() {
    super('CharacterNameScene');
  }

  preload() {
    // Preload assets
    this.load.html('nameform', 'assets/nameform.html'); // Assuming an HTML form for character names
    this.load.image('bgimg', 'assets/images/bgimg.jpg'); // Preload a background image
  }

  create() {
    // Add background image
    this.add.image(533.5, 300, 'bgimg').setOrigin(0.5); // Centers the background image

    // Add a title
    this.add.text(533.5, 50, 'Welcome', {
      fontSize: '72px',
      color: '#ff4444',
      fontFamily: 'Verdana',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 8, fill: true },
    }).setOrigin(0.5);

    // Add the name input form
    const form = this.add.dom(533.5, 200).createFromCache('nameform');

    // Add a button to start the game
    const startButton = this.add.text(533.5, 350, 'Start Game', {
      fontSize: '36px',
      color: '#ffffff',
      fontFamily: 'Verdana',
      fontStyle: 'bold',
      backgroundColor: '#1a73e8',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      borderRadius: 5,
    }).setOrigin(0.5);

    // Add hover effect to the button
    startButton
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        startButton.setStyle({ backgroundColor: '#0057b7' });
      })
      .on('pointerout', () => {
        startButton.setStyle({ backgroundColor: '#1a73e8' });
      })
      .on('pointerdown', () => {
        // Transition to the MainGameScene
        this.scene.start('MainGameScene');
      });
  }
}
