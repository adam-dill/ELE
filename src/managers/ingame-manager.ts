import { Scene, GameObjects } from "phaser";
import { Flag } from "../objects/flag";

export class InGameMananger {
    private _scene:Scene;
    private _items:Array<GameObjects.Image> = new Array<GameObjects.Image>();

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

    public spawnFlag() {
        let flag = new Flag({scene: this._scene});

        let x = this._scene.cameras.main.width;
        let y = this._scene.cameras.main.height;
        flag.x = x + (flag.width / 2);
        flag.y = y - 128; // TODO: clean up magic number

        this._items.push(flag);
    }

    update(time:number, delta:number) {
        let toDestroy = [];
        this._items.forEach((value, index) => {
            value.x -= this._speed;
            if (value.x < -value.width) {
                toDestroy.push(index);
            }
        });
        toDestroy.forEach((index) => {
            this._items[index].destroy();
            this._items.splice(index, 1);
        });
    }
}