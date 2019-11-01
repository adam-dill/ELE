import { Scene } from "phaser"

export class UIScene extends Phaser.Scene {

    private _game:Scene;


    constructor() {
        super({
            key: 'UIScene',
            active: true
        });
    }

    create() {
        this._game = this.scene.get('GameScene');
        var health = this.add.text(10, 10, 'H: 100', { font: '18px Arial', fill: '#000000' });
        var fuel = this.add.text(10, 30,   'F: 100', { font: '18px Arial', fill: '#0000ff' });
        var distance = this.add.text(this.cameras.main.width/2, 10, '', { font: '18px Arial', fill: '#000000' })

        this._game.events.on('setHealth', function(value) {
            health.setText('H: '+Phaser.Math.Clamp(value, 0, 100));
        }, this);

        this._game.events.on('setFuel', function(value) {
            if (value < 0) {value = 0;}
            fuel.setText('F: '+Math.round(value));
        }, this);

        this._game.events.on('setDistance', function(value) {
            distance.setText((value / 1000) + '');
        }, this);
    }
}