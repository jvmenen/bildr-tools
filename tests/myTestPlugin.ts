import { JSDOM } from "jsdom";
import { BildrPlugin } from "../src/BildrPlugin";

export class myTestPlugin extends BildrPlugin {
    public testBrowser: JSDOM

    public renderIsCalled: boolean = false;
    public recentActionName: string = "";
    public recentActionData: any = {};

    constructor(name: string, url: string, browser: JSDOM) {
        super(name, url);
        this.testBrowser = browser;
    }

    protected override get document(): Document {
        return this.testBrowser.window.document;
    }

    public override renderPage(): void {
        this.renderIsCalled = true;
        super.renderPage();
    }

    public triggerActionShouldCallSuper = false
    public override triggerAction(actionName: string, actionData: any): void {
        this.recentActionData = actionData;
        this.recentActionName = actionName;
        if (this.triggerActionShouldCallSuper) return super.triggerAction(actionName, actionData)
    }

    public override get divElem(): HTMLDivElement {
        return super.divElem;
    }
}