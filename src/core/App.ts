import { Application } from 'pixi.js';
import { ScrollList } from '../components/ScrollList';

export class GameApp {
    private app!: Application;
    private scrollList!: ScrollList;

    constructor() {
        this.init();
    }

private async init() {
        this.app = new Application();
        
        await this.app.init({
            resizeTo: window,
            backgroundColor: 0xE0E0E0,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        document.body.appendChild(this.app.canvas);

        this.scrollList = new ScrollList(this.app);
        this.app.stage.addChild(this.scrollList); 
        this.scrollList.drawAllItems(); 

        this.app.render(); 

        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('pointerdown', () => this.enableFullscreen(), { once: true });
    }

    private onResize() {
        if (this.scrollList) {
            this.scrollList.resize(window.innerWidth, window.innerHeight);
        }
    }

    private enableFullscreen() {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    }
}