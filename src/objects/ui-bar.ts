import { Scene, GameObjects } from "phaser";

export class UIBar {

    private _base:GameObjects.Graphics;
    private _bar:GameObjects.Graphics;

    public get scene():Scene { return this._scene;}
    public set scene(value:Scene) {
        this._scene = value;
        this.draw();
    }
    private _scene:Scene;

    public get color():number { return this._color; }
    public set color(value:number) {
        this._color = value;
        this.draw();
    }
    private _color:number;

    public get baseColor():number { return this._baseColor; }
    public set baseColor(value:number) {
        this._baseColor = value;
        this.draw();
    }
    private _baseColor:number;

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

    public get width():number { return this._width; }
    public set width(value:number) {
        this._width = value;
        this.draw();
    }
    private _width:number = 0;

    public get height():number { return this._height; }
    public set height(value:number) {
        this._height = value;
        this.draw();
    }
    private _height:number = 0;

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



    constructor(props:object) {
        for (let key in props) {
            this[key] = props[key];
        }   
        this._base = this.scene.add.graphics();
        this._bar = this.scene.add.graphics();
        this.draw();
    }

    public draw() {
        if (this._base === undefined || this._bar === undefined) {
            return;
        }
        var valuePercent = this.value / this.maxValue;
        var newWidth = this.width * valuePercent;
        this._base.clear();
        this._base.fillStyle(this._baseColor, 1).fillRect(this.x, this.y, this.width, this.height);

        this._bar.clear();
        this._bar.fillStyle(this._color, 1).fillRect(this.x, this.y, newWidth, this.height);
    }
}