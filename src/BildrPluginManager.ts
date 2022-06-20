import { BildrPlugin } from "./BildrPlugin";

export class BildrPluginManager {
    static remove(pluginName: string) {
        let plugin = this.registeredPlugins.find(item => item.name == pluginName)
        if (plugin != undefined) {
            plugin.remove();
            this.registeredPlugins.forEach((item, index) => {
                if (item === plugin) this.registeredPlugins.splice(index, 1);
            });
        }
    }
    static MockWindow: Window & typeof globalThis;

    static isRegistered(pluginName: string): boolean {
        return this.registeredPlugins.find(item => item.name == pluginName) != undefined
    }

    static getWindow() {
        return BildrPluginManager.MockWindow ?? window;
    }

    static registeredPlugins: BildrPlugin[] = [];

    static register(plugin: BildrPlugin) {
        if (plugin.name == undefined || plugin.name == null || plugin.name.trim().length == 0) {
            throw new Error("Name is required to register a plugin.");
        }

        if (BildrPluginManager.isRegistered(plugin.name)) {
            throw new Error(`Plugin with name '${plugin.name}' already registered. Name needs to be unique.`);
        }

        if (BildrPluginManager.registeredPlugins.length == 0) {
            // Start listening for messages from iFrame/Bildr Marketplace
            // BildrPluginManager.getWindow.addEventListener("message", e => {
            //     if (e) {

            //         Marketplace.handleMessage(e.data);
            //     }
            // });
        }

        this.registeredPlugins.push(plugin)
        plugin.renderPage();

    }
}

