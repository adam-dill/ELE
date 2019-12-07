import { GameObjects } from 'phaser';
import { ImageText } from './image-text';
import { Http2ServerRequest } from 'http2';

export class Flag extends Phaser.GameObjects.Sprite {

    private _imageText:ImageText;

    public get color():string { return this._color; }
    public set color(value:string) {
      this._color = value[0].toUpperCase() + value.slice(1);
    }
    private _color:string = 'Green';


    public get text():string { return this._imageText.text; }
    public set text(value:string) {
      if (this._imageText) {
        this._imageText.text = value;
      }
    }

    public moveText() {
      this._imageText.x = this.x + 100;// - this._imageText.width - 50;
      this._imageText.y = this.y;
    }

    constructor(params) {
        super(params.scene, params.x, params.y, 'ingame');
        if (params.color) { this.color = params.color; }
        if (params.text) { this.text = params.text; }

        this.scene.add.existing(this);
        this.setScale(-1, 1);
        this.createAnims();
        this.play('wave');

        let textMap = {}
        for (let i=0; i<10; i++) {
          textMap[i.toString()] = 'hud'+i+'.png';
        }
        this._imageText = new ImageText(this.scene, 'ingame', textMap);
        this._imageText.x = this.x;
        this._imageText.y = this.y;
        this._imageText.text = params.text;
    }

    destroy() {
      this._imageText.destroy();
      super.destroy();
    }

    private createAnims() {
      let frameNames = this.scene.anims.generateFrameNames(this.texture.key);
      let waveFrames = frameNames.filter((value) => value.frame === 'flag'+this.color+'1.png' || value.frame === 'flag'+this.color+'2.png')
      let downFrames = frameNames.filter((value) => value.frame === 'flag'+this.color+'_down.png');
      this.scene.anims.create({
        key: 'wave',
        frames: waveFrames,
        frameRate: 5,
        repeat: -1
      });
      this.scene.anims.create({
        key: 'down',
        frames: downFrames,
        frameRate: 15,
        repeat: 1
      });
    }
}