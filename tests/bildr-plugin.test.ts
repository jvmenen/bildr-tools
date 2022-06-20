import { myTestPlugin } from "./myTestPlugin";

describe("BildrPugin", () => {
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

