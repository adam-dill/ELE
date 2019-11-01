import { Scene, GameObjects } from "phaser";
import { PlatformManager } from "./platform-manager";
import { Player } from "../objects/player";

export class AstroidManager {
    private _scene:Scene;
    private _platformManager:PlatformManager;
    private _colliders:Array<GameObjects.GameObject> = new Array<GameObjects.GameObject>();


    public set frequence(value:number) {
        this._frequency = value;
    }
    private _frequency:number = 0;

    private _queueTime:number;

    constructor(scene:Scene, platformManager:PlatformManager) {
        this._scene = scene;
        this._platformManager = platformManager;
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
    }

    private createAstroid() {
        let x = Phaser.Math.Between(0, this._scene.cameras.main.width);

        let frame = 'astroid_' + Phaser.Math.Between(1, 4) + '.png';
        let astroid = this._scene.physics.add.image(x, -50, 'astroids', frame);
        astroid.name = 'astroid';
        astroid.setScale(0.4);

        this._platformManager.addCollider(astroid);
        this._scene.physics.add.overlap(astroid, this._colliders, function(astroid, object) {
            if (object.name === 'player') {
                (object as Player).hurt();
            }
        }.bind(this));
    }
}