import { SceneNames } from '../game';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: SceneNames.MENU
        });
    }

    create() {
        let start = this.add.text(10, 10, 'Start', { font: '18px Arial', fill: '#ffffff' });
        let leaderboard = this.add.text(10, 30, 'Leader Board', { font: '18px Arial', fill: '#ffffff' });

        start.setInteractive().on('pointerdown', function() {
            this.scene.start(SceneNames.GAME);
        }, this);

        leaderboard.setInteractive().on('pointerdown', function() {
            this.scene.start(SceneNames.LEADER);
        }, this);

        this.events.on('shutdown', function(scene:Phaser.Scene) {
            this.events.off('shutdown');
            start.off('pointerdown');
            leaderboard.off('pointerdown');
        }, this);
    }
}