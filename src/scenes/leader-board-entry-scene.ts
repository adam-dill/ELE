import { SceneNames } from "../game";

export class LeaderBoardEntryScene extends Phaser.Scene {
    constructor() {
        super({
            key: SceneNames.LEADER_ENTRY
        });
    }

    create() {
        let title = this.add.text(0, this.cameras.main.height/2, "Enter Info to Leader Board Screen", { font: '24px Arial', fill: '#ffffff' });
        title.x = this.cameras.main.width / 2 - title.width / 2;
        
        let menu = this.add.text(10, 10, 'Menu', { font: '18px Arial', fill: '#ffffff' });
        menu.setInteractive().on('pointerdown', function() {
            this.scene.start(SceneNames.MENU);
        }, this);

        let leader = this.add.text(10, 30, 'Leader Boards', { font: '18px Arial', fill: '#ffffff' });
        leader.setInteractive().on('pointerdown', function() {
            this.scene.start(SceneNames.LEADER);
        }, this);

        this.events.on('shutdown', function(scene:Phaser.Scene) {
            scene.events.off('shutdown');
            menu.off('pointerdown');
            leader.off('pointerdown');
        }, this);
    }
}