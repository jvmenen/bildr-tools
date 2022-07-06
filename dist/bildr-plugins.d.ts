/**
 * @public
 */
export declare type BildrPluginAction = {
    get name(): string;
    execFunc(args: any): any;
};

export declare function initPluginManagerUI(): void;

/**
 * @public
 */
export declare class manager {
    static _instance: manager;
    private _registeredPlugins;
    constructor();
    register(plugin: PluginBase): void;
    isRegistered(pluginName: string): boolean;
    showPlugin(pluginName: string): void;
    remove(pluginName: string): void;
    protected get window(): {
        addEventListener: (eventName: string, eventHandlerFunction: (e: any) => void) => void;
    };
    private startListeningForMessagesFromIFrame;
    private triggerActionInPlugin;
    getVisiblePlugins(): PluginBase[];
    static getInstance(): manager;
    static remove(pluginName: string): void;
    static isRegistered(pluginName: string): boolean;
    static register(plugin: PluginBase): void;
    static getVisiblePlugins(): PluginBase[];
    static showPlugin(pluginName: string): void;
}

/**
 * @public
 */
export declare class PluginBase {
    protected _name: string;
    protected _pageUrl: string;
    protected _frameId: string;
    protected _divElem: HTMLDivElement;
    protected _divId: string;
    protected _actions: BildrPluginAction[];
    constructor(name: string, pageUrl: string);
    get name(): string;
    isSameDivElem(divElem: HTMLElement): boolean;
    protected get divElem(): HTMLDivElement;
    protected sendOutgoingMessage(msgId: string, result: any): void;
    triggerAction(actionName: string, actionData: any): any;
    hide(): void;
    show(): void;
    toggleVisibility(): void;
    get isVisible(): boolean;
    protected get document(): Document;
    renderPage(): void;
    get pageUrl(): string;
    remove(): void;
    addActionObject(action: BildrPluginAction): void;
    addAction(actionName: string, execFnc: Function): void;
}

export declare class PluginLeftSide extends PluginBase {
    constructor(name: string, pageUrl: string);
    renderPage(): void;
    hide(): void;
    show(): void;
    get isVisible(): boolean;
}

export declare class SimplePluginAction implements BildrPluginAction {
    private _name;
    private _execFunc;
    constructor(actionName: string, execFunc: Function);
    get name(): string;
    execFunc(args: any): any;
}

export { }
