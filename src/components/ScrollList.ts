import { Container, Application, Rectangle } from 'pixi.js';
import { ScrollItem } from './ScrollItem';

export class ScrollList extends Container {
    private app: Application;
    private items: ScrollItem[] = [];
    private gamesData: any[]; // Храним данные тут
    
    private itemWidth = 140;
    private itemHeight = 220;
    private spacing = 20;

    private isDragging = false;
    private startX = 0;
    private currentX = 0;
    
    private velocity = 0;
    private lastX = 0;
    private friction = 0.95;

        constructor(app: Application, gamesData: any[]) {
        super();
        this.app = app;
        this.gamesData = gamesData;
        
        this.createItems();
        this.setupInteractions();
        this.resize(window.innerWidth, window.innerHeight);

        this.app.ticker.add((ticker) => this.update(ticker.deltaTime));
    }

    private createItems() {
        this.gamesData.forEach((data, index) => {
            const item = new ScrollItem(index, this.itemWidth, this.itemHeight, data);
            this.addChild(item);
            this.items.push(item);
        });
        this.updateItemsPositions();
    }

    private updateItemsPositions() {
        this.items.forEach((item, index) => {
            item.x = this.currentX + index * (this.itemWidth + this.spacing);
            item.y = (window.innerHeight - this.itemHeight) / 2;
        });
    }

    private setupInteractions() {
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = new Rectangle(0, 0, window.innerWidth, window.innerHeight);

        this.app.stage.on('pointerdown', (e) => {
            this.isDragging = true;
            this.velocity = 0;
            this.startX = e.global.x - this.currentX;
            this.lastX = e.global.x;
        });

        this.app.stage.on('pointermove', (e) => {
            if (!this.isDragging) return;
            this.currentX = e.global.x - this.startX;
            this.velocity = e.global.x - this.lastX;
            this.lastX = e.global.x;
            this.updateItemsPositions();
        });

        this.app.stage.on('pointerup', () => this.isDragging = false);
        this.app.stage.on('pointerupoutside', () => this.isDragging = false);
        this.app.stage.on('pointercancel', () => this.isDragging = false);

        window.addEventListener('wheel', (e) => {
            if (typeof e.deltaY === 'number' && !isNaN(e.deltaY)) {
                this.velocity = -e.deltaY * 0.1; 
            }
        }, { passive: true });
    }

    private update(deltaTime: number) {
        if (this.isDragging) return;

        if (isNaN(this.velocity)) {
            this.velocity = 0;
            return;
        }

        if (Math.abs(this.velocity) > 0.05) {
            this.currentX += this.velocity * deltaTime;
            this.velocity *= Math.pow(this.friction, deltaTime);
            const prevX = this.currentX;
            this.clampCurrentX();
            if (this.currentX !== prevX) this.velocity = 0;
            this.updateItemsPositions();
        } else {
            this.velocity = 0;
        }
    }

    public resize(width: number, height: number) {
        if (this.app.stage.hitArea) {
            (this.app.stage.hitArea as Rectangle).width = width;
            (this.app.stage.hitArea as Rectangle).height = height;
        }
        this.clampCurrentX();
        this.updateItemsPositions();
    }

    private clampCurrentX() {
        const maxScroll = 50;
        const totalContentWidth = this.items.length * (this.itemWidth + this.spacing) - this.spacing;
        const minScroll = -(totalContentWidth - window.innerWidth + 50);
        if (this.currentX > maxScroll) this.currentX = maxScroll;
        else if (minScroll < 0 && this.currentX < minScroll) this.currentX = minScroll;
    }

    public drawAllItems() {
        this.items.forEach(item => item.draw());
    }
}