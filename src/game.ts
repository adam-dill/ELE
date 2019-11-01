import "phaser";
import { GameScene } from "./scenes/game-scene";
import { UIScene } from "./scenes/ui-scene";

const config: Phaser.Types.Core.GameConfig = {
  title: "Infinite Runner",
  width: 1000,
  height: 576,
  type: Phaser.AUTO,
  parent: "game",
  scene: [GameScene, UIScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 },
      debug: false
    }
  },
  input: {
    keyboard: true
  },
  backgroundColor: "#000000",
  render: { pixelArt: false, antialias: true }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  var game = new Game(config);
});
