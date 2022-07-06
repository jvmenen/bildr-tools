import { JSDOM } from 'jsdom';
import { BildrPluginManager } from '../../src/plugin/BildrPluginManager';
import { myTestPlugin } from './myTestPlugin';
import { myTestPluginManager } from './myTestPluginManager';

describe('BildrPluginManager', () => {
    let plugin: myTestPlugin;
    let testBrowser: JSDOM;

    beforeEach(() => {
        testBrowser = new JSDOM(`<!DOCTYPE html>
        <head>
            <title>Bildr Studio Stub</title>
        </head>
        <body>
            <div name="bildr_canvas"></div>
        </body>
        </html>`);

        BildrPluginManager._instance = new myTestPluginManager(testBrowser)
        plugin = new myTestPlugin("marketplace", "", testBrowser);
    });

    it('should be able to register a plugin', () => {
        // GIVEN

        // WHEN
        BildrPluginManager.register(plugin)

        //THEN
        expect(BildrPluginManager.isRegistered("marketplace")).toBeTruthy();
    });

    it('should not be able to register a plugin with an already registered name', () => {
        // GIVEN
        BildrPluginManager.register(new myTestPlugin("marketplace", "", testBrowser))

        // WHEN - THEN
        expect(() => BildrPluginManager.register(plugin)).toThrowError("Plugin with name 'marketplace' already registered. Name needs to be unique.")
    });

    it('should require a name for a plugin', () => {
        // GIVEN
        plugin = new myTestPlugin("", "", testBrowser);

        // WHEN - THEN
        expect(() => BildrPluginManager.register(plugin)).toThrowError("Name is required to register a plugin.")
    });

    it('should render page after registration', () => {
        // GIVEN

        //WHEN
        BildrPluginManager.register(plugin)

        //THEN
        expect(plugin.renderIsCalled).toBeTruthy()
    });

    it('should remove plugin', () => {
        // GIVEN
        BildrPluginManager.register(plugin)

        //WHEN
        BildrPluginManager.remove(plugin.name);

        //THEN
        expect(BildrPluginManager.isRegistered(plugin.name)).toBeFalsy()
        expect(plugin.testBrowser.window.document.querySelector("iframe")).toBeNull()

    });
    it('should register message eventhandler on window.addlistener on first registred plugin', () => {
        // GIVEN
        let addEventListenerSpy = jest.fn()
        plugin.testBrowser.window.addEventListener = addEventListenerSpy

        // WHEN
        BildrPluginManager.register(plugin)

        // THEN
        expect(addEventListenerSpy).toBeCalledWith('message', expect.anything())

    });
    it('should receive a message', () => {
        // GIVEN
        // set up to get a reference to the callback function that
        // will be triggered by the "message" event handler on window
        let messageFunc: Function;

        let addEventListenerSpy = jest.fn((event: any, callback: any) => {
            messageFunc = callback as Function;
        })
        testBrowser.window.addEventListener = addEventListenerSpy

        BildrPluginManager.register(plugin)

        let actionData = {
            pluginName: plugin.name,
            command: "saySomething",
            uMsgId: "123456789",
            data: { "param1": "Hello World!" }
        }
        let eventData = { "data": actionData }

        // WHEN
        // let window = plugin.testBrowser.window;
        // window.postMessage(JSON.stringify(messageToPost), "*")
        messageFunc!(eventData, "*")

        // THEN
        expect(plugin.recentActionName).toEqual("saySomething")
        expect(plugin.recentActionData.uMsgId).toEqual("123456789")
        expect(plugin.recentActionData.param1).toEqual("Hello World!")
    });

    it('should throw an exception if pluginName is unknown', () => {
        // GIVEN
        // set up to get a reference to the callback function that
        // will be triggered by the "message" event handler on window
        let messageFunc: Function;

        let addEventListenerSpy = jest.fn((event: any, callback: any) => {
            messageFunc = callback as Function;
        })
        testBrowser.window.addEventListener = addEventListenerSpy

        // one plugin needs to beregistered otherwise the message event handler will not be registered
        BildrPluginManager.register(plugin)

        let actionData = {
            pluginName: "unknown-zauihafdhbebbebassdh",
            command: "saySomething",
            uMsgId: "123456789",
            data: { "param1": "Hello World!" }
        }
        let eventData = { "data": actionData }

        // WHEN / THEN
        expect(() => messageFunc!(eventData, "*")).toThrowError(`Plugin with name 'unknown-zauihafdhbebbebassdh' is not registered.`)
    });

    it('should add msgId to data even if data is initially undefined', () => {
        // GIVEN
        // set up to get a reference to the callback function that
        // will be triggered by the "message" event handler on window
        let messageFunc: Function;

        let addEventListenerSpy = jest.fn((event: any, callback: any) => {
            messageFunc = callback as Function;
        })
        testBrowser.window.addEventListener = addEventListenerSpy

        BildrPluginManager.register(plugin)

        const actionData = {
            pluginName: plugin.name,
            command: "saySomething",
            uMsgId: "123456789",
            data: undefined
        }

        const eventData = { "data": actionData };

        // WHEN
        // let window = plugin.testBrowser.window;
        // window.postMessage(JSON.stringify(messageToPost), "*")
        messageFunc!(eventData, "*")

        // THEN
        expect(plugin.recentActionData.uMsgId).toEqual("123456789")
    });

    it('should return visible plugin', () => {
        // GIVEN
        let plugin = new myTestPlugin("plugin1", "", testBrowser);
        let plugin2 = new myTestPlugin("plugin2", "", testBrowser);

        BildrPluginManager.register(plugin)
        BildrPluginManager.register(plugin2)

        plugin.show();

        // WHEN
        let visiblePlugin = BildrPluginManager.getVisiblePlugins();

        // THEN
        expect(visiblePlugin).toHaveLength(1)
        expect(visiblePlugin[0].name).toEqual(plugin.name);
    });

    it('should return undefined if no plugin is vissble', () => {
        // GIVEN
        let plugin = new myTestPlugin("plugin1", "", testBrowser);
        let plugin2 = new myTestPlugin("plugin2", "", testBrowser);

        BildrPluginManager.register(plugin)
        BildrPluginManager.register(plugin2)

        // WHEN
        let visiblePlugin = BildrPluginManager.getVisiblePlugins();

        // THEN
        expect(visiblePlugin).toHaveLength(0);
    });
})
