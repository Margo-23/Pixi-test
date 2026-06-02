import { Container, Graphics, Text, Sprite, Assets } from 'pixi.js'; 

export class ScrollItem extends Container {
    private bg: Graphics;
    private w: number;
    private h: number;
    private gameData: any;

    constructor(index: number, width: number, height: number, data: any) {
        super();
        this.w = width;
        this.h = height;
        this.gameData = data;

        this.bg = new Graphics();
        this.addChild(this.bg);

        const imageMask = new Graphics();
        imageMask
            .roundRect(0, 0, this.w, this.h, 16) 
            .fill({ color: 0xffffff });        
        this.addChild(imageMask);

        const texture = Assets.get(data.image);

        const sprite = new Sprite(texture);
        sprite.width = this.w;
        sprite.height = this.h;

        sprite.mask = imageMask; 

        this.addChild(sprite);

        this.eventMode = 'passive';

        const label = new Text({
            text: data.title + index,
            style: { fill: 0xffffff, fontSize: 18, fontWeight: 'bold' },
        });
        label.anchor.set(0.5);
        label.x = width / 2;
        label.y = height - 30;

        label.eventMode = 'static';
        label.cursor = 'pointer';

        label.on('pointertap', () => {
            window.open(this.gameData.url, '_blank');
        });

        this.addChild(label);
        this.draw();
    }

    public draw() {
        this.bg.clear();
        this.bg
            .roundRect(0, 0, this.w, this.h, 16)
            .fill({ color: 0x333333 });
    }
}