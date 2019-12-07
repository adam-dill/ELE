import { GameObjects, Scene } from "phaser";

export class ImageText {
    private _scene:Scene;
    private _texture:string;
    private _map:object;
    private _sprites:Array<GameObjects.Image> = new Array<GameObjects.Image>();

    public get text():string { return this._text; }
    public set text(value:string) {
        if (value !== this._text) {
            this._text = value;
            this.draw();
        }
        
    }
    private _text:string = '';


    public get x():number { return this._x; }
    public set x(value:number) {
        this._x = value;
        this.position();
    }
    private _x:number = 0;

    public get y():number { return this._y; }
    public set y(value:number) {
        this._y = value;
        this.position();
    }
    private _y:number = 0;


    public get width():number {
        let returnValue = 0;
        this._sprites.forEach((value, index) => {
            returnValue += value.width/2;
        });
        return returnValue;
    }

    constructor(scene:Scene, texture:string, map:object) {
        this._scene = scene;
        this._texture = texture;
        this._map = map;
    }

    public draw():void {
        this.clear();
        let arr = this.text.split('');
        arr.forEach((value) => {
            if (this._map[value] !== undefined) {
                this._sprites.push(this._scene.add.image(0, 0, this._texture, this._map[value]));
            }
        });
        this.position();
    }

    public clear():void {
        this._sprites.forEach((value) => value.destroy());
        this._sprites.splice(0);
    }

    public destroy() {
        this.clear();
    }

    private position():void {
        this._sprites.forEach((value, index) => {
            value.y = this.y;
            value.x = this.x + (value.width/2 * index);
        });
    }
}