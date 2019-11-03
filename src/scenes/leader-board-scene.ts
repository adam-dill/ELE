import { SceneNames } from "../game";

export class LeaderBoardScene extends Phaser.Scene {
    constructor() {
        super({
            key: SceneNames.LEADER
        });
    }

    create() {
        let menu = this.add.text(10, 10, 'Menu', { font: '18px Arial', fill: '#ffffff' });
        menu.setInteractive().on('pointerdown', function() {
            this.scene.start(SceneNames.MENU);
        }, this);

        this.events.on('shutdown', function(scene:Phaser.Scene) {
            scene.events.off('shutdown');
            menu.off('pointerdown');
        }, this);
    }
}