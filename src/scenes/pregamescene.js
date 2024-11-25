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
    this.add.text(533.5, 50, 'welcome', {
      fontSize: '32px',
      color: 'red',
      backgroundColor: '#000',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Add the name input form
    const form = this.add.dom(533.5, 200).createFromCache('nameform');
    //this.add.form(533.,80,'nameform');

    // Add a button to start the game
    const startButton = this.add.text(533.5, 350, 'Start Game', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    startButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      // Transition to the MainGameScene
      this.scene.start('MainGameScene');
    });
  }
}
