import { SceneNames } from "../game";

export class LeaderBoardEntryScene extends Phaser.Scene {

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

    create() {
        let title = this.add.text(0, this.cameras.main.height/2, "Enter Info to Leader Board Screen", { font: '24px Arial', fill: '#ffffff' });
        title.x = this.cameras.main.width / 2 - title.width / 2;

        let formated = Phaser.Math.RoundTo(this._distance/1000, -1);
        let distance = this.add.text(0, 0, "Distance: "+formated, { font: '24px Arial', fill: '#ffffff' });
        distance.x = this.cameras.main.width / 2 - distance.width / 2;
        distance.y = title.y + title.height;
        
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
        console.log('create');

        window['renderLeaderboardInput'].call(window, this._distance);
    }
}