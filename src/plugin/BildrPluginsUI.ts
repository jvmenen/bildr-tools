import { BildrPluginLeftSide } from "./BildrPluginLeftSide";
import { BildrPluginManager } from "./BildrPluginManager";

declare var WEBPACKDEFINE_PRODUCTION: boolean

class BildrPluginsUI extends BildrPluginLeftSide {

    constructor() {
        let scriptUrl = ""
        if (WEBPACKDEFINE_PRODUCTION) {
            scriptUrl = "https://communityplugins.bildr.com/";
        }
        else {
            scriptUrl = "https://p1a6bee8b69e94699b5845bcfc8906d9b.bildr.com/"
        }

        super("BildrPluginsUI", scriptUrl)
        this.addAction("hidePlugin", () => { this.hide() });
        this.addActionObject(new LoadPluginScriptAction(document));
    }

}

class LoadPluginScriptAction {
    private _document: Document;

    constructor(document: Document) {
        this._document = document
    }

    get name() {
        return "loadPluginScript"
    };

    execFunc(args: any) {
        // Hide the visible plugin(s) (except me=BildrPluginsUI)
        BildrPluginManager.getVisiblePlugins().forEach(plugin => {
            if (plugin.name != "BildrPluginsUI") {
                plugin.hide();
            }
        });
        if (!BildrPluginManager.isRegistered(args.pluginName)) {
            var script = this._document.createElement("script");
            script.src = args.src;
            script.onload = () => {
                BildrPluginManager.showPlugin(args.pluginName);
            };
            this._document.head.appendChild(script);
        } else {
            BildrPluginManager.showPlugin(args.pluginName)
        }

    }
}

class PluginToolBarButton {
    static pluginsMenuItemDivId = "bildrPluginsMenuItem";
    static sideMenuBarDivCss = "css_23071.css_23052";

    static isSideBarAvailable() {
        return document.querySelector(`.${PluginToolBarButton.sideMenuBarDivCss}`);
    }

    static create() {
        if (!document.getElementById(PluginToolBarButton.pluginsMenuItemDivId)) {
            // init page for smooth sliding in and not seeing the page load
            let bildrPlugins = new BildrPluginsUI();
            BildrPluginManager.register(bildrPlugins)

            // CREATE menu bar item
            var elem = document.createElement("div");
            elem.id = PluginToolBarButton.pluginsMenuItemDivId;
            elem.className = "css_0Bn06MSFX0Oj13pgDAho9g ";
            elem.innerHTML = "<img src='https://documents-weu.bildr.com/r778fd6080b694ebc8451a3af0b77b028/doc/tool.5hBAqSf0U0aFZAloVaMjBw.svg' class='css_40tBJ8HulEaFxBAoX32hBQ' draggable='false' width='240'><div innerhtml='Community Plugins' class='css_ css_23185 css_22538 css_23641' style='white-space:nowrap;'>Community Plugins</div>";

            // add to side menu bar
            var sideMenuBar = document.querySelector(`.${PluginToolBarButton.sideMenuBarDivCss}`);
            if (sideMenuBar == undefined) {
                throw new Error("Could not find side menu bar");

            }
            // after the 5th seperator
            let seperator = sideMenuBar.querySelectorAll(".css_jMrwOmSGxUezs1sr6VSoNQ  ")[5]
            if (seperator) {
                seperator.before(elem);
            } else {
                sideMenuBar.appendChild(elem);
            }

            // Handle click on button, inside the plugin or outside the plugin (auto hide)
            // Mind the config param capture: true on the addEventListener
            document.body.addEventListener('click', e => {


                var target = e.target as HTMLElement;

                // assume the click is outside the plugin / div
                let action = "hide";
                let visiblePlugins = BildrPluginManager.getVisiblePlugins();

                while (target) {
                    if (target == null) return;

                    // Ignore click inside the plugin / div
                    let clickedInPlugin = visiblePlugins.find(p => p.isSameDivElem(target));
                    if (clickedInPlugin) {
                        action = "";
                        break;
                    }
                    // Handles click on plugins button (and image and tekst)
                    if (target.id == PluginToolBarButton.pluginsMenuItemDivId) {
                        action = "toggle";
                        break;
                    }
                    target = target.parentNode as HTMLElement;
                }

                if (action == "hide") {
                    visiblePlugins.forEach(p => p.hide());
                }
                if (action == "toggle") { bildrPlugins.toggleVisibility(); }

            }, { capture: true })

        }
    }
}

function initializeMutationObservers() {
    var onStudioLoadObservers = [];
    // set up marketplace button as soon as top bar is available
    onStudioLoadObservers.push(new MutationObserver(function (_mutations, me) {
        // `me` is the MutationObserver instance
        if (PluginToolBarButton.isSideBarAvailable()) {
            // stop observing
            me.disconnect();

            PluginToolBarButton.create();
        }
    }));
    return onStudioLoadObservers;
}

export function initPluginManagerUI() {

    // prevent running this script when not in Bildr Studio
    if (location.href.indexOf("https://www.bildr.com/studio?projectName=") != -1) {
        // start observing
        var onStudioLoadObservers = initializeMutationObservers();

        onStudioLoadObservers.forEach(observer => {
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });
    }
}
