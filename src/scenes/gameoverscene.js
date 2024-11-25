import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  preload() {
       // Preload the background image
    this.load.image('bgimg', 'assets/bgimg.jpg');
  }

  create() {
    
    // Add background image
    this.add.image(533.5, 300, 'bgimg').setOrigin(0.5); // Centers the background image

    // Add a title
    this.add.text(533.5, 100, 'Game Over', {
      fontSize: '72px',
      color: 'red',
      backgroundColor: '#000',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Add a button to restart the game
    const restartButton = this.add.text(533.5, 300, 'Restart', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    restartButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      // Restart the game by going back to the character naming scene
      this.scene.start('CharacterNameScene');
    });
  }
}
