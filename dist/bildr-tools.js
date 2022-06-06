/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Bildr-tools-ActionTypes.ts":
/*!****************************************!*\
  !*** ./src/Bildr-tools-ActionTypes.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrToolsActionTypes": () => (/* binding */ BildrToolsActionTypes)
/* harmony export */ });
/* harmony import */ var _Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bildr-tools-utils */ "./src/Bildr-tools-utils.ts");

const BildrToolsActionTypes = {
    findUsage: (actionTypeId) => {
        let bildrCache = _Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
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
            return false;
        }
        // check flow usage per active form
        bildrCache.activeForms.forEach(form => {
            if (!form.actions) {
                return;
            }
            // actions in form.actions are not marked as deleted
            let activeFlows = bildrCache.activeFlowsGroupedByFormID[form.id];
            if (!activeFlows) {
                return;
            }
            let formNameLogged = false;
            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            (0,_Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.nameSort)(activeFlows).forEach((flow) => {
                var _a;
                if (flow.opts && flow.opts.arguments) {
                    let actionsArray = flow.opts.arguments.find((item) => { return item.name == "actionsArray"; });
                    if (!actionsArray) {
                        return;
                    }
                    let argActionArray = actionsArray;
                    (_a = argActionArray.value) === null || _a === void 0 ? void 0 : _a.forEach(actionRef => {
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
};


/***/ }),

/***/ "./src/Bildr-tools-Debug.ts":
/*!**********************************!*\
  !*** ./src/Bildr-tools-Debug.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrToolsDebug": () => (/* binding */ BildrToolsDebug)
/* harmony export */ });
/* harmony import */ var _Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bildr-tools-utils */ "./src/Bildr-tools-utils.ts");

const BildrToolsDebug = {
    ShowAllVariables: () => {
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
    },
    Start: () => {
        if (!window.orgQAFunc) {
            window.orgQAFunc = QueueAction;
        }
        let debugZettingShowAllActions = false;
        let debugZettingShowBildrActions = false;
        let debugZettingStepMode = false;
        let debugZettingAutoShowVariables = false;
        window.QueueAction = function (a, wait, parentQAction, brwObj, params, isThread, qName, bildrCache, addToQueue) {
            let ignoreCanvasMouseEvents = true;
            if (a) {
                let isMouseEvent = false;
                let isFlow = (a.type && a.type == "68");
                if (ignoreCanvasMouseEvents) {
                    // V3gKt5FZRECIDMudjBbi3g = Action - Mouseenter - Element
                    // AGTUwIokUuQgXEgNW6mnA = Action - Mouse Leave Page
                    // CAGTUwIokUuQgXEgNW6mnA = Action - Mouse Leave Page
                    isMouseEvent = (a.id == "V3gKt5FZRECIDMudjBbi3g" || a.id == "AGTUwIokUuQgXEgNW6mnA" || a.id == "CAGTUwIokUuQgXEgNW6mnA");
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
                        let cache = _Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
                        let act = cache.actions.find(act => { return act.id == a.id; });
                        actionInProject = (act != undefined);
                    }
                    if (actionInProject || debugZettingShowBildrActions) {
                        console.log(`${Date.now()} ${type} ${a.id} = ${a.name}`);
                        if (debugZettingStepMode || a.id == BildrToolsDebug._ActionIdBreakpoint) {
                            debugZettingStepMode = true;
                            if (debugZettingAutoShowVariables) {
                                BildrToolsDebug.ShowAllVariables();
                            }
                            debugger;
                        }
                    }
                }
            }
            window.orgQAFunc.call(this, a, wait, parentQAction, brwObj, params, isThread, qName, bildrCache, addToQueue);
        };
        window.QueueAction.prototype = window.orgQAFunc.prototype;
        window.QueueAction.prototype.constructor = QueueAction;
    },
    Stop: () => {
        if (window.orgQAFunc) {
            window.QueueAction = window.orgQAFunc;
        }
    },
    BreakBeforeActionID: (actionId) => {
        BildrToolsDebug._ActionIdBreakpoint = actionId.toString().trim();
    },
    _ActionIdBreakpoint: ""
};


/***/ }),

/***/ "./src/Bildr-tools-Flows.ts":
/*!**********************************!*\
  !*** ./src/Bildr-tools-Flows.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrToolsFlows": () => (/* binding */ BildrToolsFlows)
/* harmony export */ });
/* harmony import */ var _Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bildr-tools-utils */ "./src/Bildr-tools-utils.ts");

const BildrToolsFlows = {
    findUnusedFlows: (skipAutoSave = true) => {
        let bildrCache = _Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
        const activeForms = (0,_Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.nameSort)(bildrCache.forms);
        // create "header" for the results
        console.log(`Check ${bildrCache.actions.length} flows. This might take a few seconds...`);
        console.log("You'll see a mesage when checking is finished.");
        console.log("");
        if (skipAutoSave) {
            console.log("Looking for Unused flows (skipping unused 'Auto Save')");
        }
        else {
            console.log("Looking for All unused flows");
        }
        console.log("");
        activeForms.forEach(form => {
            if (!form.actions) {
                return;
            }
            // actions in form.actions are not marked as deleted
            let activeFlows = bildrCache.activeFlowsGroupedByFormID[form.id];
            if (activeFlows) {
                let formNameLogged = false;
                (0,_Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.nameSort)(activeFlows).forEach(flow => {
                    if (skipAutoSave && flow.name.includes("Auto Save")) {
                        return;
                    }
                    if (BildrToolsFlows.findUsageOfFlow(flow.id, false) == false) {
                        if (!formNameLogged) {
                            formNameLogged = true;
                            console.log("Form : " + form.name);
                        }
                        console.log("  Flow : " + flow.name);
                    }
                });
            }
        });
        console.log("");
        console.log("THAT'S IT!");
    },
    findUsageOfFlow: (flowId, logToConsole) => {
        let bildrCache = _Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
        const strFlowId = flowId.toString();
        // for easy reference
        let isUsed = false;
        function ConsoleLog(text) {
            if (logToConsole) {
                console.log(text);
            }
        }
        // Create "Header" for the results
        let theFlow = bildrCache.activeFlows.find(flow => { return (flow.id == flowId); });
        // found it
        if (theFlow) {
            let form = bildrCache.forms.find(item => { return theFlow && item.id == theFlow.formID; });
            if (form) {
                ConsoleLog(`Flow "${theFlow.name}" on form "${form.name}" is called by:`);
            }
            else {
                ConsoleLog(`Couldn't find form for flowID ${flowId} in project!`);
            }
            ConsoleLog("");
        }
        else {
            ConsoleLog(`Couldn't find flowID ${flowId} in project!`);
            return false;
        }
        // check flow usage per active form
        bildrCache.activeForms.forEach(form => {
            if (!form.actions) {
                return;
            }
            // actions in form.actions are not marked as deleted
            let activeFlows = bildrCache.activeFlowsGroupedByFormID[form.id];
            if (!activeFlows) {
                return;
            }
            let formNameLogged = false;
            // Check usage of Flow in Actions of Flows as nested flow or referenced by an action type argument       
            (0,_Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.nameSort)(activeFlows).forEach(flow => {
                var _a;
                let actionsArrayValue = new Array();
                if (flow.opts && flow.opts.arguments) {
                    let actionsArray = flow.opts.arguments.find(item => { return item.name == "actionsArray"; });
                    if (actionsArray) {
                        let argumentStaticArray = actionsArray;
                        (_a = argumentStaticArray.value) === null || _a === void 0 ? void 0 : _a.forEach(actionRef => {
                            // Nested flow?
                            let asNestedFlow = actionRef.id && actionRef.id.toString().endsWith(strFlowId);
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
                                let action = bildrCache.actions.find(item => { return (item.id == actionRef.id); });
                                if (action && action.opts && action.opts.arguments && Array.isArray(action.opts.arguments)) {
                                    let flowActionRefs = action.opts.arguments.find(arg => arg.type && arg.type == "static.actions");
                                    if (flowActionRefs) {
                                        let argumetStatic = flowActionRefs;
                                        let hasFlowRef = argumetStatic.value.endsWith(strFlowId);
                                        if (hasFlowRef) {
                                            isUsed = true;
                                            if (!formNameLogged) {
                                                formNameLogged = true;
                                                ConsoleLog("Form : " + form.name);
                                            }
                                            ConsoleLog(`  Flow : ${flow.name} (id: ${flow.id})`);
                                            ConsoleLog("    Action : " + (action === null || action === void 0 ? void 0 : action.name));
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
            // Check usage of flow in Elements Events
            let formObjsTreeFlattend = Array();
            function flattenElements(items) {
                if (items != undefined) {
                    items.forEach(item => {
                        flattenElements(item.items);
                        formObjsTreeFlattend.push(item);
                    });
                }
            }
            flattenElements(form.objsTree);
            (0,_Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.nameSort)(formObjsTreeFlattend).forEach(element => {
                if (element.opts && element.opts.events) {
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
                }
            });
            // Check usage of flow in Page Events (Page Flows and Root Page Flows attributes)
            let inPageEvents = [];
            if (form.opts) {
                // Page Flows
                if (form.opts.autoSaveActionID && form.opts.autoSaveActionID.toString().endsWith(strFlowId)) {
                    inPageEvents.push("Auto-Save Flow");
                }
                if (form.opts.onLoadAct && form.opts.onLoadAct.toString().endsWith(strFlowId)) {
                    inPageEvents.push("Page Load Flow");
                }
                // Root Page Flows
                if (form.opts.notConnectedActID && form.opts.notConnectedActID.toString().endsWith(strFlowId)) {
                    inPageEvents.push("Flow to run when connection is lost");
                }
                if (form.opts.reConnectedActID && form.opts.reConnectedActID.toString().endsWith(strFlowId)) {
                    inPageEvents.push("Flow to run when connection is re-established");
                }
                if (form.opts.notAuthenticatedActID && form.opts.notAuthenticatedActID.toString().endsWith(strFlowId)) {
                    inPageEvents.push("Flow to run when authentication is lost");
                }
                if (form.opts.newRevisionActID && form.opts.newRevisionActID.toString().endsWith(strFlowId)) {
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
            }
        });
        ConsoleLog("");
        ConsoleLog("THAT'S IT!");
        return isUsed;
    },
    findUsageOfDeletedFlows: () => {
        let bildrCache = _Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
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
                            let form = bildrCache.forms.find(item => { return item.id == flow.formID; });
                            if (form) {
                                console.log(`Form : ${form.name}`);
                                console.log(`  Flow : ${flow.name} (id: ${flow.id})`);
                                const deletedFlowName = bildrCache.deletedFlows.find(item => item && item.id.toString().endsWith(actionRef.id.toString()));
                                console.log("    as nested flow : " + deletedFlowName ? deletedFlowName : 0);
                            }
                        }
                        else {
                            let action = bildrCache.actions.find(item => { return (item.id == actionRef.id); });
                            if (action && action.opts && action.opts.arguments) {
                                let hasFlowRef = action.opts.arguments.find(arg => {
                                    return (arg.type && arg.type == "static.actions" && arg.value && isDeletedFlow(arg.value));
                                });
                                if (hasFlowRef) {
                                    let form = bildrCache.forms.find(item => { return item.id == flow.formID; });
                                    if (form) {
                                        console.log(`Form : ${form.name}`);
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
        bildrCache.activeForms.forEach(form => {
            // Flatten active elements because the elements don't get flagged as deleted although 
            // they are nog part of the form any more. Checks should only be done on active
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
            flattenElements(form.objsTree);
            // Check usage of flow in Elements Events
            (0,_Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.nameSort)(objsTreeFlattend).forEach(element => {
                if (element.opts && element.opts.events) {
                    let eventsUsingFlow = element.opts.events.filter(item => { return item.actID && isDeletedFlow(item.actID); });
                    eventsUsingFlow.forEach(theEvent => {
                        let form = bildrCache.forms.find(item => { return item.id == element.formID; });
                        if (form) {
                            console.log("Form : " + form.name);
                            console.log("  Element : " + element.name);
                            console.log("    Event : " + theEvent.code);
                        }
                    });
                }
            });
            let inPageEvents = [];
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
                    });
                }
                if (form.opts.resonanceDataListeners) {
                    let dataListenersUsingFlow = form.opts.resonanceDataListeners.filter(item => { return item.actID && isDeletedFlow(item.actID); });
                    if (dataListenersUsingFlow.length > 0) {
                        console.log("Form : " + form.name);
                        console.log("  Element : Page Body");
                        console.log(`    Used by ${dataListenersUsingFlow.length} Data Listener(s)`);
                    }
                }
            }
        });
        console.log("");
        console.log("THAT'S IT!");
    },
    getFlowWithActions: (flowId) => {
        var _a;
        let cache = _Bildr_tools_utils__WEBPACK_IMPORTED_MODULE_0__.BildrCacheHelper.createInstance();
        let flow = cache.activeFlows.find(flow => {
            return (flow.id && flow.id.toString() == flowId);
        });
        if (flow == undefined) {
            console.log("flow not found");
            return false;
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
    },
};


/***/ }),

/***/ "./src/Bildr-tools-utils.ts":
/*!**********************************!*\
  !*** ./src/Bildr-tools-utils.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrCacheHelper": () => (/* binding */ BildrCacheHelper),
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
class BildrCacheHelper {
    constructor(...myarray) {
        if (myarray.length === 1) {
            this.cache = BildrDBCacheGet(myarray[0], "", "", null);
        }
        else if (myarray.length === 2) {
            this.cache = BildrDBCacheGet(false, myarray[0], myarray[1], null);
        }
        else {
            this.cache = BildrDBCacheGet(true, "", "", null);
        }
    }
    get actions() {
        return this.cache.actions.recs;
    }
    get forms() {
        return this.cache.forms.recs;
    }
    get actionTypes() {
        return this.cache.actionsTypes.recs;
    }
    get activeForms() {
        return this.forms.filter(item => item.deleted == 0);
    }
    get activeFlows() {
        return this.actions.filter(action => action.type == "68" && action.deleted == 0);
    }
    get deletedFlows() {
        return this.actions.filter(action => action.type == "68" && action.deleted != 0);
    }
    get activeFlowsGroupedByFormID() {
        return groupBy(this.activeFlows, f => f.formID);
    }
    get activeElements() {
        return this.cache.elements.recs.filter(item => item.deleted == 0);
    }
}
BildrCacheHelper.createInstance = () => { return new BildrCacheHelper(true); };


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
/*!****************************!*\
  !*** ./src/Bildr-tools.ts ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionTypes": () => (/* binding */ ActionTypes),
/* harmony export */   "Debug": () => (/* binding */ Debug),
/* harmony export */   "Flows": () => (/* binding */ Flows)
/* harmony export */ });
/* harmony import */ var _Bildr_tools_ActionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bildr-tools-ActionTypes */ "./src/Bildr-tools-ActionTypes.ts");
/* harmony import */ var _Bildr_tools_Debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Bildr-tools-Debug */ "./src/Bildr-tools-Debug.ts");
/* harmony import */ var _Bildr_tools_Flows__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Bildr-tools-Flows */ "./src/Bildr-tools-Flows.ts");



let ActionTypes = _Bildr_tools_ActionTypes__WEBPACK_IMPORTED_MODULE_0__.BildrToolsActionTypes;
let Flows = _Bildr_tools_Flows__WEBPACK_IMPORTED_MODULE_2__.BildrToolsFlows;
let Debug = _Bildr_tools_Debug__WEBPACK_IMPORTED_MODULE_1__.BildrToolsDebug;


})();

window.BildrTools = __webpack_exports__;
/******/ })()
;