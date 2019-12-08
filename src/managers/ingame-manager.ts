import { Scene, GameObjects, Physics } from "phaser";
import { Flag } from "../objects/flag";
import { HealthDrop } from "../objects/health-drop";
import { Player } from "../objects/player";
import { G } from "../g";


export class InGameMananger {
    private _scene:Scene;
    private _player:Player;
    private _flags:Array<Flag> = new Array<Flag>();
    private _drops:Array<HealthDrop> = new Array<HealthDrop>();

    private _nextHealthDrop:number = 0;

    /**
     * The speed to move the background.
     */
    public set speed(value:number) {
        this._speed = value;
    }
    private _speed:number = 0;

    constructor(scene:Scene, player:Player) {
        this._scene = scene;
        this._player = player;
    }

    public spawnFlag(distance:number, color:string = 'Green') {
        let flag = new Flag({scene: this._scene, color: color, text:distance.toString()});

        let x = this._scene.cameras.main.width;
        let y = this._scene.cameras.main.height;
        flag.x = x + (flag.width / 2);
        flag.y = y - 128; // TODO: clean up magic number

        this._flags.push(flag);
    }

    public spawnHealth() {
        let drop = new HealthDrop({
            scene: this._scene,
            x: Phaser.Math.Between(100, this._scene.cameras.main.width),
            y: -100,
            texture:'ingame',
        });
        this._scene.physics.add.overlap(this._player, drop, (player:Player, drop:HealthDrop) => {
            let index = this._drops.indexOf(drop);
            this._drops.splice(index, 1);
            if (G.hasSound) {
                this._scene.sound.play('healthPickup');
            }
            player.heal();
            drop.destroy();
        });
        this._drops.push(drop);
    }

    update(time:number, delta:number) {
        console.log(time);
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

        toDestroy = [];
        this._drops.forEach((value, index) => {
            value.setVelocityY(200);
            if (value.y > this._scene.cameras.main.height) {
                toDestroy.push(index);
            }
        });
        toDestroy.forEach((index) => {
            this._drops[index].destroy();
            this._drops.splice(index, 1);
        });

        if (this._nextHealthDrop === 0) {
            this._nextHealthDrop = this.generateHealthDropTime(time);
        } else if (time > this._nextHealthDrop) {
            this._nextHealthDrop = this.generateHealthDropTime(time);
            this.spawnHealth();
        }
    }


    private generateHealthDropTime(time:number) {
        return time + Phaser.Math.Between(10000, 30000);
    }
}