import { GameObjects } from 'phaser';

export class Flag extends Phaser.GameObjects.Sprite {

    constructor(params) {
        super(params.scene, params.x, params.y, 'ingame');
        this.scene.add.existing(this);
        this.setScale(1);
        this.createAnims();
        this.play('wave');
    }

    private createAnims() {
        let frameNames = this.scene.anims.generateFrameNames(this.texture.key);
        this.scene.anims.create({
          key: 'wave',
          frames: [frameNames[0], frameNames[1]],
          frameRate: 5,
          repeat: -1
        });
        this.scene.anims.create({
          key: 'down',
          frames: [frameNames[2]],
          frameRate: 15,
          repeat: 1
        });
      }
}