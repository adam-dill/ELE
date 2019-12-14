import { SceneNames } from '../game';
import { PlatformManager } from '../managers/platform-manager';
import { Player } from '../objects/player';
import { G } from '../g';

export class MenuScene extends Phaser.Scene {
    private _background:Phaser.GameObjects.TileSprite;
    private _platformManager:PlatformManager;
    private _player:Player;
    private _from:string;
    private _allowSoundChange:boolean = false;
    
    constructor() {
        super({
            key: SceneNames.MENU
        });
    }

    private get soundButtonFrame():string {
        if (G.hasSound) {
            return 'audio_on.png';
        }
        return 'audio_off.png';
    }

    preload() {
        this.load.atlas('ui', './assets/ui.png', './assets/ui.json');
        this.load.image("background", "./assets/blue_shroom.png");
        this.load.atlas('player', './assets/alien.png', './assets/alien.json');
        this.load.atlas('ground', './assets/platforms.png', './assets/platforms.json');
        this.load.atlas('astroids', './assets/astroids.png', './assets/astroids.json');
        this.load.atlas('ingame', './assets/ingame.png', './assets/ingame.json');
        this.load.audio('happySong', './assets/cheerful-day.mp3');
        this.load.audio('playerJump', './assets/player-jump.mp3');
        this.load.audio('toggleSound', './assets/toggle-sound.mp3');
        this.load.image('arrowIcon', './assets/keyboard.png');
    }

    create() {
        // create background
        let shakeOffset = 50;
        this._background = this.add.tileSprite(-shakeOffset, -shakeOffset, this.sys.canvas.width + (shakeOffset*2), this.sys.canvas.height + (shakeOffset*2), 'background');
        this._background.setOrigin(0, 0);
        this._background.setTileScale(0.9);

        if (G.backgroundMusic === null || G.backgroundMusic.key !== 'happySong') {
            G.backgroundMusic = this.sound.add('happySong', {volume: 0.5, loop:true});
            G.backgroundMusic.play();
        }

        let arrowIcon = this.add.image(150, 100, 'arrowIcon');

        let soundButton = this.physics.add.image(0, 0, 'ui', this.soundButtonFrame);
        soundButton.setScale(0.5);
        let body = soundButton.body as Phaser.Physics.Arcade.Body;
        body.setImmovable(true);
        body.setAllowGravity(false);
        soundButton.x = this.cameras.main.width / 2;
        soundButton.y = 270;
        soundButton.setInteractive().on('pointerup', () => { this._toggleSound(soundButton) });

        let leaderboardSign = this.add.image(0, 0, 'ui', 'sign_leaderboard.png');
        leaderboardSign.x = leaderboardSign.width - 50;
        leaderboardSign.y = 470;

        let playSign = this.add.image(0, 0, 'ui', 'sign_play.png');
        playSign.setScale(1.2);
        playSign.x = this.cameras.main.width - (playSign.width*playSign.scaleX) + 75;
        playSign.y = 475;

        this._player = new Player({
            scene: this,
            x: 500,
            y: 350,
            texture: 'player',
            autoRun: false,
        });

        this.physics.add.collider(this._player, soundButton, () => { this._toggleSound(soundButton) });

        this._platformManager = new PlatformManager(this);
        this._platformManager.addCollider(this._player);

        window['clearOverlay'].call();
    }

    update(time:number, delta:number): void {
        this._platformManager.update(time, delta);
        this._player.update(time, delta);
        if (this._player.body.onFloor()) {
            this._allowSoundChange = true;
        }
        if (this._player.x < 0) {
            this.scene.start(SceneNames.LEADER); 
        } else if (this._player.x > this.cameras.main.width) {
            this.scene.start(SceneNames.GAME);
        }
      }


      private _toggleSound(soundButton:Phaser.GameObjects.Image) {
        if (this._allowSoundChange) {
            G.hasSound = !G.hasSound;
            if (G.hasSound) {
                G.backgroundMusic.resume();
            } else {
                G.backgroundMusic.pause();
            }
            soundButton.setFrame(this.soundButtonFrame);
            this._allowSoundChange = false;

            let origY = soundButton.y;
            soundButton.y -= 15;
            this.tweens.add({
                targets:soundButton,
                duration:250,
                y: origY,
            });

            this.sound.play('toggleSound');
        }
      }
}