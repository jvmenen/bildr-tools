/**
 * @public
 */

export type BildrPluginAction = {
    get name(): string;
    execFunc(args: any): any;
};
