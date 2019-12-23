import { PlatformManager } from '../managers/platform-manager';
import { Player } from '../objects/player';
import { SceneNames } from '../game';
import { DataAdapter, ScoreResult } from '../data/data-adapter';

export class LeaderBoardScene extends Phaser.Scene {
    private _background:Phaser.GameObjects.TileSprite;
    private _platformManager:PlatformManager;
    private _player:Player;
    private _cameraSize:Phaser.Geom.Point;
    private _loadingText:Phaser.GameObjects.Text;

    constructor() {
        super({
            key: SceneNames.LEADER
        });
        
    }

    preload(): void {
        this.load.atlas('ui', './assets/ui.png', './assets/ui.json');
        this.load.image("background", "./assets/blue_shroom.png");
        this.load.atlas('player', './assets/alien.png', './assets/alien.json');
        this.load.atlas('ground', './assets/platforms.png', './assets/platforms.json');
        this.load.atlas('ingame', './assets/ingame.png', './assets/ingame.json');
        this.load.audio('playerJump', './assets/player-jump.mp3');
    }

    create(): void {
        this._cameraSize = new Phaser.Geom.Point(this.cameras.main.width, this.cameras.main.height);

        // create background
        let shakeOffset = 50;
        this._background = this.add.tileSprite(-shakeOffset, -shakeOffset, this._cameraSize.x + (shakeOffset*2), this._cameraSize.y + (shakeOffset*2), 'background');
        this._background.setOrigin(0, 0);
        this._background.setTileScale(0.9);
        
        let homeSign = this.add.image(0, 0, 'ui', 'sign_home.png');
        homeSign.x = this.cameras.main.width - homeSign.width + 50;
        homeSign.y = 475;

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

        this._loadingText = this.add.text(500, 100, "Loading...", { 
            fontFamily: 'OrangeJuice', 
            fontSize: '24px',
            color: 'black'
        });
        this._loadingText.x = this._cameraSize.x / 2 - this._loadingText.width / 2;
        window['loadOverlay'].call(undefined, 'leaderboard-list.html', () => {
            this._loadScores();
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

    private _loadScores() {
        DataAdapter.getScores()
            .then((result) => {
                let scores = DataAdapter
                                .serialize(ScoreResult, result)
                                .sort((a, b) => a.scores.distance < b.scores.distance ? 1 : -1);
                this._addScores(scores.slice(0, 3))
                this._loadingText.destroy();
            })
            .catch((result) => {
                console.error('Failed to load scores.', result);
            });
    }

    private _addScores(scores) {
        let dom = document.getElementsByClassName('leaderboard-list')[0];
        scores.forEach((value) => {
            let score = Phaser.Math.FloorTo(value.scores.distance / 1000, -2);
            let str = `<li><span class="name">${value.playerName}</span><span class="score">${score}</span></li>`;
            dom.insertAdjacentHTML('beforeend', str);
        });
    }
}