import { ActionHelper, BildrCacheHelper, ConsoleLog, FlowHelper, nameSort, PageHelper } from "./Helpers";

/**
 * @public
 */
export class BildrToolsActions {
    /**
     * Search in the actions for use of path on Variables and Elements
     * 
     * @param path - any string text. Use * to list all actions that have a path
     * @param exactMatch - should it match exactly. default = false
     */
    static findInPath(path: string, exactMatch: boolean = false): void {
        let bildrCache = BildrCacheHelper.createInstance();
        path = path.trim();

        // setup the matcher
        let matcher = (value: string) => value.includes(path);
        if (exactMatch) {
            matcher = (value: string) => value == path;
        }
        if (path == "*") {
            matcher = (value: string) => value.length > 0;
        }

        // Create "Header" for the results
        ConsoleLog(`Path ${path} with exact match = ${exactMatch} is called by:`);
        ConsoleLog("");

        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            let logPageName = true;

            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            nameSort(page.ActiveFlows).forEach(flow => {
                let logFlowName = true;
                flow.Actions.forEach(action => {
                    action.Arguments.forEach(arg => {
                        // check usage path on variable or element argument
                        checkVariableOrElementPathUsage(arg);

                        // Check usage of path in Data Collection filters
                        if (arg.argumentType == "filterset") {
                            let argFilterset = arg as actionArgumentFilterset;
                            argFilterset.filters?.forEach(filter => {
                                filter.fieldsToFilterArray.forEach(field => {
                                    field.valueToFilterWith.forEach(value => {
                                        checkVariableOrElementPathUsage(value)
                                    })
                                })
                            });
                        }

                        function checkVariableOrElementPathUsage(arg: actionArgument): void {
                            if (arg.argumentType == "variable") {
                                let argVariable = arg as actionArgumentVariable;
                                // "value": "vars.Test.name.reverseString()",
                                // strip vars.Test. to have the whole path
                                // value contains the combination of variablename and path
                                // since there is no actual need to use path separately in
                                // the Bildr UI (can also be add the the variablename field)
                                let path = argVariable.value;
                                if (!path || path.length < 5) return;

                                let stripTill = path.indexOf(".", 5)
                                if (stripTill < 0) return;

                                path = path.slice(stripTill + 1);

                                if (matcher(path)) {
                                    logPageName = ConsoleLog("Page : " + page.name, logPageName);
                                    logFlowName = ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`, logFlowName);
                                    ConsoleLog("    Action : " + action.name);
                                    if (path == "*" || exactMatch == false)
                                        ConsoleLog("      Path : " + path);
                                }
                            }
                            if (arg.argumentType == "element") {
                                let argVariable = arg as actionArgumentElement;
                                if (argVariable.path && matcher(argVariable.path)) {
                                    logPageName = ConsoleLog("Page : " + page.name, logPageName);
                                    logFlowName = ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`, logFlowName);
                                    ConsoleLog("    Action : " + action.name);
                                    if (path == "*" || exactMatch == false)
                                        ConsoleLog("      Path : " + argVariable.path);
                                }
                            }
                        }
                    });
                });
            });
        })
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");
    }
    /**
     * Find where variable(s) are used
     * 
     * @param variableName - The (partial) name of the variable. Use * to show all variable ussage
     * @param setValue - Show where the variable gets set
     * @param readValue - Show where the variable is read
     * @param exactMatch - Default true, if partial search is required set it to false
     */
    static findVariable(variableName: string, setValue: boolean = true, readValue: boolean = true, exactMatch: boolean = true): void {
        let bildrCache = BildrCacheHelper.createInstance();
        variableName = variableName.trim();

        // setup the matcher
        let matcher = (value: string) => { return value.includes(variableName) };
        if (exactMatch) {
            matcher = (value: string) => value == variableName;
        }
        if (variableName == "*") {
            matcher = (value: string) => true;
        }

        let ConsoleLog = (text: string, logIt: boolean = true): boolean => {
            if (logIt) console.log(text);
            return true;
        };

        // Create "Header" for the results
        ConsoleLog(`Variable ${variableName} with exact match = ${exactMatch} is used here:`);
        ConsoleLog("");

        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            let logPageName = true;
            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            nameSort(page.ActiveFlows).forEach(flow => {
                let logFlowName = true;
                flow.Actions.forEach(action => {
                    action.Arguments.forEach(arg => {
                        if (setValue && arg.argumentType == "static.text" && arg.thisIsAVariableName == true) {
                            let argVariable = arg as actionArgumentStaticText;
                            if (argVariable.value && matcher(argVariable.value)) {
                                logPageName = ConsoleLog("Page : " + page.name, logPageName);
                                logFlowName = ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`, logFlowName);
                                ConsoleLog("    Set in Action : " + action.name);
                                if (variableName == "*") ConsoleLog("      Variable : " + argVariable.value);
                            }
                        }

                        if (readValue) {
                            ({ pageNameLogged: logPageName, flowNameLogged: logFlowName } = handleArgVariable(arg, action, logPageName, page, logFlowName, flow));
                        }

                        // Check usage of variable in Data Collection filters
                        if (readValue && arg.argumentType == "filterset") {
                            let argFilterset = arg as actionArgumentFilterset;
                            argFilterset.filters?.forEach(filter => {
                                filter.fieldsToFilterArray.forEach(field => {
                                    field.valueToFilterWith.forEach(value => {
                                        ({ pageNameLogged: logPageName, flowNameLogged: logFlowName } = handleArgVariable(value, action, logPageName, page, logFlowName, flow));
                                    })
                                })
                            });
                        }
                    });
                });
            });
        })
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");

        function handleArgVariable(arg: actionArgument, action: ActionHelper, pageNameLogged: boolean, page: PageHelper, flowNameLogged: boolean, flow: FlowHelper) {
            if (arg.argumentType == "variable") {
                let argVariable = arg as actionArgumentVariable;
                if (argVariable.variableName && matcher(argVariable.variableName)) {

                    pageNameLogged = ConsoleLog("Page : " + page.name, pageNameLogged);
                    flowNameLogged = ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`, flowNameLogged);
                    ConsoleLog("    Used in Action : " + action.name);
                    if (variableName == "*") ConsoleLog("      Variable : " + argVariable.variableName);
                }
            }
            return { pageNameLogged, flowNameLogged };
        }
    }
}


