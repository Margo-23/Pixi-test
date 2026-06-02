import { Application, Assets } from 'pixi.js';
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

        const gamesData: any[] = [];
        Array.from({ length: 20 }).forEach((_, index) => {
            const idNum = index + 1;
            gamesData.push({
                id: String(idNum),
                title: `Title`,
                image: `https://picsum.photos/id/${idNum}/200/300.jpg`,
                url: `https://picsum.photos/id/${idNum}/200/300`
            });
        });

        const imageUrls = gamesData.map(game => game.image);
        
        await Assets.load(imageUrls); 

        this.scrollList = new ScrollList(this.app, gamesData);
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