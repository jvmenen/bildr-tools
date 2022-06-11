import { BildrCacheHelper, nameSort } from "./Bildr-tools-helpers";

export class BildrToolsFlows {

    static findUnusedFlows(skipAutoSave = true): void {
        let bildrCache = BildrCacheHelper.createInstance();
        const activeForms = nameSort(bildrCache.activeForms);

        // create "header" for the results
        console.log(`Checking ${bildrCache.activeFlows.length} flows.`);
        console.log("You'll see 'That's it!' when checking is finished.");
        console.log("");
        if (skipAutoSave) {
            console.log("Looking for Unused flows (skipping unused 'Auto Save')");
        } else {
            console.log("Looking for All unused flows");
        }
        console.log("");

        activeForms.forEach(form => {
            // actions in form.actions are not marked as deleted
            let formNameLogged = false;
            nameSort(form.ActiveFlows).forEach(flow => {
                if (skipAutoSave && flow.name.includes("Auto Save")) { return; }

                if (BildrToolsFlows.findUsageOfFlow(flow.id, false) == false) {
                    if (!formNameLogged) {
                        formNameLogged = true;
                        console.log("Form : " + form.name);
                    }
                    console.log("  Flow : " + flow.name);
                }
            });
        });
        console.log("");
        console.log("THAT'S IT!");
    }

    static findUsageOfFlow(flowId: actId, logToConsole: boolean = true): boolean {
        let bildrCache = BildrCacheHelper.createInstance();
        const strFlowId = flowId.toString();

        // for easy reference
        let isUsed = false;
        function ConsoleLog(text: string) {
            if (logToConsole) { console.log(text); }
        }

        // Create "Header" for the results
        let flow = bildrCache.activeFlows.find(flow => { return (flow.id == flowId); });
        // found it
        if (flow) {
            if (flow.Form) {
                ConsoleLog(`Flow "${flow.name}" on form "${flow.Form.name}" is called by:`);
            } else {
                ConsoleLog(`Couldn't find form for flowID ${flowId} in project!`)
            }
            ConsoleLog("");
        } else {
            ConsoleLog(`Couldn't find flowID ${flowId} in project!`);
            return false;
        }

        // check flow usage per active form
        bildrCache.activeForms.forEach(form => {
            let formNameLogged = false;
            // Check usage of Flow in Actions of Form.Flows         
            nameSort(form.ActiveFlows).forEach(flow => {
                flow.Actions.forEach(action => {
                    // as nested flow?
                    let asNestedFlow = action.id.toString().endsWith(strFlowId);
                    if (asNestedFlow) {
                        isUsed = true;
                        if (!formNameLogged) {
                            formNameLogged = true;
                            ConsoleLog("Form : " + form.name);
                        }
                        ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                        ConsoleLog("    as nested flow");
                    } else
                    // or referenced by an action type argument
                    {
                        action.Arguments.forEach(arg => {
                            if (arg.type == "static.actions") {
                                let argumentStatic = arg as actionArgumentStaticActions

                                if (argumentStatic.value.endsWith(strFlowId)) {
                                    isUsed = true;
                                    if (!formNameLogged) {
                                        formNameLogged = true;
                                        ConsoleLog("Form : " + form.name);
                                    }
                                    ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                                    ConsoleLog("    Action : " + action.name);
                                }
                            }
                        })
                    }
                })
            })

            nameSort(form.ActiveElements).forEach(element => {
                let eventsUsingFlow = element.opts.events.filter(item => { return item.actID && item.actID.toString().endsWith(strFlowId); });
                eventsUsingFlow.forEach(theEvent => {
                    isUsed = true;
                    if (!formNameLogged) {
                        formNameLogged = true;
                        ConsoleLog("Form : " + form.name);
                    }
                    ConsoleLog("  Element : " + element.name);
                    ConsoleLog("    Event : " + theEvent.code);
                });
            });

            // Check usage of flow in Page Events (Page Flows and Root Page Flows attributes)
            let inPageEvents = [];
            // Page Flows
            if (form.opts.autoSaveActionID?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Auto-Save Flow");
            }
            if (form.opts.onLoadAct?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Page Load Flow");
            }
            // Root Page Flows
            if (form.opts.notConnectedActID?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to run when connection is lost");
            }
            if (form.opts.reConnectedActID?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to run when connection is re-established");
            }
            if (form.opts.notAuthenticatedActID?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to run when authentication is lost");
            }
            if (form.opts.newRevisionActID?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to Run When Revision is Out of Date");
            }
            if (inPageEvents.length > 0) {
                isUsed = true;
                ConsoleLog("Form : " + form.name);
                ConsoleLog("  Element : Page Body");
                inPageEvents.forEach(theEvent => {
                    ConsoleLog("    Event : " + theEvent);
                });
            }

            if (form.opts.resonanceDataListeners) {
                let dataListenersUsingFlow = form.opts.resonanceDataListeners.filter(item => { return item.actID && item.actID.toString().endsWith(strFlowId); });
                if (dataListenersUsingFlow.length > 0) {
                    isUsed = true;
                    ConsoleLog("Form : " + form.name);
                    ConsoleLog("  Element : Page Body");
                    ConsoleLog(`    Used by ${dataListenersUsingFlow.length} Data Listener(s)`);
                }
            }
        });
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");

        return isUsed;
    }

    static findUsageOfDeletedFlows(): void {
        let bildrCache = BildrCacheHelper.createInstance();
        // for easy reference

        function isDeletedFlow(flowId: actId) {
            return bildrCache.deletedFlows.find(item => item.id.toString().endsWith(flowId.toString())) != undefined;
        }

        // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument
        bildrCache.activeFlows.forEach(flow => {
            if (flow.opts && flow.opts.arguments) {
                let actionsArray = flow.opts.arguments.find(item => { return item.name == "actionsArray" });
                if (actionsArray) {
                    let argumentStaticArray = actionsArray as actionArgumentActionsArray
                    argumentStaticArray.value?.forEach(actionRef => {
                        // Nested flow?
                        if (actionRef.id && isDeletedFlow(actionRef.id)) {
                            let form = bildrCache.forms.find(item => { return item.id == flow.formID });
                            if (form) {
                                console.log(`Form : ${form.name}`);
                                console.log(`  Flow : ${flow.name} (id: ${flow.id})`);
                                const deletedFlowName = bildrCache.deletedFlows.find(item => item && item.id.toString().endsWith(actionRef.id.toString()))
                                console.log("    as nested flow : " + deletedFlowName ? deletedFlowName : actionRef.id);
                            }
                        } else {
                            let action = bildrCache.actions.find(item => { return (item.id == actionRef.id) });

                            if (action && action.opts && action.opts.arguments) {
                                let hasFlowRef = action.opts.arguments.find(arg => {
                                    return (arg.type && arg.type == "static.actions" && (arg as actionArgumentStaticActions).value && isDeletedFlow((arg as actionArgumentStaticActions).value));
                                })
                                if (hasFlowRef) {
                                    let form = bildrCache.forms.find(item => { return item.id == flow.formID });
                                    if (form) {
                                        console.log(`Form : ${form.name}`);
                                        console.log(`  Flow : ${flow.name} (id: ${flow.id})`);
                                        console.log(`    Action : ${action.name}`);
                                    }
                                }
                            }
                        }
                    })
                };
            };
        });
        // Check usage of flow in Page Events (Page Flows and Root Page Flows attributes)
        bildrCache.activeForms.forEach(form => {
            // Flatten active elements because the elements don't get flagged as deleted although 
            // they are nog part of the form any more. Checks should only be done on active
            // elements.
            var objsTreeFlattend = Array<element>();

            function flattenElements(items: element[] | undefined) {
                if (items != undefined) {
                    items.forEach(item => {
                        flattenElements(item.items)
                        objsTreeFlattend.push(item);
                    })
                }
            }

            flattenElements(form.objsTree);

            // Check usage of flow in Elements Events
            nameSort(objsTreeFlattend).forEach(element => {
                if (element.opts && element.opts.events) {
                    let eventsUsingFlow = element.opts.events.filter(item => { return item.actID && isDeletedFlow(item.actID) });
                    eventsUsingFlow.forEach(theEvent => {
                        let form = bildrCache.forms.find(item => { return item.id == element.formID });
                        if (form) {
                            console.log("Form : " + form.name);
                            console.log("  Element : " + element.name);
                            console.log("    Event : " + theEvent.code);
                        }
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

    static getFlowWithActions(flowId: string): void {
        let cache = BildrCacheHelper.createInstance();
        let flow = cache.activeFlows.find(flow => {
            return (flow.id && flow.id.toString() == flowId);
        });

        if (flow == undefined) {
            console.log("flow not found");
            return;
        }

        console.log("Flow found:");
        console.log(flow);
        console.log("Actions:");

        if (flow.opts && flow.opts.arguments) {
            let actionsArray = flow.opts.arguments.find(item => { return item.name == "actionsArray"; });
            if (actionsArray) {
                let argumentActionsArray = actionsArray as actionArgumentActionsArray;
                argumentActionsArray.value?.forEach(actionRef => {
                    // Used in an argument of an action type?
                    let action = cache.actions.find(item => { return (item.id.toString() == actionRef.id.toString()); });

                    if (action) {
                        console.log(action);
                    }
                })
            };
        }
    }
}
