import { JSDOM } from "jsdom";
import { BildrPlugin } from "../src/BildrPlugin";

export class myTestPlugin extends BildrPlugin {
    renderIsCalled: boolean = false;
    latestMessage(latestMessage: any) {
        throw new Error('Method not implemented.');
    }
    public testBrowser = new JSDOM(`<!DOCTYPE html>
    <head>
        <title>Bildr Studio Stub</title>
    </head>
    <body>
        <div name="bildr_canvas"></div>
    </body>
    </html>`);

    constructor(name: string, url: string) {
        super(name, url);
    }
    protected override get document(): Document {
        return this.testBrowser.window.document;
    }
    public override renderPage(): void {
        this.renderIsCalled = true;
        super.renderPage();
    }
}