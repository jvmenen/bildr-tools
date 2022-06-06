import { BildrCacheHelper } from "./Bildr-tools-utils";

// Stubs which will not be part of the output javascript
declare var window: {
    orgQAFunc: Function,
    QueueAction: any
}

// If you want both Flows and actions use: Flows | Actions
export enum ActionsToShowEnum {
    Flows = 1 << 0,
    Actions = 1 << 1,
    BildrActions = 1 << 2,
    MouseActions = 1 << 3,
};

export const BildrToolsDebug = {
    _ActionIdBreakpoint: "" as actId,
    ActionsToShow: ActionsToShowEnum.Flows,
    ShowAllVariables: () => {

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
    },
    Start: () => {
        if (!window.orgQAFunc) { window.orgQAFunc = QueueAction; }
        let debugZettingStepMode = false;

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
                        let indent = isFlow ? "" : "    ";
                        console.log(`${type}: ${a.id} ${indent}  "${a.name}"`);

                        if (debugZettingStepMode || a.id == BildrToolsDebug._ActionIdBreakpoint) {
                            debugZettingStepMode = true;
                            debugger;
                        }
                    }
                }
            }
            window.orgQAFunc.call(this, a, wait, parentQAction, brwObj, params, isThread, qName, bildrCache, addToQueue);
        }
        window.QueueAction.prototype = window.orgQAFunc.prototype;
        window.QueueAction.prototype.constructor = QueueAction;
    },
    Stop: () => {
        if (window.orgQAFunc) { window.QueueAction = window.orgQAFunc; }
    },
    BreakBeforeActionID: (actionId: actId) => {
        BildrToolsDebug._ActionIdBreakpoint = actionId.toString().trim();
    },
}