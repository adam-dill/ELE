import "phaser";
import { MenuScene } from "./scenes/menu-scene";
import { GameScene } from "./scenes/game-scene";
import { LeaderBoardScene } from './scenes/leader-board-scene';
import { LeaderBoardEntryScene } from './scenes/leader-board-entry-scene';
import { InGameUIScene } from "./scenes/ingame-ui-scene";

export enum SceneNames {
  MENU='MenuScene',
  GAME='GameScene',
  GAME_UI='InGameUIScene',
  LEADER='LeaderBoardScene',
  LEADER_ENTRY='LeaderBoardEntryScene',
}

const config: Phaser.Types.Core.GameConfig = {
  title: "Infinite Runner",
  scale: {
    width: 1000,
    height: 576,
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  type: Phaser.AUTO,
  parent: "game",
  scene: [MenuScene, LeaderBoardScene, GameScene, InGameUIScene, LeaderBoardEntryScene],
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
  audio: {
    disableWebAudio: true
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
