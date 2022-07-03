import { JSDOM } from "jsdom";
import { myTestPlugin } from "./myTestPlugin";

describe("BildrPlugin", () => {
    let testBrowser: JSDOM;

    beforeEach(() => {
        testBrowser = new JSDOM(`<!DOCTYPE html>
        <head>
            <title>Bildr Studio Stub</title>
        </head>
        <body>
            <div name="bildr_canvas"></div>
        </body>
        </html>`, { url: "https://www.bildr.com/studio?projectName=12345667" });
    });

    it('should be hidden after renderPage', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "", testBrowser)

        // WHEN
        plugin.renderPage()

        // THEN
        expect(plugin.isVisible).toBeFalsy()
    })

    it('should be visible', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "", testBrowser)
        plugin.renderPage()

        // WHEN
        plugin.show()

        // THEN
        expect(plugin.isVisible).toBeTruthy()
    })

    it('should be not be visible', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "", testBrowser)
        plugin.renderPage()

        // WHEN
        plugin.hide()

        // THEN
        expect(plugin.isVisible).toBeFalsy()
    })

    it('should be visible after toggleVisibility', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "", testBrowser)
        plugin.renderPage()

        // WHEN
        plugin.toggleVisibility()

        // THEN
        expect(plugin.isVisible).toBeTruthy()
    })

    it('should not be visible after toggleVisibility', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "", testBrowser)
        plugin.renderPage()
        plugin.show();

        // WHEN
        plugin.toggleVisibility()

        // THEN
        expect(plugin.isVisible).toBeFalsy()
    })

    it('should render div with page in iframe', () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "https://mydomain.plugin.html", testBrowser)

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
        let plugin = new myTestPlugin("test", "https://mydomain.plugin.html", testBrowser)
        plugin.renderPage()

        // WHEN
        plugin.remove()

        // THEN
        expect(plugin.testBrowser.window.document.querySelectorAll("div")).toHaveLength(1)
        expect(plugin.testBrowser.window.document.querySelector("iframe")).toBeNull()
    })

    it("should be the same divElem", () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "https://mydomain.plugin.html", testBrowser)
        plugin.renderPage()

        // WHEN
        let result = plugin.isSameDivElem(plugin.divElem)
        // THEN
        expect(result).toBeTruthy();
    })

    it("should not be the same divElem", () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "https://mydomain.plugin.html", testBrowser)
        let plugin2 = new myTestPlugin("test", "https://mydomain.plugin.html", testBrowser)
        plugin.renderPage()

        // WHEN
        let result = plugin.isSameDivElem(plugin2.divElem)
        // THEN
        expect(result).toBeFalsy();
    })

    it("should be possible to register an action", () => {
        // GIVEN
        let plugin = new myTestPlugin("test", "", testBrowser)
        plugin.triggerActionShouldCallSuper = true

        plugin.addAction("doSomething", (actionData: any) => {
            return actionData.message;
        })

        // WHEN
        let result = plugin.triggerAction("doSomething", { uMsgId: "1", "message": "Hello World!" })

        // THEN
        expect(result).toEqual("Hello World!")

    })

    it('should call sendOutgGoinMessage when triggerAction returns a value', () => {
        let plugin = new myTestPlugin("", "", testBrowser);
        plugin.triggerActionShouldCallSuper = true;
        plugin.addAction("saySomething", () => { return "awesome" })

        // WHEN
        plugin.triggerAction("saySomething", { uMsgId: "123", something: "else" })

        // THEN
        expect(plugin.recentOutgoingMessageMsgId).toEqual("123");
        expect(plugin.recentOutgoingMessageData).toEqual("awesome")


    });
});

