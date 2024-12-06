export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.winner = data.winner;
  }

  create() {
    this.add.image(533.5, 300, 'bgimg').setOrigin(0.5);

    this.add.text(533.5, 100, 'Game Over', {
      fontSize: '80px',
      color: '#ff4747', // Vibrant red
      fontFamily: 'Verdana, Arial, sans-serif',
      stroke: '#000', // Black stroke for contrast
      strokeThickness: 6,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: '#333',
        blur: 8,
        stroke: true,
        fill: true,
      },
    }).setOrigin(0.5);

    this.add.text(533.5, 200, `${this.winner} Wins!`, {
      fontSize: '52px',
      color: '#ffea00', // Bright yellow for attention
      fontFamily: 'Verdana, Arial, sans-serif',
      stroke: '#000',
      strokeThickness: 4,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true,
      },
    }).setOrigin(0.5);

    const restartButton = this.add.text(533.5, 300, 'Restart', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Verdana, Arial, sans-serif',
      backgroundColor: '#007bff', // Attractive blue
      padding: { x: 15, y: 10 },
      borderRadius: 5, // Rounded edges (visual effect)
    }).setOrigin(0.5);

    restartButton.setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        restartButton.setStyle({ backgroundColor: '#0056b3', color: '#ffea00' }); // Change to a darker blue and bright text on hover
      })
      .on('pointerout', () => {
        restartButton.setStyle({ backgroundColor: '#007bff', color: '#ffffff' }); // Reset to original colors
      })
      .on('pointerdown', () => {
        this.scene.start('CharacterNameScene');
      });
  }
}
