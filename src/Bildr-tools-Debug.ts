import { BildrCacheHelper } from "./Bildr-tools-utils";

// Stubs which will not be part of the output javascript
declare var window: {
    orgQAFunc: Function,
    QueueAction: any
}

export const BildrToolsDebug = {
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
        let debugZettingShowAllActions = false;
        let debugZettingShowBildrActions = false;
        let debugZettingStepMode = false;
        let debugZettingAutoShowVariables = false;

        window.QueueAction = function (a: action, wait: boolean, parentQAction: any, brwObj: any, params: any, isThread: boolean, qName: string, bildrCache: BildrDBCache, addToQueue: boolean) {
            let ignoreCanvasMouseEvents = true;

            if (a) {
                let isMouseEvent = false;
                let isFlow = (a.type && a.type == "68");

                if (ignoreCanvasMouseEvents) {
                    // V3gKt5FZRECIDMudjBbi3g = Action - Mouseenter - Element
                    // AGTUwIokUuQgXEgNW6mnA = Action - Mouse Leave Page
                    // CAGTUwIokUuQgXEgNW6mnA = Action - Mouse Leave Page
                    isMouseEvent = (a.id == "V3gKt5FZRECIDMudjBbi3g" || a.id == "AGTUwIokUuQgXEgNW6mnA" || a.id == "CAGTUwIokUuQgXEgNW6mnA")
                }
                // Show only flows
                if (!isMouseEvent && (isFlow || debugZettingShowAllActions)) {
                    let type = "Flow";
                    if (!isFlow) {
                        type = "Action";
                    }

                    // is it a project action?
                    let actionInProject = false;
                    if (a.id && !debugZettingShowBildrActions) {
                        let cache = new BildrCacheHelper(true);
                        let act = cache.actions.find(act => { return act.id == a.id })
                        actionInProject = (act != undefined);
                    }

                    if (actionInProject || debugZettingShowBildrActions) {
                        console.log(`${Date.now()} ${type} ${a.id} = ${a.name}`);

                        if (debugZettingStepMode || a.id == BildrToolsDebug._ActionIdBreakpoint) {
                            debugZettingStepMode = true;
                            if (debugZettingAutoShowVariables) {
                                BildrToolsDebug.ShowAllVariables();
                            }
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
    _ActionIdBreakpoint : "" as actId

}