import { Container, Graphics, Text } from 'pixi.js';

export class ScrollItem extends Container {
    private bg: Graphics;
    private w: number;
    private h: number;

    constructor(index: number, width: number, height: number) {
        super();
        this.w = width;
        this.h = height;

        this.bg = new Graphics();
        this.addChild(this.bg);

        const label = new Text({
            text: String(index + 1),
            style: { fill: 0xffffff, fontSize: 32, fontWeight: 'bold' },
        });
        label.anchor.set(0.5);
        label.x = width / 2;
        label.y = height / 2;
        this.addChild(label);

        this.eventMode = 'none';
        this.draw();
    }

    public draw() {
        this.bg.clear();
        this.bg
            .roundRect(0, 0, this.w, this.h, 16) 
        .fill({ color: 0x555555 });
    }
}
