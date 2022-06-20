import { BildrPlugin, BildrPluginManager } from './../src/BildrPluginManager';
import { myTestPlugin } from './myTestPlugin';

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

