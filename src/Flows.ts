import { BildrCacheHelper, ConsoleLog, nameSort } from "./Helpers";

/**
 * @public
 */
export class BildrToolsFlows {

    static findUnusedFlows(skipAutoSave = true): void {
        let bildrCache = BildrCacheHelper.createInstance();
        const activePages = nameSort(bildrCache.activePages);

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

        activePages.forEach(page => {
            let logPageName = true;
            nameSort(page.ActiveFlows).forEach(flow => {
                if (skipAutoSave && flow.name.includes("Auto Save")) { return; }

                if (BildrToolsFlows.findUsageOfFlow(flow.id, false) == false) {
                    logPageName = ConsoleLog("Page : " + page.name, logPageName);
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

        // Create "Header" for the results
        let flow = bildrCache.activeFlows.find(flow => { return (flow.id == flowId); });
        // found it
        if (flow) {
            if (flow.Page) {
                ConsoleLog(`Flow "${flow.name}" on page "${flow.Page.name}" is called by:`, logToConsole);
            } else {
                ConsoleLog(`Couldn't find page for flowID ${flowId} in project!`, logToConsole)
            }
            ConsoleLog("", logToConsole);
        } else {
            ConsoleLog(`Couldn't find flowID ${flowId} in project!`, logToConsole);
            return false;
        }

        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            let logPageName = logToConsole;
            // Check usage of Flow in Actions of page.Flows         
            nameSort(page.ActiveFlows).forEach(flow => {
                flow.Actions.forEach(action => {
                    // as nested flow?
                    let asNestedFlow = action.id.toString().endsWith(strFlowId);
                    if (asNestedFlow) {
                        isUsed = true;
                        logPageName = ConsoleLog("Page : " + page.name, logPageName);
                        ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`, logToConsole);
                        ConsoleLog("    as nested flow", logToConsole);
                    } else
                    // or referenced by an action type argument
                    {
                        action.Arguments.forEach(arg => {
                            if (arg.argumentType == "static.actions") {
                                let argumentStatic = arg as actionArgumentStaticActions
                                if (argumentStatic.type == "static.actions" && argumentStatic.value?.endsWith(strFlowId)) {
                                    isUsed = true;
                                    logPageName = ConsoleLog("Page : " + page.name, logPageName);
                                    ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`, logToConsole);
                                    ConsoleLog("    Action : " + action.name, logToConsole);
                                }
                            }
                        })
                    }
                })
            })

            nameSort(page.ActiveElements).forEach(element => {
                let logElement = logToConsole;
                let eventsUsingFlow = element.opts.events.filter(item => { return item.actID && item.actID.toString().endsWith(strFlowId); });
                eventsUsingFlow.forEach(theEvent => {
                    isUsed = true;
                    logPageName = ConsoleLog("Page : " + page.name, logPageName);

                    logElement = ConsoleLog("  Element : " + element.name, logElement);
                    ConsoleLog("    Event : " + theEvent.code, logToConsole);
                });
            });

            // Check usage of flow in Page Events (Page Flows and Root Page Flows attributes)
            let inPageEvents = [];
            // Page Flows
            if (page.opts.autoSaveActionID?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Auto-Save Flow");
            }
            if (page.opts.onLoadAct?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Page Load Flow");
            }
            // Root Page Flows
            if (page.opts.notConnectedActID?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to run when connection is lost");
            }
            if (page.opts.reConnectedActID?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to run when connection is re-established");
            }
            if (page.opts.notAuthenticatedActID?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to run when authentication is lost");
            }
            if (page.opts.newRevisionActID?.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to Run When Revision is Out of Date");
            }
            if (inPageEvents.length > 0) {
                isUsed = true;
                logPageName = ConsoleLog("Page : " + page.name, logPageName);
                ConsoleLog("  Element : Page Body", logToConsole);
                inPageEvents.forEach(theEvent => {
                    ConsoleLog("    Event : " + theEvent, logToConsole);
                });
            }

            if (page.opts.resonanceDataListeners) {
                let dataListenersUsingFlow = page.opts.resonanceDataListeners.filter(item => { return item.actID && item.actID.toString().endsWith(strFlowId); });
                if (dataListenersUsingFlow.length > 0) {
                    isUsed = true;
                    logPageName = ConsoleLog("Page : " + page.name, logPageName);
                    ConsoleLog("  Element : Page Body", logToConsole);
                    ConsoleLog(`    Used by ${dataListenersUsingFlow.length} Data Listener(s)`, logToConsole);
                }
            }
        });
        ConsoleLog("", logToConsole);
        ConsoleLog("THAT'S IT!", logToConsole);

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
                            let page = bildrCache.pages.find(item => { return item.id == flow.formID });
                            if (page) {
                                console.log(`Page : ${page.name}`);
                                console.log(`  Flow : ${flow.name} (id: ${flow.id})`);
                                const deletedFlowName = bildrCache.deletedFlows.find(item => item && item.id.toString().endsWith(actionRef.id.toString()))
                                console.log("    as nested flow : " + deletedFlowName ? deletedFlowName : actionRef.id);
                            }
                        } else {
                            let action = bildrCache.actions.find(item => { return (item.id == actionRef.id) });

                            if (action && action.opts && action.opts.arguments) {
                                let hasFlowRef = action.opts.arguments.find(arg => {
                                    return (arg.argumentType == "static.actions" && (arg as actionArgumentStaticActions).value && isDeletedFlow((arg as actionArgumentStaticActions).value!));
                                })
                                if (hasFlowRef) {
                                    let page = bildrCache.pages.find(item => { return item.id == flow.formID });
                                    if (page) {
                                        console.log(`Page : ${page.name}`);
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
        bildrCache.activePages.forEach(page => {
            // Flatten active elements because the elements don't get flagged as deleted although 
            // they are nog part of the page any more. Checks should only be done on active
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

            flattenElements(page.objsTree);

            // Check usage of flow in Elements Events
            nameSort(objsTreeFlattend).forEach(element => {
                if (element.opts && element.opts.events) {
                    let eventsUsingFlow = element.opts.events.filter(item => { return item.actID && isDeletedFlow(item.actID) });
                    eventsUsingFlow.forEach(theEvent => {
                        let page = bildrCache.pages.find(item => { return item.id == element.formID });
                        if (page) {
                            console.log("Page : " + page.name);
                            console.log("  Element : " + element.name);
                            console.log("    Event : " + theEvent.code);
                        }
                    })
                }
            });


            let inPageEvents = []
            if (page.opts) {
                // Page Flows
                if (page.opts.autoSaveActionID && isDeletedFlow(page.opts.autoSaveActionID)) {
                    inPageEvents.push("Auto-Save Flow");
                }
                if (page.opts.onLoadAct && isDeletedFlow(page.opts.onLoadAct)) {
                    inPageEvents.push("Page Load Flow");
                }
                // Root Page Flows
                if (page.opts.notConnectedActID && isDeletedFlow(page.opts.notConnectedActID)) {
                    inPageEvents.push("Flow to run when connection is lost");
                }
                if (page.opts.reConnectedActID && isDeletedFlow(page.opts.reConnectedActID)) {
                    inPageEvents.push("Flow to run when connection is re-established");
                }
                if (page.opts.notAuthenticatedActID && isDeletedFlow(page.opts.notAuthenticatedActID)) {
                    inPageEvents.push("Flow to run when authentication is lost");
                }
                if (page.opts.newRevisionActID && isDeletedFlow(page.opts.newRevisionActID)) {
                    inPageEvents.push("Flow to Run When Revision is Out of Date");
                }
                if (inPageEvents.length > 0) {
                    console.log("Page : " + page.name);
                    console.log("  Element : Page Body");
                    inPageEvents.forEach(theEvent => {
                        console.log("    Event : " + theEvent);
                    })
                }

                if (page.opts.resonanceDataListeners) {
                    let dataListenersUsingFlow = page.opts.resonanceDataListeners.filter(item => { return item.actID && isDeletedFlow(item.actID) });
                    if (dataListenersUsingFlow.length > 0) {
                        console.log("Page : " + page.name);
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
