const DAMAGE_AMOUNT:number = 10;
const HURT_DURATION:number = 400;
const RECOVERY_DURATION:number = 1000;
const FUEL_USAGE:number = 0.5;
const FUEL_REGENERATION:number = .1;

export class Player extends Phaser.GameObjects.Sprite {
  body!: Phaser.Physics.Arcade.Body

  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _hurtTime = 0;
  private _jet:any;

  private _health:number = 100;
  private _fuel:number = 100;

  constructor(params) {
    super(params.scene, params.x, params.y, params.texture);
    this.name = 'player';
    this._cursors = this.scene.input.keyboard.createCursorKeys();
    this.createPlayerAnims();

    this.scene.physics.world.enable(this);
    this.body.setGravityY(1000);
    this.body.setSize(105, 154);
    this.body.setOffset(12, 102);
    this.scene.add.existing(this);
    this.setScale(0.7, 0.7);
    this.body.collideWorldBounds = true;

    let particles = this.scene.add.particles('particles');
    this._jet = particles.createEmitter(this.scene.cache.json.get('jetEmitter'));
    this._jet.stop();
    
    this.depth = 10;
    this.anims.play('jump');
  }


  public update(time:number, delta:number): void {
    if (this.handleHurt(delta) === false) { return; }
    this._jet.setPosition(this.x, this.y + 70);
    this.handleInput();
    this.handleAnimation();
  }

  public hurt() {
    if (this._hurtTime > 0) { return; }

    this._health -= DAMAGE_AMOUNT;
    this.scene.events.emit('setHealth', this._health);
    this._hurtTime = HURT_DURATION + RECOVERY_DURATION;
    this.anims.play('hurt');
    this.body.setVelocityX(-100);
    this.body.setVelocityY(-100);

    if (this._health <= 0) {
      this.scene.events.emit('playerDie');
    }
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
    if (this._cursors.right.isDown) {
      this.body.setVelocityX(300);
    } else if (this._cursors.left.isDown) {
      this.body.setVelocityX(-400);    
    } else {
      this.body.setVelocityX(-50);
    }
    if (this._cursors.up.isDown && this._fuel > 0) {
      this._jet.start();
      this.body.setVelocityY(-400);
      this._fuel -= FUEL_USAGE;
      this.scene.events.emit('setFuel', this._fuel); 
    } else {
      this._jet.stop();
      if (this._fuel < 100 && this.body.onFloor()) {
        this._fuel += FUEL_REGENERATION;
        this.scene.events.emit('setFuel', this._fuel); 
      }
    }
  }

  private handleAnimation() {
    if (this.body.onFloor() === false) {
      this.playAnim('jump');
    } else if (this.body.velocity.x > 0) {
      this.playAnim('run');
    } else if (this.body.velocity.x < -50) {
      this.playAnim('walk');
    } else {
      this.playAnim('jog');
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
