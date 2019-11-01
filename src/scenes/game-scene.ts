import { PlatformManager } from '../managers/platform-manager';
import { AstroidManager } from '../managers/astroid-manager';
import { Player } from '../objects/player';
import { Cameras } from 'phaser';

export class GameScene extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _background:Phaser.GameObjects.TileSprite;
  private _platformManager:PlatformManager;
  private _astroidManager:AstroidManager;
  
  private _player:Phaser.GameObjects.Sprite;

  private _speed:number = 10;
  private _distance:number = 0;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.image("background", "./assets/PNG/Backgrounds/blue_shroom.png");
    this.load.image('bubble', './assets/particles/bubble.png');
    this.load.atlas('player', './assets/alien.png', './assets/alien.json');
    this.load.atlas('ground', './assets/platforms.png', './assets/platforms.json');
    this.load.atlas('astroids', './assets/astroids.png', './assets/astroids.json');
    this.load.atlas('particles', './assets/particles/shapes.png', './assets/particles/shapes.json');
    this.load.json('jetEmitter', './assets/particles/jet.json');
    this.load.json('astroidEmitter', './assets/particles/astroidTail.json');
  }

  create(): void {
    this.cursors = this.input.keyboard.createCursorKeys();

    // create background
    let shakeOffset = 50;
    this._background = this.add.tileSprite(-shakeOffset, -shakeOffset, this.sys.canvas.width + (shakeOffset*2), this.sys.canvas.height + (shakeOffset*2), 'background');
    this._background.setOrigin(0, 0);
    this._background.setTileScale(0.9);

    this._player = new Player({
      scene: this,
      x: 200,
      y: 200,
      texture: 'player'
    });

    this._platformManager = new PlatformManager(this);
    this._platformManager.speed = this._speed;
    this._astroidManager = new AstroidManager(this, this._platformManager);
    this._astroidManager.frequence = 2;

    this._platformManager.addCollider(this._player);
    this._astroidManager.addCollider(this._player);
  }

  update(time:number, delta:number): void {
    // update objects
    this._background.tilePositionX += 1;
    this._platformManager.update(time, delta);
    this._astroidManager.update(time, delta);
    this._player.update(time, delta);

    this._distance += this._speed;
    this.events.emit('setDistance', this._distance);
  }
  
}
