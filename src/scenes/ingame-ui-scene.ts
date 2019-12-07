import { Scene } from "phaser"
import { UIGraphicBar } from "../objects/ui-graphic-bar";

export class InGameUIScene extends Phaser.Scene {

    private _game:Scene;
    private _distance:number=0;


    constructor() {
        super({
            key: 'InGameUIScene'
        });
    }

    create() {
       let healthBar = new UIGraphicBar({
           scene: this,
           x: 30,
           y: 30,
           height: 40,
           maxValue: 3,
           value: 3,
           texture: 'ingame',
           emptyImage: 'hudHeart_empty.png',
           fullImage: 'hudHeart_full.png',
       });

        this._game = this.scene.get('GameScene');
        var distance = this.add.text(this.cameras.main.width/2, 10, '', { font: '18px Arial', fill: '#000000' })

        this._game.events.on('setHealth', function(value) {
            healthBar.value = value;
        }, this);

        this._game.events.on('setDistance', function(value) {
            distance.setText((value / 1000) + '');
            this._distance = value;
        }, this);

        this.events.on('shutdown', function() {
            this._game.events.off('setHealth');
            this._game.events.off('setDistance');
        }, this);
    }

    update() {
        //console.log('distance: ' + this._distance);
    }

    
}