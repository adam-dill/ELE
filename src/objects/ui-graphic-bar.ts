import { Scene, GameObjects } from "phaser";

export class UIGraphicBar {

    public get scene():Scene { return this._scene;}
    public set scene(value:Scene) {
        this._scene = value;
        this.draw();
    }
    private _scene:Scene;

    public get texture():string { return this._texture; }
    public set texture(value:string) {
        this._texture = value;
        this.draw();
    }
    private _texture:string;

    public get emptyImage():string { return this._emptyImage; }
    public set emptyImage(value:string) {
        this._emptyImage = value;
        this.draw();
    }
    private _emptyImage:string;

    public get fullImage():string { return this._fullImage; }
    public set fullImage(value:string) {
        this._fullImage = value;
        this.draw();
    }
    private _fullImage:string;

    public get value():number { return this._value; }
    public set value(value:number) {
        this._value = value;
        this.draw();
    }
    private _value:number = 0;

    public get maxValue():number { return this._maxValue; }
    public set maxValue(value:number) {
        this._maxValue = value;
        this.draw();
    }
    private _maxValue:number = 0;

    public get x():number { return this._x; }
    public set x(value:number) {
        this._x = value;
        this.draw();
    }
    private _x:number = 0;

    public get y():number { return this._y; }
    public set y(value:number) {
        this._y = value;
        this.draw();
    }
    private _y:number = 0;

    public get height():number { return this._height; }
    public set height(value:number) {
        this._height = value;
        this.draw();
    }
    private _height:number = 0;

    private _images:Array<GameObjects.Image> = new Array<GameObjects.Image>();

    constructor(props:object) {
        for (let key in props) {
            this[key] = props[key];
        }
        this.draw();
    }

    public draw() {
        this.clear();
        let currentX:number = 0;
        for (let i=1; i <= this.maxValue; i++) {
            let frame = (i > this.value) ? this.emptyImage : this.fullImage;
            let image = this._scene.add.image(this.x + currentX, this.y, this.texture, frame);
            let scale = this.height / image.height;
            image.setScale(scale);
            currentX += image.width*image.scale;
            this._images.push(image);
        }
    }

    private clear() {
        this._images.forEach((value) => value.destroy());
        this._images.splice(0);
    }

}