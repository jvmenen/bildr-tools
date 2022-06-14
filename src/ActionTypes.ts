import { BildrCacheHelper, ConsoleLog, nameSort } from "./Helpers";

export class BildrToolsActionTypes {
    static findUsage(actionTypeId: string): void {
        let bildrCache = BildrCacheHelper.createInstance();
        let logToConsole = true;

        // Create "Header" for the results
        let theActionType = bildrCache.actionTypes.find(acT => { return (acT.id == actionTypeId); });
        // found it
        if (theActionType) {
            ConsoleLog(`Action Type "${theActionType.name}" is called by:`);
            ConsoleLog("");
        } else {
            ConsoleLog(`Couldn't find Action Type ${actionTypeId} in project!`);
            return;
        }

        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            let logPageName = true;

            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            nameSort(page.ActiveFlows).forEach(flow => {
                flow.Actions.forEach(action => {
                    let logFlowName = true
                    if (action.type == actionTypeId) {
                        logPageName = ConsoleLog("Page : " + page.name, logPageName);
                        logFlowName = ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`, logFlowName);
                        ConsoleLog("    Action : " + action.name);
                    }
                });
            });
        });
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");
    }
}


