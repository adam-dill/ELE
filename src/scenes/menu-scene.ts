import { SceneNames } from '../game';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: SceneNames.MENU
        });
    }

    preload() {
        this.load.atlas('ui', './assets/ui.png', './assets/ui.json');
    }

    create() {
        let center = new Phaser.Geom.Point(this.cameras.main.width/2, this.cameras.main.height/2);
        
        //let leaderboard = this.add.text(10, 30, 'Leader Board', { font: '18px Arial', fill: '#ffffff' });

        let playButton = this.add.image(0, 0, 'ui', 'blue_button02.png');
        playButton.x = center.x;
        playButton.y = center.y - playButton.height;

        let playText = this.add.text(0, 0, 'PLAY', { font: '24px Arial', fill: '#ffffff' });
        playText.x = playButton.x - (playText.width/2);
        playText.y = playButton.y - (playText.height/2);

        let leaderboardButton = this.add.image(0, 0, 'ui', 'blue_button09.png');
        leaderboardButton.x = playButton.x - (playButton.width / 2) + ((leaderboardButton.width*leaderboardButton.scaleX) / 2);
        leaderboardButton.y = playButton.y + (playButton.height / 2) + ((leaderboardButton.height*leaderboardButton.scaleY) / 2);

        let soundButton = this.add.image(0, 0, 'ui', 'grey_button09.png');
        soundButton.x = playButton.x + (playButton.width / 2) - ((soundButton.width*soundButton.scaleX) / 2);
        soundButton.y = playButton.y + (playButton.height / 2) + ((soundButton.height*soundButton.scaleY) / 2);

        playButton.setInteractive().on('pointerdown', function() {
            this.scene.start(SceneNames.GAME);
        }, this);

        leaderboardButton.setInteractive().on('pointerdown', function() {
            this.scene.start(SceneNames.LEADER);
        }, this);

        soundButton.setInteractive().on('pointerdown', function() {
            // TODO: toggle audio
        }, this);

        this.events.on('shutdown', function(scene:Phaser.Scene) {
            this.events.off('shutdown');
            playButton.off('pointerdown');
            leaderboardButton.off('pointerdown');
        }, this);

        window['clearOverlay'].call();
    }
}