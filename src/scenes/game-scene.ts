import { PlatformManager } from '../managers/platform-manager';
import { AstroidManager } from '../managers/astroid-manager';
import { InGameMananger } from '../managers/ingame-manager';
import { Player } from '../objects/player';
import { SceneNames } from '../game';
import { Flag } from '../objects/flag';
import { ImageText } from '../objects/image-text';
import { HealthDrop } from '../objects/health-drop';
import { Time } from 'phaser';

export class GameScene extends Phaser.Scene {
  private _background:Phaser.GameObjects.TileSprite;
  private _platformManager:PlatformManager;
  private _astroidManager:AstroidManager;
  private _inGameManager:InGameMananger;
  
  private _player:Player;

  private _speed:number = 10;
  private _distance:number = 0;
  private _maxFrequency:number = 4;
  private _minFrequency:number = 1;
  private _frequencyInterval:number = 0.001;

  constructor() {
    super({
      key: SceneNames.GAME
    });
    
  }

  preload(): void {
    this.load.image("background", "./assets/blue_shroom.png");
    this.load.atlas('player', './assets/alien.png', './assets/alien.json');
    this.load.atlas('ground', './assets/platforms.png', './assets/platforms.json');
    this.load.atlas('astroids', './assets/astroids.png', './assets/astroids.json');
    this.load.atlas('ingame', './assets/ingame.png', './assets/ingame.json');
  }

  create(): void {
    let ui = this.scene.get(SceneNames.GAME_UI).scene.start();
    
    // create background
    let shakeOffset = 50;
    this._background = this.add.tileSprite(-shakeOffset, -shakeOffset, this.sys.canvas.width + (shakeOffset*2), this.sys.canvas.height + (shakeOffset*2), 'background');
    this._background.setOrigin(0, 0);
    this._background.setTileScale(0.9);

    this._player = new Player({
      scene: this,
      x: 200,
      y: 200,
      texture: 'player',
    });

    this._astroidManager = new AstroidManager(this);
    this._astroidManager.frequency = this._maxFrequency;
    this._platformManager = new PlatformManager(this, this._astroidManager);
    this._platformManager.speed = this._speed;
    this._inGameManager = new InGameMananger(this, this._player);
    this._inGameManager.speed = this._speed;

    this._astroidManager.addCollider(this._player);
    this._platformManager.addCollider(this._player);

    this.events.on('playerDie', function() {
      this.scene.start(SceneNames.LEADER_ENTRY, {distance: this._distance});
    }, this);

    this.events.on('shutdown', function() {
      this.events.off('playerDie');
      this.events.off('shutdown');
      this._distance = 0;
      this.scene.get(SceneNames.GAME_UI).scene.stop();
    }, this);

    window['clearOverlay'].call();
  }

  update(time:number, delta:number): void {
    // update objects
    this._background.tilePositionX += 1;
    this._platformManager.update(time, delta);
    this._astroidManager.update(time, delta);
    this._inGameManager.update(time, delta);
    this._player.update(time, delta);

    this._distance += this._speed;
    this.events.emit('setDistance', this._distance);

    if ((this._distance / 1000) % 5 === 0) {
      this._inGameManager.spawnFlag(Math.round(this._distance/1000));
    }

    if (this._astroidManager.frequency > this._minFrequency) {
      this._astroidManager.frequency -= this._frequencyInterval;
    }
  }
  
}
