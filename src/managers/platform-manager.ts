import { Scene, GameObjects } from "phaser";
import { Player } from '../objects/player';

const TILE_SIZE:number = 128;

export class PlatformManager {

    _scene:Scene;
    _platforms:Array<GameObjects.Sprite> = new Array<GameObjects.Sprite>();


    /**
     * The speed to move the background.
     */
    public set speed(value:number) {
        this._speed = value;
    }
    private _speed:number = 0;


    constructor(scene:Scene) {
        this._scene = scene;
        this.createPlatforms();
    }

    public update(time:number, delta:number) {
        this.move(-this._speed);
    }

    public addCollider(object:GameObjects.GameObject) {
        this._scene.physics.add.collider(object, this._platforms, function(object, ground) {
            (object.body as Phaser.Physics.Arcade.Body).blocked.down = true;
            if (object.name === 'player' && ground.name === 'lava') {
                (object as Player).hurt();
            }
            if (object.name === 'astroid') {
                object.destroy();
                (ground as GameObjects.Sprite).setFrame('lavaTop_high.png');
                ground.name = 'lava';
                this._scene.cameras.main.shake(500, 0.01);
                this._scene.cameras.main.flash(250);
            }
          }.bind(this));
    }

    private move(move:number) {
        if (this._platforms.length === 0) { return; }

        let cameraWidth:number = this._scene.cameras.default.width;
        this._platforms.forEach(function(entry:GameObjects.Sprite) {
            entry.x += move;
        }.bind(this));
        let first = this._platforms[0]
        let last = this._platforms[this._platforms.length-1];
        if (last.x > cameraWidth + TILE_SIZE) {
            last.x = first.x - TILE_SIZE;
            this._platforms.unshift(this._platforms.pop());
            last.setFrame('planetMid.png');
            last.name = undefined;
        } else if (first.x < -TILE_SIZE) {
            first.x = last.x + TILE_SIZE;
            this._platforms.push(this._platforms.shift());
            first.setFrame('planetMid.png');
            last.name = undefined;
        }
    }

    private createPlatforms() {
        let start:number = -TILE_SIZE * 2;
        let currentX:number = start;
        let camera = this._scene.cameras.main;
        while (currentX < camera.width + TILE_SIZE*2) {
            let sprite = this._scene.physics.add.sprite(currentX, camera.width, 'ground', 'planetMid.png');
            let body:Phaser.Physics.Arcade.Body = sprite.body as Phaser.Physics.Arcade.Body; 
            body.allowGravity = false;
            body.immovable = true;
            sprite.setPosition(currentX, camera.height);
            sprite.setSize(TILE_SIZE, TILE_SIZE);
            this._platforms.push(sprite);
            currentX += TILE_SIZE;
        }
    }
}