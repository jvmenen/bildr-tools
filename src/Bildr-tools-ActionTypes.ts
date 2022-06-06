import { BildrCacheHelper, nameSort } from "./Bildr-tools-utils";

export const BildrToolsActionTypes = {
    findUsage: (actionTypeId: string) => {
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
            return false;
        }

        // check flow usage per active form
        bildrCache.activeForms.forEach(form => {

            if (!form.actions) { return; }

            // actions in form.actions are not marked as deleted
            let activeFlows = bildrCache.activeFlowsGroupedByFormID[form.id];
            if (!activeFlows) { return; }

            let formNameLogged = false;
            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            nameSort(activeFlows).forEach((flow) => {
                if (flow.opts && flow.opts.arguments) {
                    let actionsArray = flow.opts.arguments.find((item) => { return item.name == "actionsArray"; });
                    if (!actionsArray) { return }
                    
                    let argActionArray = actionsArray as actionArgumentActionsArray
                    argActionArray.value?.forEach(actionRef => {
                        // Used in an argument of an action type?
                        let action = bildrCache.actions.find(item => { return (item.id == actionRef.id); });

                        if (action && action.type && action.type == actionTypeId) {
                            if (!formNameLogged) {
                                formNameLogged = true;
                                ConsoleLog("Form : " + form.name);
                            }
                            ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                            ConsoleLog("    Action : " + action.name);
                        }
                    });
                }
            });
        });
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");
    }
}


