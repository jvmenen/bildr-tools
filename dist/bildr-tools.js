/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ActionTypes.ts":
/*!****************************!*\
  !*** ./src/ActionTypes.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrToolsActionTypes": () => (/* binding */ BildrToolsActionTypes)
/* harmony export */ });
/* harmony import */ var _Helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Helpers */ "./src/Helpers.ts");

class BildrToolsActionTypes {
    static findUsage(actionTypeId) {
        let bildrCache = _Helpers__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
        let logToConsole = true;
        function ConsoleLog(text) {
            if (logToConsole) {
                console.log(text);
            }
        }
        // Create "Header" for the results
        let theActionType = bildrCache.actionTypes.find(acT => { return (acT.id == actionTypeId); });
        // found it
        if (theActionType) {
            ConsoleLog(`Action Type "${theActionType.name}" is called by:`);
            ConsoleLog("");
        }
        else {
            ConsoleLog(`Couldn't find Action Type ${actionTypeId} in project!`);
            return;
        }
        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            let pageNameLogged = false;
            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            (0,_Helpers__WEBPACK_IMPORTED_MODULE_0__.nameSort)(page.ActiveFlows).forEach(flow => {
                flow.Actions.forEach(action => {
                    if (action.type == actionTypeId) {
                        if (!pageNameLogged) {
                            pageNameLogged = true;
                            ConsoleLog("Page : " + page.name);
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


/***/ }),

/***/ "./src/Actions.ts":
/*!************************!*\
  !*** ./src/Actions.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrToolsActions": () => (/* binding */ BildrToolsActions)
/* harmony export */ });
/* harmony import */ var _Helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Helpers */ "./src/Helpers.ts");

class BildrToolsActions {
    /**
     * Search in the actions for use of path on Variables and Elements
     * @param path any string text. Use * to list all actions that have a path
     * @param exactMatch should it match exactly. default = false
     */
    static findInPath(path, exactMatch = false) {
        let bildrCache = _Helpers__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
        path = path.trim();
        // setup the matcher
        let matcher = (value) => value.includes(path);
        if (exactMatch) {
            matcher = (value) => value == path;
        }
        if (path == "*") {
            matcher = (value) => true;
        }
        let ConsoleLog = (text) => console.log(text);
        // Create "Header" for the results
        ConsoleLog(`Path ${path} with exact match = ${exactMatch} is called by:`);
        ConsoleLog("");
        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            let pageNameLogged = false;
            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            (0,_Helpers__WEBPACK_IMPORTED_MODULE_0__.nameSort)(page.ActiveFlows).forEach(flow => {
                let flowNameLogged = false;
                flow.Actions.forEach(action => {
                    action.Arguments.forEach(arg => {
                        var _a;
                        // check usage path on variable or element argument
                        checkVariableOrElementPathUsage(arg);
                        // Check usage of path in Data Collection filters
                        if (arg.argumentType == "filterset") {
                            let argFilterset = arg;
                            (_a = argFilterset.filters) === null || _a === void 0 ? void 0 : _a.forEach(filter => {
                                filter.fieldsToFilterArray.forEach(field => {
                                    field.valueToFilterWith.forEach(value => {
                                        checkVariableOrElementPathUsage(value);
                                    });
                                });
                            });
                        }
                        function checkVariableOrElementPathUsage(arg) {
                            if (arg.argumentType == "variable") {
                                let argVariable = arg;
                                // "value": "vars.Test.name.reverseString()",
                                // strip vars.Test. to have the whole path
                                // value contains the combination of variablename and path
                                // since there is no actual need to use path separately in
                                // the Bildr UI (can also be add the the variablename field)
                                let path = argVariable.value;
                                if (!path || path.length < 5)
                                    return;
                                let stripTill = path.indexOf(".", 5);
                                path = path.slice(stripTill + 1);
                                if (matcher(path)) {
                                    if (!pageNameLogged) {
                                        pageNameLogged = true;
                                        ConsoleLog("Page : " + page.name);
                                    }
                                    if (!flowNameLogged) {
                                        flowNameLogged = true;
                                        ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                                    }
                                    ConsoleLog("    Action : " + action.name);
                                    if (path == "*" || exactMatch == false)
                                        ConsoleLog("      Path : " + argVariable.value.slice(5));
                                }
                            }
                            if (arg.argumentType == "element") {
                                let argVariable = arg;
                                if (argVariable.path && matcher(argVariable.path)) {
                                    if (!pageNameLogged) {
                                        pageNameLogged = true;
                                        ConsoleLog("Page : " + page.name);
                                    }
                                    if (!flowNameLogged) {
                                        flowNameLogged = true;
                                        ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                                    }
                                    ConsoleLog("    Action : " + action.name);
                                    if (path == "*" || exactMatch == false)
                                        ConsoleLog("      Path : " + argVariable.path);
                                }
                            }
                        }
                    });
                });
            });
        });
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
    static findVariable(variableName, setValue = true, readValue = true, exactMatch = true) {
        let bildrCache = _Helpers__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
        variableName = variableName.trim();
        // setup the matcher
        let matcher = (value) => { return value.includes(variableName); };
        if (exactMatch) {
            matcher = (value) => value == variableName;
        }
        if (variableName == "*") {
            matcher = (value) => true;
        }
        let ConsoleLog = (text) => console.log(text);
        // Create "Header" for the results
        ConsoleLog(`Variable ${variableName} with exact match = ${exactMatch} is used here:`);
        ConsoleLog("");
        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            let pageNameLogged = false;
            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            (0,_Helpers__WEBPACK_IMPORTED_MODULE_0__.nameSort)(page.ActiveFlows).forEach(flow => {
                let flowNameLogged = false;
                flow.Actions.forEach(action => {
                    action.Arguments.forEach(arg => {
                        var _a;
                        if (setValue && arg.argumentType == "static.text" && arg.thisIsAVariableName == true) {
                            let argVariable = arg;
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
                                if (variableName == "*")
                                    ConsoleLog("      Variable : " + argVariable.value);
                            }
                        }
                        if (readValue) {
                            ({ pageNameLogged, flowNameLogged } = handleArgVariable(arg, action, pageNameLogged, page, flowNameLogged, flow));
                        }
                        // Check usage of variable in Data Collection filters
                        if (readValue && arg.argumentType == "filterset") {
                            let argFilterset = arg;
                            (_a = argFilterset.filters) === null || _a === void 0 ? void 0 : _a.forEach(filter => {
                                filter.fieldsToFilterArray.forEach(field => {
                                    field.valueToFilterWith.forEach(value => {
                                        ({ pageNameLogged, flowNameLogged } = handleArgVariable(value, action, pageNameLogged, page, flowNameLogged, flow));
                                    });
                                });
                            });
                        }
                    });
                });
            });
        });
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");
        function handleArgVariable(arg, action, pageNameLogged, page, flowNameLogged, flow) {
            if (arg.argumentType == "variable") {
                let argVariable = arg;
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
                    if (variableName == "*")
                        ConsoleLog("      Variable : " + argVariable.variableName);
                }
            }
            return { pageNameLogged, flowNameLogged };
        }
    }
}


/***/ }),

/***/ "./src/Debug.ts":
/*!**********************!*\
  !*** ./src/Debug.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionsToShowEnum": () => (/* binding */ ActionsToShowEnum),
/* harmony export */   "BildrToolsDebug": () => (/* binding */ BildrToolsDebug)
/* harmony export */ });
/* harmony import */ var _Helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Helpers */ "./src/Helpers.ts");

// If you want both Flows and actions use: Flows | Actions
var ActionsToShowEnum;
(function (ActionsToShowEnum) {
    ActionsToShowEnum[ActionsToShowEnum["Flows"] = 1] = "Flows";
    ActionsToShowEnum[ActionsToShowEnum["Actions"] = 2] = "Actions";
    ActionsToShowEnum[ActionsToShowEnum["BildrActions"] = 4] = "BildrActions";
    ActionsToShowEnum[ActionsToShowEnum["MouseActions"] = 8] = "MouseActions";
})(ActionsToShowEnum || (ActionsToShowEnum = {}));
;
class BildrToolsDebug {
    static ShowAllVariables() {
        function frmsRecursive(brwFrm) {
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
    }
    static Start(breakBeforActionId) {
        if (!window.orgQAFunc) {
            window.orgQAFunc = QueueAction;
        }
        window.QueueAction = function (a, wait, parentQAction, brwObj, params, isThread, qName, bildrCache, addToQueue) {
            let showFlows = (BildrToolsDebug.ActionsToShow & ActionsToShowEnum.Flows) === ActionsToShowEnum.Flows;
            let showActions = (BildrToolsDebug.ActionsToShow & ActionsToShowEnum.Actions) === ActionsToShowEnum.Actions;
            let showBildrActions = (BildrToolsDebug.ActionsToShow & ActionsToShowEnum.BildrActions) === ActionsToShowEnum.BildrActions;
            let showMouseActions = (BildrToolsDebug.ActionsToShow & ActionsToShowEnum.MouseActions) === ActionsToShowEnum.MouseActions;
            if (a) {
                // V3gKt5FZRECIDMudjBbi3g = Action - Mouseenter - Element
                // AGTUwIokUuQgXEgNW6mnA = Action - Mouse Leave Page
                // CAGTUwIokUuQgXEgNW6mnA = Action - Mouse Leave Page
                let isMouseEvent = (a.id == "V3gKt5FZRECIDMudjBbi3g" || a.id == "AGTUwIokUuQgXEgNW6mnA" || a.id == "CAGTUwIokUuQgXEgNW6mnA");
                let isFlow = (a.type == "68");
                // Show only flows
                if ((isMouseEvent && showMouseActions) || (isFlow && showFlows) || (!isMouseEvent && !isFlow && showActions)) {
                    // is it a project action?
                    let act = undefined;
                    if (a.id && !showBildrActions) {
                        let cache = _Helpers__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
                        act = cache.actions.find(act => { return act.id == a.id; });
                    }
                    if (act != undefined || showBildrActions) {
                        let type = isFlow ? "Flow  " : "Action";
                        let indent = isFlow ? "" : "  --";
                        console.log(`${type}: ${a.id} ${indent}  "${a.name}"`);
                        if (BildrToolsDebug._StepMode || (breakBeforActionId && a.id == breakBeforActionId)) {
                            BildrToolsDebug._StepMode = true;
                            debugger;
                        }
                    }
                }
            }
            window.orgQAFunc.call(this, a, wait, parentQAction, brwObj, params, isThread, qName, bildrCache, addToQueue);
        };
        window.QueueAction.prototype = window.orgQAFunc.prototype;
        window.QueueAction.prototype.constructor = QueueAction;
    }
    static Stop() {
        if (window.orgQAFunc) {
            window.QueueAction = window.orgQAFunc;
        }
    }
    static StepModeOff() {
        BildrToolsDebug._StepMode = false;
    }
}
BildrToolsDebug._StepMode = false;
BildrToolsDebug.ActionsToShow = ActionsToShowEnum.Flows;


/***/ }),

/***/ "./src/Flows.ts":
/*!**********************!*\
  !*** ./src/Flows.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrToolsFlows": () => (/* binding */ BildrToolsFlows)
/* harmony export */ });
/* harmony import */ var _Helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Helpers */ "./src/Helpers.ts");

class BildrToolsFlows {
    static findUnusedFlows(skipAutoSave = true) {
        let bildrCache = _Helpers__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
        const activePages = (0,_Helpers__WEBPACK_IMPORTED_MODULE_0__.nameSort)(bildrCache.activePages);
        // create "header" for the results
        console.log(`Checking ${bildrCache.activeFlows.length} flows.`);
        console.log("You'll see 'That's it!' when checking is finished.");
        console.log("");
        if (skipAutoSave) {
            console.log("Looking for Unused flows (skipping unused 'Auto Save')");
        }
        else {
            console.log("Looking for All unused flows");
        }
        console.log("");
        activePages.forEach(page => {
            let pageNameLogged = false;
            (0,_Helpers__WEBPACK_IMPORTED_MODULE_0__.nameSort)(page.ActiveFlows).forEach(flow => {
                if (skipAutoSave && flow.name.includes("Auto Save")) {
                    return;
                }
                if (BildrToolsFlows.findUsageOfFlow(flow.id, false) == false) {
                    if (!pageNameLogged) {
                        pageNameLogged = true;
                        console.log("Page : " + page.name);
                    }
                    console.log("  Flow : " + flow.name);
                }
            });
        });
        console.log("");
        console.log("THAT'S IT!");
    }
    static findUsageOfFlow(flowId, logToConsole = true) {
        let bildrCache = _Helpers__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
        const strFlowId = flowId.toString();
        // for easy reference
        let isUsed = false;
        function ConsoleLog(text) {
            if (logToConsole) {
                console.log(text);
            }
        }
        // Create "Header" for the results
        let flow = bildrCache.activeFlows.find(flow => { return (flow.id == flowId); });
        // found it
        if (flow) {
            if (flow.Page) {
                ConsoleLog(`Flow "${flow.name}" on page "${flow.Page.name}" is called by:`);
            }
            else {
                ConsoleLog(`Couldn't find page for flowID ${flowId} in project!`);
            }
            ConsoleLog("");
        }
        else {
            ConsoleLog(`Couldn't find flowID ${flowId} in project!`);
            return false;
        }
        // check flow usage per active page
        bildrCache.activePages.forEach(page => {
            var _a, _b, _c, _d, _e, _f;
            let pageNameLogged = false;
            // Check usage of Flow in Actions of page.Flows         
            (0,_Helpers__WEBPACK_IMPORTED_MODULE_0__.nameSort)(page.ActiveFlows).forEach(flow => {
                flow.Actions.forEach(action => {
                    // as nested flow?
                    let asNestedFlow = action.id.toString().endsWith(strFlowId);
                    if (asNestedFlow) {
                        isUsed = true;
                        if (!pageNameLogged) {
                            pageNameLogged = true;
                            ConsoleLog("Page : " + page.name);
                        }
                        ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                        ConsoleLog("    as nested flow");
                    }
                    else 
                    // or referenced by an action type argument
                    {
                        action.Arguments.forEach(arg => {
                            var _a;
                            if (arg.argumentType == "static.actions") {
                                let argumentStatic = arg;
                                if (argumentStatic.type == "static.actions" && ((_a = argumentStatic.value) === null || _a === void 0 ? void 0 : _a.endsWith(strFlowId))) {
                                    isUsed = true;
                                    if (!pageNameLogged) {
                                        pageNameLogged = true;
                                        ConsoleLog("Page : " + page.name);
                                    }
                                    ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                                    ConsoleLog("    Action : " + action.name);
                                }
                            }
                        });
                    }
                });
            });
            (0,_Helpers__WEBPACK_IMPORTED_MODULE_0__.nameSort)(page.ActiveElements).forEach(element => {
                let eventsUsingFlow = element.opts.events.filter(item => { return item.actID && item.actID.toString().endsWith(strFlowId); });
                eventsUsingFlow.forEach(theEvent => {
                    isUsed = true;
                    if (!pageNameLogged) {
                        pageNameLogged = true;
                        ConsoleLog("Page : " + page.name);
                    }
                    ConsoleLog("  Element : " + element.name);
                    ConsoleLog("    Event : " + theEvent.code);
                });
            });
            // Check usage of flow in Page Events (Page Flows and Root Page Flows attributes)
            let inPageEvents = [];
            // Page Flows
            if ((_a = page.opts.autoSaveActionID) === null || _a === void 0 ? void 0 : _a.toString().endsWith(strFlowId)) {
                inPageEvents.push("Auto-Save Flow");
            }
            if ((_b = page.opts.onLoadAct) === null || _b === void 0 ? void 0 : _b.toString().endsWith(strFlowId)) {
                inPageEvents.push("Page Load Flow");
            }
            // Root Page Flows
            if ((_c = page.opts.notConnectedActID) === null || _c === void 0 ? void 0 : _c.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to run when connection is lost");
            }
            if ((_d = page.opts.reConnectedActID) === null || _d === void 0 ? void 0 : _d.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to run when connection is re-established");
            }
            if ((_e = page.opts.notAuthenticatedActID) === null || _e === void 0 ? void 0 : _e.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to run when authentication is lost");
            }
            if ((_f = page.opts.newRevisionActID) === null || _f === void 0 ? void 0 : _f.toString().endsWith(strFlowId)) {
                inPageEvents.push("Flow to Run When Revision is Out of Date");
            }
            if (inPageEvents.length > 0) {
                isUsed = true;
                ConsoleLog("Page : " + page.name);
                ConsoleLog("  Element : Page Body");
                inPageEvents.forEach(theEvent => {
                    ConsoleLog("    Event : " + theEvent);
                });
            }
            if (page.opts.resonanceDataListeners) {
                let dataListenersUsingFlow = page.opts.resonanceDataListeners.filter(item => { return item.actID && item.actID.toString().endsWith(strFlowId); });
                if (dataListenersUsingFlow.length > 0) {
                    isUsed = true;
                    ConsoleLog("Page : " + page.name);
                    ConsoleLog("  Element : Page Body");
                    ConsoleLog(`    Used by ${dataListenersUsingFlow.length} Data Listener(s)`);
                }
            }
        });
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");
        return isUsed;
    }
    static findUsageOfDeletedFlows() {
        let bildrCache = _Helpers__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
        // for easy reference
        function isDeletedFlow(flowId) {
            return bildrCache.deletedFlows.find(item => item.id.toString().endsWith(flowId.toString())) != undefined;
        }
        // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument
        bildrCache.activeFlows.forEach(flow => {
            var _a;
            if (flow.opts && flow.opts.arguments) {
                let actionsArray = flow.opts.arguments.find(item => { return item.name == "actionsArray"; });
                if (actionsArray) {
                    let argumentStaticArray = actionsArray;
                    (_a = argumentStaticArray.value) === null || _a === void 0 ? void 0 : _a.forEach(actionRef => {
                        // Nested flow?
                        if (actionRef.id && isDeletedFlow(actionRef.id)) {
                            let page = bildrCache.pages.find(item => { return item.id == flow.formID; });
                            if (page) {
                                console.log(`Page : ${page.name}`);
                                console.log(`  Flow : ${flow.name} (id: ${flow.id})`);
                                const deletedFlowName = bildrCache.deletedFlows.find(item => item && item.id.toString().endsWith(actionRef.id.toString()));
                                console.log("    as nested flow : " + deletedFlowName ? deletedFlowName : 0);
                            }
                        }
                        else {
                            let action = bildrCache.actions.find(item => { return (item.id == actionRef.id); });
                            if (action && action.opts && action.opts.arguments) {
                                let hasFlowRef = action.opts.arguments.find(arg => {
                                    return (arg.argumentType == "static.actions" && arg.value && isDeletedFlow(arg.value));
                                });
                                if (hasFlowRef) {
                                    let page = bildrCache.pages.find(item => { return item.id == flow.formID; });
                                    if (page) {
                                        console.log(`Page : ${page.name}`);
                                        console.log(`  Flow : ${flow.name} (id: ${flow.id})`);
                                        console.log(`    Action : ${action.name}`);
                                    }
                                }
                            }
                        }
                    });
                }
                ;
            }
            ;
        });
        // Check usage of flow in Page Events (Page Flows and Root Page Flows attributes)
        bildrCache.activePages.forEach(page => {
            // Flatten active elements because the elements don't get flagged as deleted although 
            // they are nog part of the page any more. Checks should only be done on active
            // elements.
            var objsTreeFlattend = Array();
            function flattenElements(items) {
                if (items != undefined) {
                    items.forEach(item => {
                        flattenElements(item.items);
                        objsTreeFlattend.push(item);
                    });
                }
            }
            flattenElements(page.objsTree);
            // Check usage of flow in Elements Events
            (0,_Helpers__WEBPACK_IMPORTED_MODULE_0__.nameSort)(objsTreeFlattend).forEach(element => {
                if (element.opts && element.opts.events) {
                    let eventsUsingFlow = element.opts.events.filter(item => { return item.actID && isDeletedFlow(item.actID); });
                    eventsUsingFlow.forEach(theEvent => {
                        let page = bildrCache.pages.find(item => { return item.id == element.formID; });
                        if (page) {
                            console.log("Page : " + page.name);
                            console.log("  Element : " + element.name);
                            console.log("    Event : " + theEvent.code);
                        }
                    });
                }
            });
            let inPageEvents = [];
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
                    });
                }
                if (page.opts.resonanceDataListeners) {
                    let dataListenersUsingFlow = page.opts.resonanceDataListeners.filter(item => { return item.actID && isDeletedFlow(item.actID); });
                    if (dataListenersUsingFlow.length > 0) {
                        console.log("Page : " + page.name);
                        console.log("  Element : Page Body");
                        console.log(`    Used by ${dataListenersUsingFlow.length} Data Listener(s)`);
                    }
                }
            }
        });
        console.log("");
        console.log("THAT'S IT!");
    }
    static getFlowWithActions(flowId) {
        var _a;
        let cache = _Helpers__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
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
                let argumentActionsArray = actionsArray;
                (_a = argumentActionsArray.value) === null || _a === void 0 ? void 0 : _a.forEach(actionRef => {
                    // Used in an argument of an action type?
                    let action = cache.actions.find(item => { return (item.id.toString() == actionRef.id.toString()); });
                    if (action) {
                        console.log(action);
                    }
                });
            }
            ;
        }
    }
}


/***/ }),

/***/ "./src/Helpers.ts":
/*!************************!*\
  !*** ./src/Helpers.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionHelper": () => (/* binding */ ActionHelper),
/* harmony export */   "BildrCacheHelper": () => (/* binding */ BildrCacheHelper),
/* harmony export */   "FlowHelper": () => (/* binding */ FlowHelper),
/* harmony export */   "PageHelper": () => (/* binding */ PageHelper),
/* harmony export */   "nameSort": () => (/* binding */ nameSort)
/* harmony export */ });
const groupBy = (list, getKey) => list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group])
        previous[group] = [];
    previous[group].push(currentItem);
    return previous;
}, {});
const nameSort = (list) => {
    return list.sort((a, b) => { return ('' + a.name).localeCompare(b.name); });
};
class CacheItem {
    constructor(name, exec, nullDefault) {
        this.name = name;
        this.exec = exec;
        this.nullDefault = nullDefault;
        this.clear();
    }
    clear() {
        this.value == null;
    }
    getValue() {
        if (this.value == null) {
            this.value = this.exec();
        }
        return this.value ? this.value : this.nullDefault;
    }
}
class CacheHelper {
    constructor() {
        this.cache = [];
    }
    register(variable, exec, nullDefault) {
        this.cache.push(new CacheItem(variable, exec, nullDefault));
    }
    getValue(variableName) {
        let cacheItem = this.cache.find(item => item.name == variableName);
        if (cacheItem) {
            return cacheItem.getValue();
        }
        throw new Error("variableName is not defined");
    }
    clear() {
        this.cache.forEach(item => item.clear());
    }
}
class BildrCacheHelper {
    constructor(...myarray) {
        if (myarray.length === 1) {
            this.bildrCache = BildrDBCacheGet(myarray[0], "", "", null);
        }
        else if (myarray.length === 2) {
            this.bildrCache = BildrDBCacheGet(false, myarray[0], myarray[1], null);
        }
        else {
            this.bildrCache = BildrDBCacheGet(true, "", "", null);
        }
        this.cache = new CacheHelper();
        this.cache.register("actionsGroupedByFormID", () => groupBy(this.actions, act => act.formID), groupBy([], () => ""));
        this.cache.register("actions", () => this.bildrCache.actions.recs.map(act => new ActionHelper(act, this)), Array());
        this.cache.register("flows", () => this.actions.filter(action => action.type == "68").map(flw => new FlowHelper(flw, this)), Array());
        this.cache.register("elements", () => this.bildrCache.elements.recs, Array());
        this.cache.register("pages", () => this.bildrCache.forms.recs.map(frm => new PageHelper(frm, this)), Array());
        this.cache.register("actionTypes", () => this.bildrCache.actionsTypes.recs, Array());
        this.cache.register("activePages", () => this.pages.filter(item => item.deleted == 0 && item.opts.archived != true), Array());
        this.cache.register("activeFlows", () => this.flows.filter(flow => flow.deleted == 0), Array());
        this.cache.register("deletedFlows", () => this.flows.filter(flow => flow.deleted != 0), Array());
        this.cache.register("activeFlowsGroupedByFormID", () => groupBy(this.activeFlows, f => f.formID), groupBy([], () => ""));
        this.cache.register("activeElements", () => this.elements.filter(item => item.deleted == 0), Array());
    }
    get actions() {
        return this.cache.getValue("actions");
    }
    get flows() {
        return this.cache.getValue("flows");
    }
    get elements() {
        return this.cache.getValue("elements");
    }
    get pages() {
        return this.cache.getValue("pages");
    }
    get actionTypes() {
        return this.cache.getValue("actionTypes");
    }
    get activePages() {
        return this.cache.getValue("activePages");
    }
    get activeFlows() {
        return this.cache.getValue("activeFlows");
    }
    get deletedFlows() {
        return this.cache.getValue("deletedFlows");
    }
    get activeFlowsGroupedByFormID() {
        return this.cache.getValue("activeFlowsGroupedByFormID");
    }
    get actionsGroupedByFormID() {
        return this.cache.getValue("actionsGroupedByFormID");
    }
    get activeElements() {
        return this.cache.getValue("activeElements");
    }
}
BildrCacheHelper.createInstance = () => { return new BildrCacheHelper(true); };
class PageHelper {
    constructor(form, bildrCache) {
        this.opts = form.opts;
        this.objsTree = form.objsTree;
        this.actions = form.actions;
        this.deleted = form.deleted;
        this.name = form.name;
        this.id = form.id;
        this.bildrCache = bildrCache;
    }
    get ActiveFlows() {
        let flows = this.bildrCache.activeFlowsGroupedByFormID[this.id.toString()];
        return flows ? flows : Array();
    }
    get ActiveElements() {
        let formObjsTreeFlattend = Array();
        function flattenElements(items) {
            if (items != undefined) {
                items.forEach(item => {
                    flattenElements(item.items);
                    formObjsTreeFlattend.push(item);
                });
            }
        }
        flattenElements(this.objsTree);
        return formObjsTreeFlattend;
    }
}
class ActionHelper {
    constructor(action, bildrCache) {
        this.opts = action.opts;
        this.formID = action.formID;
        this.type = action.type;
        this.deleted = action.deleted;
        this.name = action.name;
        this.id = action.id;
        this.bildrCache = bildrCache;
    }
    get Page() {
        if (!this.page) {
            this.page = this.bildrCache.pages.find(item => item.id == this.formID);
        }
        return this.page;
    }
    get Arguments() {
        //check nodig? Array.isArray(action.Arguments
        return this.opts.arguments;
    }
}
class FlowHelper extends ActionHelper {
    constructor(action, bildrCache) {
        super(action, bildrCache);
    }
    get Actions() {
        let actionsArray = this.opts.arguments.find(item => item.name == "actionsArray");
        let retValue = Array();
        if (!actionsArray)
            return retValue;
        let actArgActionsArray = actionsArray;
        if (!actArgActionsArray.value)
            return retValue;
        actArgActionsArray.value.forEach(actRef => {
            let act = this.bildrCache.actionsGroupedByFormID[this.formID].find(act => act.id == actRef.id);
            if (act) {
                retValue.push(act);
            }
        });
        return retValue;
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/BildrTools.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionTypes": () => (/* reexport safe */ _ActionTypes__WEBPACK_IMPORTED_MODULE_1__.BildrToolsActionTypes),
/* harmony export */   "Actions": () => (/* reexport safe */ _Actions__WEBPACK_IMPORTED_MODULE_0__.BildrToolsActions),
/* harmony export */   "ActionsToShowEnum": () => (/* reexport safe */ _Debug__WEBPACK_IMPORTED_MODULE_2__.ActionsToShowEnum),
/* harmony export */   "Debug": () => (/* reexport safe */ _Debug__WEBPACK_IMPORTED_MODULE_2__.BildrToolsDebug),
/* harmony export */   "Flows": () => (/* reexport safe */ _Flows__WEBPACK_IMPORTED_MODULE_3__.BildrToolsFlows)
/* harmony export */ });
/* harmony import */ var _Actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Actions */ "./src/Actions.ts");
/* harmony import */ var _ActionTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ActionTypes */ "./src/ActionTypes.ts");
/* harmony import */ var _Debug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Debug */ "./src/Debug.ts");
/* harmony import */ var _Flows__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Flows */ "./src/Flows.ts");







})();

window.BildrTools = __webpack_exports__;
/******/ })()
;