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

export class BildrPlugin {
    private _name: string;
    private _pageUrl: string;
    private _frameId: string;
    private _divElem!: HTMLDivElement;
    private _divId: string;

    constructor(name: string, pageUrl: string) {
        this._name = name;
        this._pageUrl = pageUrl;
        this._divId = Math.random().toString(16).slice(2);
        this._frameId = Math.random().toString(16).slice(2);
    }

    public get name(): string {
        return this._name;
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
    public renderPage() {
        if (!this._divElem) {
            // CREATE plugin div/iframe
            let elem = this.document.createElement('div');
            elem.id = this._divId
            elem.style.cssText = "width:0px;height:100vh;top:0px;left:unset;right:-400px;bottom:unset;border:none;background:#ffffff;position: fixed;z-index: 100010;overflow: hidden;position:absolute;transition: right 300ms ease-in-out 0s;";
            elem.innerHTML = `<iframe id='${this._frameId}' src='${this._pageUrl}' style='all:unset;width:100%;height:100%'></iframe>`;
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

    public remove() {
        this.document.body.removeChild(this._divElem);
    }

}