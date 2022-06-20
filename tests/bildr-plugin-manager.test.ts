import { JSDOM } from 'jsdom';
import { BildrPlugin, BildrPluginManager } from './../src/BildrPluginManager';

describe('BildrPluginManager', () => {
    beforeEach(() => {
        BildrPluginManager.registeredPlugins = []
    });

    it('should be able to register a plugin', () => {
        // GIVEN
        let plugin = new myTestPlugin("marketplace", "");

        // WHEN
        BildrPluginManager.register(plugin)

        //THEN
        expect(BildrPluginManager.isRegistered("marketplace")).toBeTruthy();
    });

    it('should not be able to register a plugin with an already registered name', () => {
        // GIVEN
        BildrPluginManager.register(new myTestPlugin("marketplace", ""))
        const plugin = new BildrPlugin("marketplace", "");

        // WHEN - THEN
        expect(() => BildrPluginManager.register(plugin)).toThrowError("Plugin with name 'marketplace' already registered. Name needs to be unique.")
    });

    it('should require a name for a plugin', () => {
        // GIVEN
        const plugin = new BildrPlugin("", "");

        // WHEN - THEN
        expect(() => BildrPluginManager.register(plugin)).toThrowError("Name is required to register a plugin.")
    });

    it('should render page after registration', () => {
        // GIVEN
        let plugin = new myTestPlugin("something", "")

        //WHEN
        BildrPluginManager.register(plugin)

        //THEN
        expect(plugin.renderIsCalled).toBeTruthy()
    });

    it('should remove plugin', () => {
        // GIVEN
        let plugin = new myTestPlugin("something", "")
        BildrPluginManager.register(plugin)

        //WHEN
        BildrPluginManager.remove(plugin.name);

        //THEN
        expect(BildrPluginManager.isRegistered(plugin.name)).toBeFalsy()
        expect(plugin.testBrowser.window.document.querySelector("iframe")).toBeNull()
        
    });
    it.skip('should receive a message', () => {
        // GIVEN
        let plugin = new myTestPlugin("marketplace", "https://some/thing.html");
        BildrPluginManager.register(plugin)

        let messageToPost = {
            command: "specialMessage",
            msgId: "123456789",
            data: { "param1": 1, "param2": "the second one" }
        }

        let window = plugin.testBrowser.window;

        // WHEN
        window.postMessage(JSON.stringify(messageToPost), "test suite")

        // THEN
        expect(plugin.latestMessage).toEqual("Hi THERE")

    });
})

describe("plugin", () => {
    it('should be hidden be hidden after renderPage', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "")

        // WHEN
        plugin.renderPage()

        // THEN
        expect(plugin.isVisible).toBeFalsy()
    })

    it('should be visible', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "")
        plugin.renderPage()

        // WHEN
        plugin.show()

        // THEN
        expect(plugin.isVisible).toBeTruthy()
    })

    it('should be not be visible', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "")
        plugin.renderPage()

        // WHEN
        plugin.hide()

        // THEN
        expect(plugin.isVisible).toBeFalsy()
    })

    it('should be visible after toggleVisibility', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "")
        plugin.renderPage()

        // WHEN
        plugin.toggleVisibility()

        // THEN
        expect(plugin.isVisible).toBeTruthy()
    })

    it('should not be visible after toggleVisibility', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "")
        plugin.renderPage()
        plugin.show();

        // WHEN
        plugin.toggleVisibility()

        // THEN
        expect(plugin.isVisible).toBeFalsy()
    })

    it('should render div with page in iframe', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "https://mydomain.plugin.html")

        // WHEN
        plugin.renderPage()

        // THEN
        expect(plugin.testBrowser.window.document.querySelectorAll("div")).toHaveLength(2)
        const iframe = plugin.testBrowser.window.document.querySelector("iframe");
        expect(iframe).not.toBeNull()
        expect(iframe!.id.length).toBeGreaterThan(0)
        expect(iframe!.src).toEqual("https://mydomain.plugin.html/")
    })

    it('should remove div / plugin', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "https://mydomain.plugin.html")
        plugin.renderPage()

        // WHEN
        plugin.remove()

        // THEN
        expect(plugin.testBrowser.window.document.querySelectorAll("div")).toHaveLength(1)
        expect(plugin.testBrowser.window.document.querySelector("iframe")).toBeNull()
    })

});

class myTestPlugin extends BildrPlugin {
    renderIsCalled: boolean = false;
    latestMessage(latestMessage: any) {
        throw new Error('Method not implemented.');
    }
    public testBrowser = new JSDOM(`<!DOCTYPE html>
    <head>
        <title>Bildr Studio Stub</title>
    </head>
    <body>
        <div name="bildr_canvas"></div>
    </body>
    </html>`);

    constructor(name: string, url: string) {
        super(name, url);
    }
    protected override get document(): Document {
        return this.testBrowser.window.document;
    }
    public override renderPage(): void {
        this.renderIsCalled = true;
        super.renderPage();
    }
}