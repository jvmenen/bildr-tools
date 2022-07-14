import { BildrPluginData } from "./BildrPluginData";
import { BildrPluginRightSide } from "./BildrPluginRightSide";

/**
 * @public
 */
export class BildrPluginManager {
    static _instance: BildrPluginManager;

    private _registeredPlugins: BildrPluginRightSide[] = [];

    constructor() { }

    public register(plugin: BildrPluginRightSide) {
        if (plugin.name == undefined || plugin.name == null || plugin.name.trim().length == 0) {
            throw new Error("Name is required to register a plugin.");
        }
        if (BildrPluginManager.isRegistered(plugin.name)) {
            throw new Error(`Plugin with name '${plugin.name}' already registered. Name needs to be unique.`);
        }

        this.startListeningForMessagesFromIFrame();

        this._registeredPlugins.push(plugin)
        plugin.renderPage();
    }

    public isRegistered(pluginName: string): boolean {
        return this._registeredPlugins.find(item => item.name == pluginName) != undefined
    }

    public showPlugin(pluginName: string) {
        let plugin = this._registeredPlugins.find(item => item.name == pluginName)
        if (plugin != undefined) {
            plugin.show();
        }
    }
    public remove(pluginName: string) {
        let plugin = this._registeredPlugins.find(item => item.name == pluginName)
        if (plugin != undefined) {
            plugin.remove();
            this._registeredPlugins.forEach((item, index) => {
                if (item === plugin) this._registeredPlugins.splice(index, 1);
            });
        }
    }

    protected get window(): { addEventListener: (eventName: string, eventHandlerFunction: (e: any) => void) => void; } {
        return window;
    }

    private startListeningForMessagesFromIFrame() {

        if (this._registeredPlugins.length != 0) return;

        this.window.addEventListener("message", e => {
            this.triggerActionInPlugin(e);
        });
    }

    private triggerActionInPlugin(e: any) {
        if (!e.data) throw new Error("e.data property is missing.");

        let dataJson = e.data as BildrPluginData;
        if (!dataJson.pluginName) throw new Error("Required property e.data.pluginName is missing.");
        if (!dataJson.command) throw new Error("Required property e.data.command is missing.");
        if (!dataJson.uMsgId) throw new Error("Required property e.data.uMsgId is missing.");

        let plugin = this._registeredPlugins.find(item => dataJson.pluginName && item.name == dataJson.pluginName);

        if (plugin == undefined) {
            throw new Error(`Plugin with name '${dataJson.pluginName}' is not registered.`);
        };

        if (dataJson.data === undefined || dataJson.data === null || dataJson.data === "") dataJson.data = {};
        dataJson.data.uMsgId = dataJson.uMsgId;

        plugin.triggerAction(dataJson.command, dataJson.data);
    }

    public getVisiblePlugins() {
        return this._registeredPlugins.filter(item => item.isVisible)
    }

    // STATIC FUNCTIONS
    static getInstance(): BildrPluginManager {
        if (this._instance == undefined) {
            this._instance = new BildrPluginManager()
        }
        return this._instance
    }
    static remove(pluginName: string) {
        this.getInstance().remove(pluginName)
    }

    static isRegistered(pluginName: string): boolean {
        return this.getInstance().isRegistered(pluginName)
    }

    static register(plugin: BildrPluginRightSide) {
        this.getInstance().register(plugin)
    }

    static getVisiblePlugins() {
        return this.getInstance().getVisiblePlugins();
    }

    static showPlugin(pluginName: string) {
        this.getInstance().showPlugin(pluginName)
    }

}

