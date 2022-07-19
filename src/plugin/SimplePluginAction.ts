import { BildrPluginAction } from "./BildrPluginAction";

/**
 * @public
 */
export class SimplePluginAction implements BildrPluginAction {
    private _name: string;
    private _execFunc: Function;

    constructor(actionName: string, execFunc: Function) {
        this._name = actionName;
        this._execFunc = execFunc;
    }

    get name(): string {
        return this._name;
    }
    execFunc(args: any): any {
        return this._execFunc(args);
    }
}
