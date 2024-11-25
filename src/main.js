import Phaser from 'phaser';
import { CharacterNameScene } from './scenes/pregamescene';
import { MainGameScene } from './scenes/gamescene';
import { GameOverScene } from './scenes/gameoverscene';

// Create a container for the game
const container = document.createElement('div');
container.id = 'game-container';
document.body.appendChild(container);

// Apply styles to center the game on the screen
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.display = 'flex';
document.body.style.alignItems = 'center';
document.body.style.justifyContent = 'center';
document.body.style.height = '100vh';
document.body.style.backgroundColor = '#000';
document.body.style.overflow = 'hidden';

// Phaser Game Configuration
const config = {
  type: Phaser.AUTO,
  width: 1067,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  backgroundColor: '#000',
  parent: 'game-container',
  scene: [CharacterNameScene, MainGameScene, GameOverScene],
};

// Initialize the Phaser Game
new Phaser.Game(config);
