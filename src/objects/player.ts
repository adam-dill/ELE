import { G } from '../g';

const DAMAGE_AMOUNT:number = 1;
const HURT_DURATION:number = 400;
const RECOVERY_DURATION:number = 1000;

export class Player extends Phaser.GameObjects.Sprite {
  body!: Phaser.Physics.Arcade.Body

  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  
  private _health:number = 3;
  private _jumpTime:number = 0;
  private _hurtTime:number = 0;

  public get autoRun():boolean { return this._autoRun; }
  public set autoRun(value:boolean) {
    this._autoRun = value;
  }
  private _autoRun:boolean = true;

  constructor(params) {
    super(params.scene, params.x, params.y, params.texture);
    if (params.autoRun !== undefined) { this.autoRun = params.autoRun; }
    this.name = 'player';
    
    //this._cursors = this.scene.input.keyboard.createCursorKeys();
    this._cursors = this.scene.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D});
    this.createPlayerAnims();
    

    this.scene.physics.world.enable(this);
    this.body.setGravityY(1000);
    this.body.setSize(105, 154);
    this.body.setOffset(12, 102);
    this.scene.add.existing(this);

    this.body.collideWorldBounds = this.autoRun;
    
    this.depth = 10;
    this.anims.play('jump');
  }

  public update(time:number, delta:number): void {
    if (this.handleHurt(delta) === false) { return; }
    this.handleInput();
    this.handleAnimation();
  }

  public hurt() {
    if (this._hurtTime > 0) { return; }

    if (G.hasSound) {
      this.scene.sound.play('playerHurt', {volume:0.7});
    }
    this._health -= DAMAGE_AMOUNT;
    this.scene.events.emit('setHealth', this._health);
    this._hurtTime = HURT_DURATION + RECOVERY_DURATION;
    this.anims.play('hurt');

    if (this._health <= 0) {
      this.scene.events.emit('playerDie');
    }
  }

  public heal() {
    if (this._health === 3) { return; }
    this._health += DAMAGE_AMOUNT;
    this.scene.events.emit('setHealth', this._health);
  }

  private handleHurt(delta:number) {
    if (this._hurtTime > 0) {
      this.alpha = 0.5;
      this._hurtTime -= delta;
      let elapsed = (HURT_DURATION + RECOVERY_DURATION) - this._hurtTime;
      if (elapsed < HURT_DURATION) {
        this.body.setVelocityY(-300);
        this.body.setVelocityX(-300);
        this.playAnim('hurt');
        return false; // prevent user control
      }
    } else {
      this.alpha = 1;
    }
    return true;
  }

  private handleInput(): void {
    let right:Boolean = this._cursors.right.isDown;
    let left:Boolean = this._cursors.left.isDown;
    let up:Boolean = this._cursors.up.isDown;
    
    var pointer = this.scene.input.activePointer;
    if (pointer.isDown) {
      var touchX = pointer.x;
      var touchY = pointer.y;
      if (touchX > this.x + 75) { right = true; }
      if (touchX < this.x - 75) { left = true; }
      if (touchY < this.y) { up = true; }
    }

    if (right) {
      this.body.setVelocityX(500);
    } else if (left) {
      this.body.setVelocityX(-500);    
    } else {
      this.body.setVelocityX((this.autoRun) ? -50 : 0);
    }
    if (this.body.onFloor()) {
      this._jumpTime = 0;
    }
    if (up) {
      if (this.body.onFloor()) {
        this._jumpTime = this.scene.game.getTime() + 350;
        if (G.hasSound) {
          this.scene.sound.play('playerJump', {volume:0.4});
        }
      }
    }
    if (this._jumpTime > this.scene.game.getTime()) {
      let diff = this._jumpTime - this.scene.game.getTime();
      this.body.setVelocityY(-100-diff);
    }
  }

  private handleAnimation() {
    if (this.body.onFloor() === false) {
      this.playAnim('jump');
    } else if (this.body.velocity.x > 0) {
      this.scaleX = 1;
      this.playAnim('run');
    } else if (this.body.velocity.x < -50) {
      if (this.autoRun) {
        this.scaleX = 1;
        this.playAnim('walk');
      } else {
        this.scaleX = -1;
        this.playAnim('run');
      }
    } else {
      this.playAnim((this.autoRun) ? 'jog' : 'idle');
    }
  }

  private playAnim(key:string) {
    if (this.anims.currentAnim.key !== key) {
      this.anims.play(key);
    }
  }

  private createPlayerAnims() {
    let frameNames = this.scene.anims.generateFrameNames(this.texture.key);
    this.scene.anims.create({
      key: 'jog',
      frames: [frameNames[9], frameNames[10]],
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'run',
      frames: [frameNames[9], frameNames[10]],
      frameRate: 15,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'walk',
      frames: [frameNames[9], frameNames[10]],
      frameRate: 7,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'jump',
      frames: [frameNames[5]],
      frameRate: 10,
      repeat: 1
    });
    this.scene.anims.create({
      key: 'duck',
      frames: [frameNames[2]],
      frameRate: 10,
      repeat: 1
    });
    this.scene.anims.create({
      key: 'idle',
      frames: [frameNames[6]],
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'hurt',
      frames: [frameNames[4]],
      frameRate: 10,
      repeat: -1
    });
  }
}
