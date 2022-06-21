import { BildrPlugin } from "./BildrPlugin";

export class BildrPluginManager {
    static _instance = new BildrPluginManager()

    private _registeredPlugins: BildrPlugin[] = [];

    constructor() { }
    
    public register(plugin: BildrPlugin) {
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
        if (!e.data) return;

        let dataJson = JSON.parse(e.data) as BildrPluginData;

        let plugin = this._registeredPlugins.find(item => dataJson.pluginName && item.name == dataJson.pluginName);

        if (plugin == undefined) return;

        if (dataJson.data == undefined) dataJson.data = {};
        dataJson.data.msgId = dataJson.msgId;

        plugin.triggerAction(dataJson.command, dataJson.data);
    }

    // STATIC FUNCTIONS
    static remove(pluginName: string) {
        this._instance.remove(pluginName)
    }

    static isRegistered(pluginName: string): boolean {
        return this._instance.isRegistered(pluginName)
    }

    static register(plugin: BildrPlugin) {
        this._instance.register(plugin)
    }
}

type BildrPluginData = {
    pluginName: string,
    command: string,
    msgId: string,
    data: any
}

