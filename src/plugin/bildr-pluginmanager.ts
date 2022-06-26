import { BildrPluginLeftSide } from "./BildrPluginLeftSide";
import { BildrPluginManager } from "./BildrPluginManager";

export class BildrPlugins extends BildrPluginLeftSide {
    private Version = "2";

    constructor() {
        super("marketplace", "https://marketplace.bildr.com/BE")
        this.addAction("hidePlugin", () => { this.hide(); return undefined });
        this.addAction("showPlugin", () => { this.show(); return undefined });
    }
}

export class PluginToolBarButton {
    static pluginsMenuItemDivId = "bildrPluginsMenuItem";
    static sideMenuBarDivCss = ".css_23071.css_23052";

    static isSideBarAvailable() {
        return document.querySelector(`.${PluginToolBarButton.sideMenuBarDivCss}`);
    }

    static create() {
        if (!document.getElementById(PluginToolBarButton.pluginsMenuItemDivId)) {
            // init page for smooth sliding in and not seeing the page load
            let bildrPlugins = new BildrPlugins();
            BildrPluginManager.register(bildrPlugins)

            // Make some space in the menu bar
            var sideMenuBar = document.querySelector(`.${PluginToolBarButton.sideMenuBarDivCss}`) as HTMLDivElement;
            // sideMenuBar.style.width = "520px";

            // CREATE menu bar item
            var elem = document.createElement("div");
            elem.id = PluginToolBarButton.pluginsMenuItemDivId;
            elem.className = "css_40tBJ8HulEaFxBAoX32hBQ css_23637 ";
            elem.innerHTML = "<img src='https://documents-weu.bildr.com/r9f576480f5ba4b118cec7ce8e6c345e3/doc/Bildr marketplace logo WB color.ynHqabhunkG6oesIc3Xzvg.png' class='css_0EWldTyzqU60XwJWKjRXog' draggable='false' width='240'><div innerhtml='Plugins' class='css_ css_23185 css_22538 css_23641 ' style='white-space:nowrap;'>Plugins</div>";

            // add to side menu bar
            sideMenuBar.appendChild(elem);

            // Handle click on button, inside the plugin or outside the plugin (auto hide)
            // Mind the config param capture: true on the addEventListener
            document.body.addEventListener('click', e => {


                var target = e.target as HTMLElement;

                // assume the click is outside the plugin / div
                let action = "hide";
                let visiblePlugins = BildrPluginManager.getVisiblePlugins();

                while (target) {

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
var onStudioLoadObservers = [];
// set up marketplace button as soon as top bar is available
onStudioLoadObservers.push(new MutationObserver(function (_mutations, me) {
    // `me` is the MutationObserver instance

    if (PluginToolBarButton.isSideBarAvailable()) {
        // stop observing
        me.disconnect();

        PluginToolBarButton.create();
    }
}))

// prevent running this script when not in Bildr Studio
if (location.href.indexOf("https://www.bildr.com/studio?projectName=") != -1) {
    // start observing

    onStudioLoadObservers.forEach(observer => {
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}