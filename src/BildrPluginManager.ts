import { BildrPlugin } from "./BildrPlugin";

export class BildrPluginManager {
    static _instance = new BildrPluginManager()

    private _registeredPlugins: BildrPlugin[] = [];

    constructor() { }

    public remove(pluginName: string) {
        let plugin = this._registeredPlugins.find(item => item.name == pluginName)
        if (plugin != undefined) {
            plugin.remove();
            this._registeredPlugins.forEach((item, index) => {
                if (item === plugin) this._registeredPlugins.splice(index, 1);
            });
        }
    }
    public isRegistered(pluginName: string): boolean {
        return this._registeredPlugins.find(item => item.name == pluginName) != undefined
    }

    protected get window(): { addEventListener: (eventName: string, eventHandlerFunction: (e: any) => void) => void; } {
        return window;
    }

    public register(plugin: BildrPlugin) {
        if (plugin.name == undefined || plugin.name == null || plugin.name.trim().length == 0) {
            throw new Error("Name is required to register a plugin.");
        }

        if (BildrPluginManager.isRegistered(plugin.name)) {
            throw new Error(`Plugin with name '${plugin.name}' already registered. Name needs to be unique.`);
        }
        if (this._registeredPlugins.length == 0) {
            // Start listening for messages from iFrame/Bildr Marketplace
            this.window.addEventListener("message", e => {
                if (e.data) {
                    let dataJson = JSON.parse(e.data);
                    if (dataJson.pluginName) {
                        this._registeredPlugins.forEach(plugin => {
                            if (plugin.name == dataJson.pluginName) {
                                plugin.postMessage(dataJson)
                            }
                        })
                    }
                }
            });
        }

        this._registeredPlugins.push(plugin)
        plugin.renderPage();

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

