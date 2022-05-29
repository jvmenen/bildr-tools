
// Define groupBy on Array
if (!Array.prototype.groupBy) {
    Object.defineProperty(Array.prototype, 'groupBy', {
        value: function (key) {
            return this.reduce((acc, currentValue) => {
                let groupKey = currentValue[key];
                if (!acc[groupKey]) {
                    acc[groupKey] = [];
                }
                acc[groupKey].push(currentValue);
                return acc;
            }, {});
        }
    });
}

// Define nameSort on Array
if (!Array.prototype.nameSort) {
    Object.defineProperty(Array.prototype, 'nameSort', {
        value: function () {
            return this.sort((a, b) => { return ('' + a.name).localeCompare(b.name) });
        }
    });
}

findUnusedFlows = function (skipAutoSave = true) {
    const theActions = BildrDBCacheGet(1).actions.recs;
    const theForms = BildrDBCacheGet(1).forms.recs;
    const activeForms = theForms.filter(item => { return (item.deleted == 0) }).nameSort();
    const activeFlows = theActions.filter(action => { return (action.type == "68" && action.deleted == 0) });
    const flowsGroupedByFormID = theActions.filter(action => { return (action.type == "68" && action.deleted == 0) }).groupBy("formID");

    const theVars = {
        "theActions": theActions,
        "theForms": theForms,
        "activeElements": BildrDBCacheGet(1).elements.recs.filter(item => { return (item.deleted == 0) }),
        "activeForms": activeForms,
        "activeFlows": activeFlows
    }

    // create "header" for the results
    console.log(`Check ${theActions.length} flows. This might take a few seconds...`);
    console.log("You'll see a mesage when checking is finished.");
    console.log("");
    if (skipAutoSave) {
        console.log("Looking for Unused flows (skipping unused 'Auto Save')");
    } else {
        console.log("Looking for All unused flows");
    }
    console.log("");

    activeForms.forEach(form => {
        if (!form.actions) { return; }

        // actions in form.actions are not marked as deleted
        let activeFlows = flowsGroupedByFormID[form.id];
        if (activeFlows) {
            let formNameLogged = false;
            activeFlows.nameSort().forEach(flow => {
                if (skipAutoSave && flow.name.includes("Auto Save")) { return; }

                if (_findUsageOfFlow(flow.id, false, theVars) == false) {
                    if (!formNameLogged) {
                        formNameLogged = true;
                        console.log("Form : " + form.name)
                    }
                    console.log("  Flow : " + flow.name);
                }
            })
        }
    })
    console.log("");
    console.log("THAT'S IT!");
}

findUsageOfFlow = function (flowId, logToConsole = true) {
    // init vars
    let theActions = BildrDBCacheGet(1).actions.recs;
    let theForms = BildrDBCacheGet(1).forms.recs;

    var theVars = {
        "theActions": theActions,
        "theForms": theForms,
        "activeElements": BildrDBCacheGet(1).elements.recs.filter(item => { return (item.deleted == 0) }),
        "activeForms": theForms.filter(item => { return (item.deleted == 0) }),
        "activeFlows": theActions.filter(action => { return (action.type == "68" && action.deleted == 0) })
    }
    return _findUsageOfFlow(flowId, logToConsole, theVars);
}

findFlowWithActions = function (flowId) {
    let theActions = BildrDBCacheGet().actions.recs;
    let activeFlows = theActions.filter(action => { return (action.type == "68" && action.deleted == 0) })
    let flow = activeFlows.find(flow => {
        return (flow.id && flow.id.toString() == flowId);
    })

    if (flow == undefined) {
        console.log("flow not found");
        return false;
    }

    console.log("Flow found:");
    console.log(flow);
    console.log("Actions:");

    let actionsArrayValue = [];
    if (flow.opts && flow.opts.arguments) {
        let actionsArray = flow.opts.arguments.find(item => { return item.name == "actionsArray" });
        if (actionsArray && actionsArray.value) {
            actionsArrayValue = actionsArray.value;
        }
    };

    if (actionsArrayValue) {
        actionsArrayValue.forEach(actionRef => {
            // Used in an argument of an action type?
            let action = theActions.find(item => { return (item.id.toString() == actionRef.id.toString()) });

            if (action) {
                console.log(action);
            }
        })
    }
}

findBildrUsageOfFlow = function (flowId, logToConsole = true) {
    // init vars
    let theActions = BildrDBCacheGet().actions.recs;
    let theForms = BildrDBCacheGet().forms.recs;

    var theVars = {
        "theActions": theActions,
        "theForms": theForms,
        "activeElements": BildrDBCacheGet(1).elements.recs.filter(item => { return (item.deleted == 0) }),
        "activeForms": theForms.filter(item => { return (item.deleted == 0) }),
        "activeFlows": theActions.filter(action => { return (action.type == "68" && action.deleted == 0) })
    }
    return _findUsageOfFlow(flowId, logToConsole, theVars);
}
_findUsageOfFlow = function (flowId, logToConsole, theVars) {
    // for easy reference
    var isUsed = false;
    const theActions = theVars.theActions;
    const theForms = theVars.theForms;
    const activeForms = theVars.activeForms;
    const activeFlows = theVars.activeFlows;
    const flowsGroupedByFormID = theActions.filter(action => { return (action.type == "68" && action.deleted == 0) }).groupBy("formID");

    function ConsoleLog(text) {
        if (logToConsole) { console.log(text); }
    }

    // Create "Header" for the results
    let theFlow = activeFlows.find(flow => { return (flow.id == flowId) })
    // found it
    if (theFlow) {
        let form = theForms.find(item => { return item.id == theFlow.formID });
        ConsoleLog(`Flow "${theFlow.name}" on form "${form.name}" is called by:`);
        ConsoleLog("");
    } else {
        ConsoleLog(`Couldn't find flowID ${flowId} in project!`);
        return false;
    }

    // check flow usage per active form
    activeForms.forEach(form => {
        if (!form.actions) { return; }

        // actions in form.actions are not marked as deleted
        let activeFlows = flowsGroupedByFormID[form.id];
        if (!activeFlows) { return }

        let formNameLogged = false;
        // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
        activeFlows.nameSort().forEach(flow => {
            let actionsArrayValue = [];
            if (flow.opts && flow.opts.arguments) {
                let actionsArray = flow.opts.arguments.find(item => { return item.name == "actionsArray" });
                if (actionsArray && actionsArray.value) {
                    actionsArrayValue = actionsArray.value;
                }
            };

            if (actionsArrayValue) {
                actionsArrayValue.forEach(actionRef => {
                    // Nested flow?
                    let asNestedFlow = actionRef.id && actionRef.id.toString().endsWith(flowId)
                    if (asNestedFlow) {
                        isUsed = true;
                        if (!formNameLogged) {
                            formNameLogged = true;
                            ConsoleLog("Form : " + form.name);
                        }
                        ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                        ConsoleLog("    as nested flow");
                    }
                    if (!asNestedFlow) {
                        // Used in an argument of an action type?
                        let action = theActions.find(item => { return (item.id == actionRef.id) });

                        if (action && action.opts && action.opts.arguments && Array.isArray(action.opts.arguments)) {
                            let hasFlowRef = action.opts.arguments.find(arg => {
                                return (arg.type && arg.type == "static.actions" && arg.value && arg.value.toString().endsWith(flowId));
                            })
                            if (hasFlowRef) {
                                isUsed = true;
                                if (!formNameLogged) {
                                    formNameLogged = true;
                                    ConsoleLog("Form : " + form.name);
                                }
                                ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                                ConsoleLog("    Action : " + action.name);
                            }
                        }
                    }

                })
            }
        });

        // Check usage of flow in Elements Events
        var formObjsTreeFlattend = [];

        function flattenElements(items) {
            if (items != undefined) {
                items.forEach(item => {
                    flattenElements(item.items)
                    formObjsTreeFlattend.push(item);
                })
            }
        }

        flattenElements(form.objsTree);

        formObjsTreeFlattend.nameSort().forEach(element => {
            if (element.opts && element.opts.events) {
                let eventsUsingFlow = element.opts.events.filter(item => { return item.actID && item.actID.toString().endsWith(flowId) });
                eventsUsingFlow.forEach(theEvent => {
                    isUsed = true;
                    if (!formNameLogged) {
                        formNameLogged = true;
                        ConsoleLog("Form : " + form.name);
                    }
                    ConsoleLog("  Element : " + element.name);
                    ConsoleLog("    Event : " + theEvent.code);
                })
            }
        });


        // Check usage of flow in Page Events (Page Flows and Root Page Flows attributes)
        let inPageEvents = []
        if (form.opts) {
            // Page Flows
            if (form.opts.autoSaveActionID && form.opts.autoSaveActionID.toString().endsWith(flowId)) {
                inPageEvents.push("Auto-Save Flow");
            }
            if (form.opts.onLoadAct && form.opts.onLoadAct.toString().endsWith(flowId)) {
                inPageEvents.push("Page Load Flow");
            }
            // Root Page Flows
            if (form.opts.notConnectedActID && form.opts.notConnectedActID.toString().endsWith(flowId)) {
                inPageEvents.push("Flow to run when connection is lost");
            }
            if (form.opts.reConnectedActID && form.opts.reConnectedActID.toString().endsWith(flowId)) {
                inPageEvents.push("Flow to run when connection is re-established");
            }
            if (form.opts.notAuthenticatedActID && form.opts.notAuthenticatedActID.toString().endsWith(flowId)) {
                inPageEvents.push("Flow to run when authentication is lost");
            }
            if (form.opts.newRevisionActID && form.opts.newRevisionActID.toString().endsWith(flowId)) {
                inPageEvents.push("Flow to Run When Revision is Out of Date");
            }
            if (inPageEvents.length > 0) {
                isUsed = true;
                ConsoleLog("Form : " + form.name);
                ConsoleLog("  Element : Page Body");
                inPageEvents.forEach(theEvent => {
                    ConsoleLog("    Event : " + theEvent);
                })
            }

            if (form.opts.resonanceDataListeners) {
                let dataListenersUsingFlow = form.opts.resonanceDataListeners.filter(item => { return item.actID && item.actID.toString().endsWith(flowId) });
                if (dataListenersUsingFlow.length > 0) {
                    isUsed = true;
                    ConsoleLog("Form : " + form.name);
                    ConsoleLog("  Element : Page Body");
                    ConsoleLog(`    Used by ${dataListenersUsingFlow.length} Data Listener(s)`);
                }
            }
        }
    })
    ConsoleLog("");
    ConsoleLog("THAT'S IT!");

    return isUsed;
}

findUsageOfDeletedFlows = function () {
    // for easy reference
    var theActions = BildrDBCacheGet(1).actions.recs;
    var theForms = BildrDBCacheGet(1).forms.recs;
    var activeForms = theForms.filter(item => { return (item.deleted == 0) });
    let activeFlows = theActions.filter(action => { return (action.type == "68" && action.deleted == 0) });
    let deletedFlows = theActions.filter(action => { return (action.type == "68" && action.deleted != 0) });

    function isDeletedFlow(flowId) {
        return deletedFlows.find(item => item.id.endsWith(flowId)) != undefined;
    }

    // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument
    activeFlows.forEach(flow => {
        let actionsArrayValue = [];
        if (flow.opts && flow.opts.arguments) {
            let actionsArray = flow.opts.arguments.find(item => { return item.name == "actionsArray" });
            if (actionsArray && actionsArray.value) {
                actionsArrayValue = actionsArray.value;
            }
        };

        if (actionsArrayValue) {
            actionsArrayValue.forEach(actionRef => {
                // Nested flow?
                if (actionRef.id && isDeletedFlow(actionRef.id)) {
                    let form = theForms.find(item => { return item.id == flow.formID });
                    console.log(`Form : ${form.name}`);
                    console.log(`  Flow : ${flow.name} (id: ${flow.id})`);
                    console.log("    as nested flow : " + deletedFlows.find(item => item.id.endsWith(actionRef.id)).name);
                } else {
                    let action = theActions.find(item => { return (item.id == actionRef.id) });

                    if (action && action.opts && action.opts.arguments) {
                        let hasFlowRef = action.opts.arguments.find(arg => {
                            return (arg.type && arg.type == "static.actions" && arg.value && isDeletedFlow(arg.value));
                        })
                        if (hasFlowRef) {
                            let form = theForms.find(item => { return item.id == flow.formID });
                            console.log(`Form : ${form.name}`);
                            console.log(`  Flow : ${flow.name} (id: ${flow.id})`);
                            console.log(`    Action : ${action.name}`);
                        }
                    }
                }
            })
        }
    });


    // Check usage of flow in Page Events (Page Flows and Root Page Flows attributes)
    activeForms.forEach(form => {
        // Flatten active elements because the elements don't get flagged as deleted although 
        // they are nog part of the form any more. Checks should only be done on active
        // elements.
        var objsTreeFlattend = [];

        function flattenElements(items) {
            if (items != undefined) {
                items.forEach(item => {
                    flattenElements(item.items)
                    objsTreeFlattend.push(item);
                })
            }
        }

        flattenElements(form.objsTree);
        // console.log(form.name);
        // console.log(form);
        // console.log(objsTreeFlattend);
        // console.log("");

        // Check usage of flow in Elements Events
        objsTreeFlattend.nameSort().forEach(element => {
            if (element.opts && element.opts.events) {
                let eventsUsingFlow = element.opts.events.filter(item => { return item.actID && isDeletedFlow(item.actID) });
                eventsUsingFlow.forEach(theEvent => {
                    let form = theForms.find(item => { return item.id == element.formID });
                    console.log("Form : " + form.name);
                    console.log("  Element : " + element.name);
                    console.log("    Event : " + theEvent.code);
                })
            }
        });


        let inPageEvents = []
        if (form.opts) {
            // Page Flows
            if (form.opts.autoSaveActionID && isDeletedFlow(form.opts.autoSaveActionID)) {
                inPageEvents.push("Auto-Save Flow");
            }
            if (form.opts.onLoadAct && isDeletedFlow(form.opts.onLoadAct)) {
                inPageEvents.push("Page Load Flow");
            }
            // Root Page Flows
            if (form.opts.notConnectedActID && isDeletedFlow(form.opts.notConnectedActID)) {
                inPageEvents.push("Flow to run when connection is lost");
            }
            if (form.opts.reConnectedActID && isDeletedFlow(form.opts.reConnectedActID)) {
                inPageEvents.push("Flow to run when connection is re-established");
            }
            if (form.opts.notAuthenticatedActID && isDeletedFlow(form.opts.notAuthenticatedActID)) {
                inPageEvents.push("Flow to run when authentication is lost");
            }
            if (form.opts.newRevisionActID && isDeletedFlow(form.opts.newRevisionActID)) {
                inPageEvents.push("Flow to Run When Revision is Out of Date");
            }
            if (inPageEvents.length > 0) {
                console.log("Form : " + form.name);
                console.log("  Element : Page Body");
                inPageEvents.forEach(theEvent => {
                    console.log("    Event : " + theEvent);
                })
            }

            if (form.opts.resonanceDataListeners) {
                let dataListenersUsingFlow = form.opts.resonanceDataListeners.filter(item => { return item.actID && isDeletedFlow(item.actID) });
                if (dataListenersUsingFlow.length > 0) {
                    console.log("Form : " + form.name);
                    console.log("  Element : Page Body");
                    console.log(`    Used by ${dataListenersUsingFlow.length} Data Listener(s)`);
                }
            }
        }
    })
    console.log("");
    console.log("THAT'S IT!");
}

// FLOW TRACER FUNCTIONALITY
var orgQAFunc = null;
var debugZettingActionIdBreakpoint = "";
var debugZettingStepMode = false;
var debugZettingShowAllActions = false;
var debugZettingAutoShowVariables = false;
var debugZettingShowBildrActions = false;

debugBreakBeforeActionID = function (actionId) {
    debugZettingActionIdBreakpoint = actionId;
}
debugTurnStepModeOn = () => {
    debugZettingStepMode = true;
}
debugTurnStepModeOff = () => {
    debugZettingStepMode = false;
}

debugStartFlowTracer = function () {
    if (!orgQAFunc) { orgQAFunc = QueueAction; }


    QueueAction = function (a, wait, parentQAction, brwObj, params, isThread, qName, bildrCache, addToQueue) {
        let ignoreCanvasMouseEvents = true;
        debugZettingActionIdBreakpoint = debugZettingActionIdBreakpoint.trim();

        if (a) {
            let isMouseEvent = false;
            let isFlow = (a.type && a.type == "68");

            if (ignoreCanvasMouseEvents) {
                // V3gKt5FZRECIDMudjBbi3g = Action - Mouseenter - Element
                // AGTUwIokUuQgXEgNW6mnA = Action - Mouse Leave Page
                // CAGTUwIokUuQgXEgNW6mnA = Action - Mouse Leave Page
                isMouseEvent = (a.id && (a.id == "V3gKt5FZRECIDMudjBbi3g" || a.id == "AGTUwIokUuQgXEgNW6mnA" || a.id == "CAGTUwIokUuQgXEgNW6mnA"))
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
                    let act = BildrDBCacheGet(1).actions.recs.find(act => { return act.id == a.id })
                    actionInProject = (act != undefined);
                }

                if (actionInProject || debugZettingShowBildrActions) {
                    console.log(`${Date.now()} ${type} ${a.id} = ${a.name}`);

                    if (debugZettingStepMode || a.id == debugZettingActionIdBreakpoint) {
                        debugZettingStepMode = true;
                        if (debugZettingAutoShowVariables) {
                            debugShowAllVariables();
                        }
                        debugger;
                    }
                }
            }
        }
        orgQAFunc.call(this, a, wait, parentQAction, brwObj, params, isThread, qName, bildrCache, addToQueue);
    }
    QueueAction.prototype = orgQAFunc.prototype;
    QueueAction.prototype.constructor = QueueAction;
}
debugStopFlowTracer = function () {
    if (orgQAFunc) { QueueAction = orgQAFunc; }
}

debugShowAllVars = debugShowAllVariables = function () {

    function frmsRecursive(brwFrm) {
        if (brwFrm && brwFrm.form && brwFrm.form.name) {
            console.log(`Variables of Page: ${brwFrm.form.name}`);
        }
        brwFrmVars = brwFrm._vars
        if (brwFrmVars) {
            console.log(brwFrmVars);
            if (brwFrm.cBrwForms) {
                brwFrm.cBrwForms.forEach(frm => {
                    frmsRecursive(frm);
                })
            }
        }
    }

    frmsRecursive(brwFormRoot);
}

var BildrTools = {

    Flows: {
        getFlowAndActions: findFlowWithActions,
        findUnused: findUnusedFlows,
        findUsage: findUsageOfFlow,
        findUsageOfDeletedFlows: findUsageOfDeletedFlows
    },

    Debug: {
        Trace: {
            Start: debugStartFlowTracer,
            Stop: debugStopFlowTracer,
            TraceFlowsOnly: function () { debugZettingShowAllActions = false },
            TraceFlowsAndActions: function () { debugZettingShowAllActions = true },
            BreakBeforeActionID: debugBreakBeforeActionID,
            StepMode: {
                On: debugTurnStepModeOn,
                Off: debugTurnStepModeOff
            },
        },

        ShowAllVariables: debugShowAllVariables,

        Settings: {
            get AutoShowVariables() { return debugZettingAutoShowVariables },
            set AutoShowVariables(value) { debugZettingAutoShowVariables = value },

            get ShowBildrActions() { return debugZettingShowBildrActions },
            set ShowBildrActions(value) { debugZettingShowBildrActions = value }
        }
    }
}
var U = BildrTools;

BildrTools["ActionTypes"] = {
    findUsage: function (actionTypeId) {
        let logToConsole = true;
        function ConsoleLog(text) {
            if (logToConsole) { console.log(text); }
        }

        let theActions = BildrDBCacheGet(1).actions.recs;
        let theForms = BildrDBCacheGet(1).forms.recs;
        let actionTypes = BildrDBCacheGet(1).actionsTypes.recs;
        let activeForms = theForms.filter(item => { return (item.deleted == 0) });

        // for easy reference
        const flowsGroupedByFormID = theActions.filter(action => { return (action.type == "68" && action.deleted == 0) }).groupBy("formID");

        // Create "Header" for the results
        let theActionType = actionTypes.find(acT => { return (acT.id == actionTypeId) })
        // found it
        if (theActionType) {
            ConsoleLog(`Action Type "${theActionType.name}" is called by:`);
            ConsoleLog("");
        } else {
            ConsoleLog(`Couldn't find Action Type ${actionTypeId} in project!`);
            return false;
        }

        // check flow usage per active form
        activeForms.forEach(form => {

            if (!form.actions) { return; }

            // actions in form.actions are not marked as deleted
            let activeFlows = flowsGroupedByFormID[form.id];
            if (!activeFlows) { return }

            let formNameLogged = false;
            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            activeFlows.nameSort().forEach(flow => {
                let actionsArrayValue = [];
                if (flow.opts && flow.opts.arguments) {
                    let actionsArray = flow.opts.arguments.find(item => { return item.name == "actionsArray" });
                    if (actionsArray && actionsArray.value) {
                        actionsArrayValue = actionsArray.value;
                    }
                };

                if (actionsArrayValue) {
                    actionsArrayValue.forEach(actionRef => {
                        // Used in an argument of an action type?
                        let action = theActions.find(item => { return (item.id == actionRef.id) });

                        if (action && action.type && action.type == actionTypeId) {
                            isUsed = true;
                            if (!formNameLogged) {
                                formNameLogged = true;
                                ConsoleLog("Form : " + form.name);
                            }
                            ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                            ConsoleLog("    Action : " + action.name);
                        }
                    })
                }
            });
        })
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");    
    }
}