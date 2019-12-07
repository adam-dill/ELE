import { GameObjects } from "phaser";

export class HealthDrop extends Phaser.Physics.Arcade.Sprite {

    constructor(params) {
        super(params.scene, params.x, params.y, 'ingame');
        this.createAnims();
        this.play('play');
        this.setScale(0.7);
        this.scene.add.existing(this); 
        this.scene.physics.world.enable(this);
    }

    private createAnims() {
        let frameNames = this.scene.anims.generateFrameNames(this.texture.key);
        let animFrames = frameNames.filter((value) => value.frame === 'hudHeart_empty.png' || value.frame === 'hudHeart_half.png' || value.frame === 'hudHeart_full.png')
        this.scene.anims.create({
            key: 'play',
            frames: animFrames,
            frameRate: 3,
            repeat: -1
        });
    }
}