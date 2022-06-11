import { BildrCacheHelper } from "./Bildr-tools-helpers";

// Stubs which will not be part of the output javascript
declare var window: {
    orgQAFunc: typeof QueueAction,
    QueueAction: typeof QueueAction
}

// If you want both Flows and actions use: Flows | Actions
export enum ActionsToShowEnum {
    Flows = 1 << 0,
    Actions = 1 << 1,
    BildrActions = 1 << 2,
    MouseActions = 1 << 3,
};

export class BildrToolsDebug {
    private static _StepMode: boolean = false;

    static ActionsToShow: ActionsToShowEnum = ActionsToShowEnum.Flows;

    static ShowAllVariables(): void {

        function frmsRecursive(brwFrm: brwForm) {
            if (brwFrm && brwFrm.form && brwFrm.form.name) {
                console.log(`Variables of Page: ${brwFrm.form.name}`);
            }
            let brwFrmVars = brwFrm._vars;
            if (brwFrmVars) {
                console.log(brwFrmVars);
                if (brwFrm.cBrwForms) {
                    brwFrm.cBrwForms.forEach(frm => {
                        frmsRecursive(frm);
                    });
                }
            }
        }

        frmsRecursive(brwFormRoot);
    }

    static Start(): void
    static Start(breakBeforActionId?: actId): void {
        if (!window.orgQAFunc) { window.orgQAFunc = QueueAction; }

        window.QueueAction = function (a: action, wait: boolean, parentQAction: any, brwObj: any, params: any, isThread: boolean, qName: string, bildrCache: BildrDBCache, addToQueue: boolean) {
            let showFlows = (BildrToolsDebug.ActionsToShow & ActionsToShowEnum.Flows) === ActionsToShowEnum.Flows;
            let showActions = (BildrToolsDebug.ActionsToShow & ActionsToShowEnum.Actions) === ActionsToShowEnum.Actions;
            let showBildrActions = (BildrToolsDebug.ActionsToShow & ActionsToShowEnum.BildrActions) === ActionsToShowEnum.BildrActions;
            let showMouseActions = (BildrToolsDebug.ActionsToShow & ActionsToShowEnum.MouseActions) === ActionsToShowEnum.MouseActions;

            if (a) {
                // V3gKt5FZRECIDMudjBbi3g = Action - Mouseenter - Element
                // AGTUwIokUuQgXEgNW6mnA = Action - Mouse Leave Page
                // CAGTUwIokUuQgXEgNW6mnA = Action - Mouse Leave Page
                let isMouseEvent = (a.id == "V3gKt5FZRECIDMudjBbi3g" || a.id == "AGTUwIokUuQgXEgNW6mnA" || a.id == "CAGTUwIokUuQgXEgNW6mnA")
                let isFlow = (a.type == "68");

                // Show only flows
                if ((isMouseEvent && showMouseActions) || (isFlow && showFlows) || (!isMouseEvent && !isFlow && showActions)) {
                    // is it a project action?
                    let act = undefined;
                    if (a.id && !showBildrActions) {
                        let cache = BildrCacheHelper.createInstance();
                        act = cache.actions.find(act => { return act.id == a.id })
                    }

                    if (act != undefined || showBildrActions) {
                        let type = isFlow ? "Flow  " : "Action";
                        let indent = isFlow ? "" : "  --";
                        console.log(`${type}: ${a.id} ${indent}  "${a.name}"`);

                        if (BildrToolsDebug._StepMode || (breakBeforActionId && a.id == breakBeforActionId)) {
                            BildrToolsDebug._StepMode = true;
                            debugger;
                        }
                    }
                }
            }
            window.orgQAFunc.call(this, a, wait, parentQAction, brwObj, params, isThread, qName, bildrCache, addToQueue);
        }
        window.QueueAction.prototype = window.orgQAFunc.prototype;
        window.QueueAction.prototype.constructor = QueueAction;
    }

    static Stop(): void {
        if (window.orgQAFunc) { window.QueueAction = window.orgQAFunc; }
    }

    static StepModeOff(): void {
        BildrToolsDebug._StepMode = false;
    }
}