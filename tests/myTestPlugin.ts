import { JSDOM } from "jsdom";
import { BildrPlugin } from "../src/BildrPlugin";

export class myTestPlugin extends BildrPlugin {
    renderIsCalled: boolean = false;
    private _latestMessage : any;

    
    public testBrowser : JSDOM
    
    constructor(name: string, url: string, browser : JSDOM) {
        super(name, url);
        this.testBrowser = browser;
    }
    protected override get document(): Document {
        return this.testBrowser.window.document;
    }

    public latestMessage() {
        return this._latestMessage;
    }

    public override renderPage(): void {
        this.renderIsCalled = true;
        super.renderPage();
    }
    public override postMessage(data: any): void {
        this._latestMessage = data;
    }
}