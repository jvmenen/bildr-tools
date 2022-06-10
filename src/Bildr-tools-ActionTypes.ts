import { BildrCacheHelper, nameSort } from "./Bildr-tools-helpers";

export class BildrToolsActionTypes {
    static findUsage(actionTypeId: string): void {
        let bildrCache = BildrCacheHelper.createInstance();
        let logToConsole = true;

        function ConsoleLog(text: string) {
            if (logToConsole) { console.log(text); }
        }

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

        // check flow usage per active form
        bildrCache.activeForms.forEach(form => {
            let formNameLogged = false;

            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            nameSort(form.activeFlows).forEach(flow => {
                flow.actions.forEach(action => {
                    if (action.type == actionTypeId) {
                        if (!formNameLogged) {
                            formNameLogged = true;
                            ConsoleLog("Form : " + form.name);
                        }
                        ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                        ConsoleLog("    Action : " + action.name);
                    }
                });
            });
        });
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");
    }
}


