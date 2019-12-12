import { PlatformManager } from '../managers/platform-manager';
import { Player } from '../objects/player';
import { SceneNames } from '../game';
import { DataAdapter, ScoreResult } from '../data/data-adapter';

export class LeaderBoardScene extends Phaser.Scene {
    private _background:Phaser.GameObjects.TileSprite;
    private _platformManager:PlatformManager;
    private _player:Player;
    private _cameraSize:Phaser.Geom.Point;
    private _scores:Array<ScoreResult>;

    constructor() {
        super({
            key: SceneNames.LEADER
        });
        
    }

    preload(): void {
        this.load.image("background", "./assets/blue_shroom.png");
        this.load.atlas('player', './assets/alien.png', './assets/alien.json');
        this.load.atlas('ground', './assets/platforms.png', './assets/platforms.json');
        this.load.atlas('astroids', './assets/astroids.png', './assets/astroids.json');
        this.load.atlas('ingame', './assets/ingame.png', './assets/ingame.json');
        this.load.audio('playerJump', './assets/player-jump.mp3');
        this.load.audio('playerHurt', './assets/player-hurt.mp3');
        this.load.audio('astroidHit', './assets/astroid-hit.mp3', { instances: 3 });
        this.load.audio('healthPickup', './assets/health-pickup.mp3');
    }

    create(): void {
        this._cameraSize = new Phaser.Geom.Point(this.cameras.main.width, this.cameras.main.height);

        // create background
        let shakeOffset = 50;
        this._background = this.add.tileSprite(-shakeOffset, -shakeOffset, this._cameraSize.x + (shakeOffset*2), this._cameraSize.y + (shakeOffset*2), 'background');
        this._background.setOrigin(0, 0);
        this._background.setTileScale(0.9);
        
        this._player = new Player({
            scene: this,
            x: this._cameraSize.x,
            y: 350,
            texture: 'player',
            autoRun: false,
        });

        this._platformManager = new PlatformManager(this);
        this._platformManager.addCollider(this._player);

        this._player.scaleX = -1;
        this._player.body.collideWorldBounds = true;

        window['clearOverlay'].call();

        DataAdapter.getScores()
            .then((result) => {
                this._scores = DataAdapter
                                .serialize(ScoreResult, result)
                                .sort((a, b) => a.scores.distance > b.scores.distance ? 1 : -1);
                console.log(this._scores);
            })
            .catch((result) => {
                console.error('Failed to load scores.', result);
            });
    }

    update(time:number, delta:number): void {
        // update objects
        this._player.update(time, delta);
        let v = this._player.body.velocity.x;
        if (v < 0 && this._player.x < this._cameraSize.x/2) {
            this._player.body.collideWorldBounds = true;
        } else {
            this._player.body.collideWorldBounds = false;
            if (this._player.x > this._cameraSize.x) {
                this.scene.start(SceneNames.MENU, {from:SceneNames.LEADER});
            }
        }
    }
}