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
      fontSize: '72px',
      color: 'red',
      backgroundColor: '#000',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.add.text(533.5, 200, `${this.winner} Wins!`, {
      fontSize: '48px',
      color: '#fff',
      backgroundColor: '#000',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    const restartButton = this.add.text(533.5, 300, 'Restart', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    restartButton.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('CharacterNameScene');
      });
  }
}