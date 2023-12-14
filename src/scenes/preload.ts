import * as Phaser from 'phaser';

export default class Loading extends Phaser.Scene
{
    constructor ()
    {
        super({key: 'loading'});
    }

    preload ()
    {
        console.log("click preload")
        this.load.setPath('assets/images')
        this.load.image('logo', 'loading.png');
        this.load.image('libs', 'loading.png');
        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create ()
    {
        console.log("click create")
        this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        this.add.shader('Plasma', 100, 412, 800, 172).setOrigin(0);

        this.add.image(400, 300, 'libs');

        const logo = this.add.image(400, 70, 'logo');

        this.tweens.add({
            targets: logo,
            y: 350,
            duration: 5500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    width: 2800,
    height: 2600,
    scene: Loading
};

const game = new Phaser.Game(config);