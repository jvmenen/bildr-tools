import { ActionHelper, BildrCacheHelper, FlowHelper, nameSort, PageHelper } from "./Helpers";

export class BildrToolsActions {
    /**
     * Search in the actions for use of path on Variables and Elements
     * @param path any string text. Use * to list all actions that have a path
     * @param exactMatch should it match exactly. default = false
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
                            if (path == "*" || exactMatch == false) ConsoleLog("      Path : " + argVariable.path);
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
     * @param variableName The (partial) name of the variable. Use * to show all variable ussage
     * @param setValue Show where the variable gets set
     * @param readValue Show where the variable is read
     * @param exactMatch Default true, if partial search is required set it to false
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

        let ConsoleLog = (text: string) => console.log(text);

        // Create "Header" for the results
        ConsoleLog(`Variable ${variableName} with exact match = ${exactMatch} is used here:`);
        ConsoleLog("");

        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            let pageNameLogged = false;
            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            nameSort(page.ActiveFlows).forEach(flow => {
                let flowNameLogged = false;
                flow.Actions.forEach(action => {
                    action.Arguments.forEach(arg => {
                        if (setValue && arg.argumentType == "static.text" && arg.thisIsAVariableName == true) {
                            let argVariable = arg as actionArgumentStaticText;
                            if (argVariable.value && matcher(argVariable.value)) {
                                if (!pageNameLogged) {
                                    pageNameLogged = true;
                                    ConsoleLog("Page : " + page.name);
                                }
                                if (!flowNameLogged) {
                                    flowNameLogged = true;
                                    ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                                }
                                ConsoleLog("    Set in Action : " + action.name);
                                if (variableName == "*") ConsoleLog("      Variable : " + argVariable.value);
                            }
                        }

                        if (readValue) {
                            ({ pageNameLogged, flowNameLogged } = handleArgVariable(arg, action, pageNameLogged, page, flowNameLogged, flow));
                        }

                        if (readValue && arg.argumentType == "filterset") {
                            let argFilterset = arg as actionArgumentFilterset;
                            argFilterset.filters?.forEach(filter => {
                                filter.fieldsToFilterArray.forEach(field => {
                                    field.valueToFilterWith.forEach(value => {
                                        ({ pageNameLogged, flowNameLogged } = handleArgVariable(value, action, pageNameLogged, page, flowNameLogged, flow));
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

                    if (!pageNameLogged) {
                        pageNameLogged = true;
                        ConsoleLog("Page : " + page.name);
                    }
                    if (!flowNameLogged) {
                        flowNameLogged = true;
                        ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                    }
                    ConsoleLog("    Used in Action : " + action.name);
                    if (variableName == "*") ConsoleLog("      Variable : " + argVariable.variableName);
                }
            }
            return { pageNameLogged, flowNameLogged };
        }
    }
}


