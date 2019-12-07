import { Scene, GameObjects } from "phaser";
import { Flag } from "../objects/flag";


export class InGameMananger {
    private _scene:Scene;
    private _flags:Array<Flag> = new Array<Flag>();

    /**
     * The speed to move the background.
     */
    public set speed(value:number) {
        this._speed = value;
    }
    private _speed:number = 0;

    constructor(scene:Scene) {
        this._scene = scene;
    }

    public spawnFlag(distance:number, color:string = 'Green') {
        
        let flag = new Flag({scene: this._scene, color: color, text:distance.toString()});

        let x = this._scene.cameras.main.width;
        let y = this._scene.cameras.main.height;
        flag.x = x + (flag.width / 2);
        flag.y = y - 128; // TODO: clean up magic number

        this._flags.push(flag);
    }

    update(time:number, delta:number) {
        let toDestroy = [];
        this._flags.forEach((value, index) => {
            value.x -= this._speed;
            value.moveText();
            if (value.x < -value.width) {
                toDestroy.push(index);
            }
        });
        toDestroy.forEach((index) => {
            this._flags[index].destroy();
            this._flags.splice(index, 1);
        });
    }
}