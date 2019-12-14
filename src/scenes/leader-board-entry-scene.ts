import { SceneNames } from "../game";
import { PlatformManager } from "../managers/platform-manager";
import { Player } from "../objects/player";
import { DataAdapter, ScoreResult } from '../data/data-adapter';

export class LeaderBoardEntryScene extends Phaser.Scene {
    private _background:Phaser.GameObjects.TileSprite;
    private _platformManager:PlatformManager;
    private _player:Player;
    private _cameraSize:Phaser.Geom.Point;
    private _distance:number = 0;

    constructor() {
        super({
            key: SceneNames.LEADER_ENTRY
        });
    }

    init(data:any) {
        // data.distance should be the score
        this._distance = data.distance;
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
        
        let homeSign = this.add.image(0, 0, 'ui', 'sign_home.png');
        homeSign.x = this.cameras.main.width - homeSign.width + 50;
        homeSign.y = 475;

        this._player = new Player({
            scene: this,
            x: this._cameraSize.x/2,
            y: 350,
            texture: 'player',
            autoRun: false,
        });

        this._platformManager = new PlatformManager(this);
        this._platformManager.addCollider(this._player);

        this._player.body.collideWorldBounds = true;

        window['loadOverlay'].call(undefined, 'leaderboard-input.html', () => this._loadScores());
    }

    update(time:number, delta:number): void {
        // update objects
        this._player.update(time, delta);
        let v = this._player.body.velocity.x;
        if (v < 0) {
            this._player.body.collideWorldBounds = true;
        } else {
            this._player.body.collideWorldBounds = false;
            if (this._player.x > this._cameraSize.x) {
                this.scene.start(SceneNames.MENU, {from:SceneNames.GAME});
            }
        }
    }

    private _loadScores() {
        DataAdapter.getScores()
            .then((result) => {
                let scores = DataAdapter
                                .serialize(ScoreResult, result)
                                .sort((a, b) => a.scores.distance < b.scores.distance ? 1 : -1);
                this._initUi(this._getRank(this._distance, scores));
            })
            .catch((result) => {
                console.error('Failed to load scores.', result);
            });
    }

    private _initUi(rank:number) {
        document.getElementById('distanceValue').innerText = Phaser.Math.FloorTo(this._distance / 1000, -2).toString();
        document.getElementById('rankValue').innerText = rank.toString();
        document.getElementById('leaderboardButton').addEventListener('click', (e) => {
            // get around typescript casting
            document.getElementById('leaderboardButton').classList.add('hidden');
            document.getElementById('inputControls').style.display = 'flex';
            document.getElementById('submitButton').addEventListener('click', () => {
                let name = (<HTMLInputElement>document.getElementById('inputText')).value;
                if (name === '') {
                    alert("Enter text in the input box.");
                    return;
                }
                document.getElementById('inputControls').style.display = 'none';
                document.getElementById('statusMessage').innerText = "Adding...";
                DataAdapter.postScore(name, this._distance)
                .then(() => {
                    document.getElementById('statusMessage').innerText = "Your score has been added.";
                })
                .catch(() => {
                    document.getElementById('inputControls').style.display = 'flex';
                    document.getElementById('statusMessage').innerText = "There was an error posting the score.";
                });
            });
        });
    }

    private _getRank(score:number, scores:Array<ScoreResult>) {
        const len = scores.length;
        for (let i = 0; i < len; i++) {
            if (scores[i].scores.distance < score) {
                return i+1
            }
        }
        return len+1;
    }
}