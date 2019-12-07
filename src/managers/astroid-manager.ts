import { Scene, GameObjects, Cameras } from "phaser";
import { PlatformManager } from "./platform-manager";
import { Player } from "../objects/player";

export class AstroidManager {
    private _scene:Scene;
    private _colliders:Array<GameObjects.GameObject> = new Array<GameObjects.GameObject>();
    private _astroids:Array<Phaser.Physics.Arcade.Image> = new Array<Phaser.Physics.Arcade.Image>();
    public get frequency():number { return this._frequency; }
    public set frequency(value:number) {
        this._frequency = value;
    }
    private _frequency:number = 0;

    private _queueTime:number;

    constructor(scene:Scene) {
        this._scene = scene;
    }

    public addCollider(object:GameObjects.GameObject) {
        this._colliders.push(object);
    }

    update(time:number, delta:number) {
        if (this._frequency === 0) { return; }
        if (this._queueTime > 0) {
            this._queueTime -= delta;
        } else if (this._queueTime <= 0) {
            let ms = this._frequency * 1000;
            this._queueTime = Phaser.Math.Between(ms/2, ms);
            this.createAstroid();
        } else {
            let ms = this._frequency * 1000;
            this._queueTime = Phaser.Math.Between(0, ms);
        }
        /*
        let toRemove = [];
        this._astroids.forEach((value, index) => {
            if (value.y > this._scene.cameras.main.height - (value.height / 2)) {
                toRemove.push(index);
                value.destroy();
            }
        });
        toRemove.forEach((value) => this._astroids.splice(value, 1));
        */
    }

    private createAstroid() {
        let x = Phaser.Math.Between(0, this._scene.cameras.main.width + 50);

        let frame = 'astroid_' + Phaser.Math.Between(1, 4) + '.png';
        let astroid = this._scene.physics.add.image(x, -50, 'astroids', frame);
        astroid.name = 'astroid';
        astroid.setScale(0.55);
        this._astroids.push(astroid);
        this._scene.physics.add.overlap(astroid, this._colliders, function(astroid, object) {
            if (object.name === 'player') {
                (object as Player).hurt();
            } else if (object.name === 'ground') {
                console.log('astroid hit ground')
                let tile = (object as GameObjects.Sprite);
                tile.setFrame('lavaTop_high.png');
                tile.name = 'lava';
                astroid.destroy();
                this._scene.cameras.main.shake(400, 0.02);
            } else {
                // TODO: handle?
            }
        }.bind(this));
    }
}