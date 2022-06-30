import { JSDOM } from "jsdom";
import { BildrPluginRightSide } from '../../src/plugin/BildrPluginRightSide';

export class myTestPlugin extends BildrPluginRightSide {
    public testBrowser: JSDOM

    public renderIsCalled: boolean = false;
    public recentActionName: string = "";
    public recentActionData: any = {};
    public recentOutgoingMessageMsgId: string = "";
    public recentOutgoingMessageData: any = {};

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

    public override sendOutgoingMessage(msgId: string, data: any): void {
        this.recentOutgoingMessageMsgId = msgId;
        this.recentOutgoingMessageData = data;
    }
}