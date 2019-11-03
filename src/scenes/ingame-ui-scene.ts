import { Scene } from "phaser"
import { UIBar } from "../objects/ui-bar";

export class InGameUIScene extends Phaser.Scene {

    private _game:Scene;


    constructor() {
        super({
            key: 'InGameUIScene'
        });
    }

    create() {
        let healthBar = new UIBar({
            scene: this,
            width: 150,
            height: 10,
            x: 70,
            y: 14,
            value: 100, 
            maxValue: 100, 
            color:0xff0f0f,
            baseColor:0xcccccc,
        });

        let fuelBar = new UIBar({
            scene: this,
            width: 150,
            height: 10,
            x: 70,
            y: 33,
            value: 100, 
            maxValue: 100, 
            color:0x0000ff,
            baseColor:0xcccccc,
        });

        this._game = this.scene.get('GameScene');
        this.add.text(10, 10, 'Health', { font: '18px Arial', fill: '#000000' });
        this.add.text(25, 30,   'Fuel', { font: '18px Arial', fill: '#000000' });
        var distance = this.add.text(this.cameras.main.width/2, 10, '', { font: '18px Arial', fill: '#000000' })

        this._game.events.on('setHealth', function(value) {
            healthBar.value = value;
        }, this);

        this._game.events.on('setFuel', function(value) {
            if (value < 0) {value = 0;}
            fuelBar.value = value;
        }, this);

        this._game.events.on('setDistance', function(value) {
            distance.setText((value / 1000) + '');
        }, this);

        this.events.on('shutdown', function() {
            this._game.events.off('setHealth');
            this._game.events.off('setFuel');
            this._game.events.off('setDistance');
        }, this);

    }
}