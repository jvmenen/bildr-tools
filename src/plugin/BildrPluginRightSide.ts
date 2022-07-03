import { BildrPluginAction } from "./BildrPluginAction";
import { SimplePluginAction } from "./SimplePluginAction";

/**
 * @public
 */
export class BildrPluginRightSide {
    protected _name: string;
    protected _pageUrl: string;
    protected _frameId: string;
    protected _divElem!: HTMLDivElement;
    protected _divId: string;
    protected _actions: BildrPluginAction[] = []

    constructor(name: string, pageUrl: string) {
        this._name = name;
        this._pageUrl = pageUrl;
        this._divId = Math.random().toString(16).slice(2);
        this._frameId = Math.random().toString(16).slice(2);
    }

    public get name(): string {
        return this._name;
    }

    public isSameDivElem(divElem: HTMLElement) {
        return this._divElem === divElem;
    }

    protected get divElem(): HTMLDivElement {
        return this._divElem;
    }

    protected sendOutgoingMessage(msgId: string, result: any) {
        // if sendOutgoingMessage is passed as function reference _frameId migth not be
        // set, so we check for it to help debugging the issue (locking the Studio)
        if (this._frameId == undefined || this._frameId == null || this._frameId == "") {
            throw new Error("this._frameId should be set in the context of sendOutgoingMessage");
        }
        var window = (document.getElementById(this._frameId) as HTMLIFrameElement).contentWindow;
        window!.postMessage({
            "msgId": msgId,
            "result": result
        }, "*");
    }

    public triggerAction(actionName: string, actionData: any) {
        if (actionData.uMsgId == undefined || actionData.uMsgId == null || actionData.uMsgId == "") {
            throw new Error("uMsgId should be set on argument actionData");
        }

        let action = this._actions.find(item => item.name == actionName)
        if (action == undefined) {
            throw new Error(`Unknown action '${actionName}' on plugin '${this.name}'`);
        }
        let result = action.execFunc(actionData)
        if (result) {
            this.sendOutgoingMessage(actionData.uMsgId, result)
        }
        return result;
    }

    public hide() {
        this._divElem.style.right = "-400px";
    }

    public show() {
        this._divElem.style.width = '400px';
        this._divElem.style.right = '0px';
    }

    toggleVisibility() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    public get isVisible() {
        return this._divElem.style.right == '0px';
    }

    protected get document(): Document {
        return window.document;
    }

    public renderPage(): void {
        if (!this._divElem) {
            // CREATE plugin div/iframe
            let elem = this.document.createElement('div');
            elem.id = this._divId;
            elem.style.cssText = "width:0px;height:100vh;top:0px;left:unset;right:-400px;bottom:unset;border:none;background:#ffffff;position: fixed;z-index: 100010;overflow: hidden;position:absolute;transition: right 300ms ease-in-out 0s;";
            elem.innerHTML = `<iframe id='${this._frameId}' src='${this.pageUrl}' style='all:unset;width:100%;height:100%'></iframe>`;
            // add to document (right side)
            this.document.body.appendChild(elem);

            // Animation end handler
            elem.addEventListener('transitionend', _e => {
                // when the animation is finished, "hide" it when out of view
                // prevents UI issues when the Studio canvas is scaled
                if (elem.style.right != '0px') { elem.style.width = '0px'; }
            });

            this._divElem = elem;
        }
    }

    public get pageUrl(): string {
        return this._pageUrl;
    }

    public remove(): void {
        this.document.body.removeChild(this._divElem);
    }

    public addActionObject(action: BildrPluginAction): void {
        this._actions.push(action)
    }

    public addAction(actionName: string, execFnc: Function): void {
        this.addActionObject(new SimplePluginAction(actionName, execFnc));
    }
}
