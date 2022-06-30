import { JSDOM } from 'jsdom';
import { BildrPluginManager } from '../../src/plugin/BildrPluginManager';

export class myTestPluginManager extends BildrPluginManager {
    testBrowser: JSDOM;

    constructor(testBrowser: JSDOM) {
        super();
        this.testBrowser = testBrowser;

    }
    protected override get window(): { addEventListener: (eventName: string, eventHandlerFunction: (e: any) => void) => void; } {
        return this.testBrowser.window;
    }
}
