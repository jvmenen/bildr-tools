import { BildrCacheHelper, nameSort } from "./Helpers";

export class BildrToolsActions {
    /**
     * Search in the actions for use of path on Variables and Elements
     * @param path any string text. Use * to list all actions that have a path
     * @param exactMatch should it match exactly. default = false
     */
    static findInPath(path: string, exactMatch: boolean = false): void {
        let bildrCache = BildrCacheHelper.createInstance();

        // setup the matcher
        let matcher = (value: string) => value.includes(path);
        if (exactMatch) {
            matcher = (value: string) => value == path;
        }
        if (path.trim() == "*") {
            matcher = (value: string) => true;
        }

        let ConsoleLog = (text: string) => console.log(text);

        // Create "Header" for the results
        ConsoleLog(`Path ${path} with exact match = ${exactMatch} is called by:`);
        ConsoleLog("");

        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            let pageNameLogged = false;

            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            nameSort(page.ActiveFlows).forEach(flow => {
                flow.Actions.forEach(action => {
                    action.Arguments.forEach(arg => {
                        if (arg.argumentType != "variable" && arg.argumentType != "element") return;

                        let argVariable = arg as actionArgumentVariable;
                        if (argVariable.path && matcher(argVariable.path)) {
                            if (!pageNameLogged) {
                                pageNameLogged = true;
                                ConsoleLog("Page : " + page.name);
                            }
                            ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                            ConsoleLog("    Action : " + action.name);
                            ConsoleLog("      Path : " + argVariable.path);
                        }
                    });
                });
            });
        })
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");
    }
    static findVariable(variableName: string, exactMatch: boolean = false): void {
        let bildrCache = BildrCacheHelper.createInstance();

        // setup the matcher
        let matcher = (value: string) => value.includes(variableName);
        if (exactMatch) {
            matcher = (value: string) => value == variableName;
        }
        if (variableName.trim() == "*") {
            matcher = (value: string) => true;
        }

        let ConsoleLog = (text: string) => console.log(text);

        // Create "Header" for the results
        ConsoleLog(`Variable ${variableName} with exact match = ${exactMatch} is used here:`);
        ConsoleLog("");

        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            let pageNameLogged = false;

            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            nameSort(page.ActiveFlows).forEach(flow => {
                let pageNameLogged = false;
                flow.Actions.forEach(action => {
                    action.Arguments.forEach(arg => {
                        if (arg.argumentType == "variable") {
                            let argVariable = arg as actionArgumentVariable;
                            if (matcher(argVariable.variableName)) {
                                if (!pageNameLogged) {
                                    pageNameLogged = true;
                                    ConsoleLog("Page : " + page.name);
                                }
                                if (!pageNameLogged) {
                                    pageNameLogged = true;
                                    ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                                }
                                ConsoleLog("    Used in Action : " + action.name);
                                ConsoleLog("      Variable : " + argVariable.variableName);
                            }
                        }
                        if (arg.argumentType == "static.text") {
                            let argVariable = arg as actionArgumentStaticText;
                            if (matcher(argVariable.value)) {
                                if (!pageNameLogged) {
                                    pageNameLogged = true;
                                    ConsoleLog("Page : " + page.name);
                                }
                                if (!pageNameLogged) {
                                    pageNameLogged = true;
                                    ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                                }
                                ConsoleLog("    Set in Action : " + action.name);
                                ConsoleLog("      Variable : " + argVariable.value);
                            }
                        }
                    });
                });
            });
        })
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");
    }
}


