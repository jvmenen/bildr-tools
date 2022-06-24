(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Bildr"] = factory();
	else
		root["Bildr"] = root["Bildr"] || {}, root["Bildr"]["marketplace"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/plugin/BildrPluginBase.ts":
/*!***************************************!*\
  !*** ./src/plugin/BildrPluginBase.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrPluginBase": () => (/* binding */ BildrPluginBase)
/* harmony export */ });
/**
 * @public
 */
class BildrPluginBase {
    constructor(name, pageUrl) {
        this._actions = [];
        this._name = name;
        this._pageUrl = pageUrl;
        this._divId = Math.random().toString(16).slice(2);
        this._frameId = Math.random().toString(16).slice(2);
    }
    get name() {
        return this._name;
    }
    get divElem() {
        return this._divElem;
    }
    isSameDivElem(divElem) {
        return this._divElem === divElem;
    }
    sendOutgoingMessage(msgId, result) {
        var window = document.getElementById(this._frameId).contentWindow;
        window.postMessage({
            "msgId": msgId,
            "result": result
        }, "*");
    }
    triggerAction(actionName, actionData) {
        if (actionData.uMsgId == undefined || actionData.uMsgId == null || actionData.uMsgId == "") {
            throw new Error("uMsgId should be set on argument actionData");
        }
        let action = this._actions.find(item => item.name == actionName);
        if (action == undefined) {
            throw new Error(`Unknown action '${actionName}' on plugin '${this.name}'`);
        }
        let result = action.execFunc(actionData);
        if (result) {
            this.sendOutgoingMessage(actionData.uMsgId, result);
        }
        return result;
    }
    hide() {
        this._divElem.style.right = "-400px";
    }
    show() {
        this._divElem.style.width = '400px';
        this._divElem.style.right = '0px';
    }
    toggleVisibility() {
        if (this.isVisible) {
            this.hide();
        }
        else {
            this.show();
        }
    }
    get isVisible() {
        return this._divElem.style.right == '0px';
    }
    get document() {
        return window.document;
    }
    renderPage() {
        if (!this._divElem) {
            // CREATE plugin div/iframe
            let elem = this.document.createElement('div');
            elem.id = this._divId;
            elem.style.cssText = "width:0px;height:100vh;top:0px;left:unset;right:-400px;bottom:unset;border:none;background:#ffffff;position: fixed;z-index: 100010;overflow: hidden;position:absolute;transition: right 300ms ease-in-out 0s;";
            elem.innerHTML = `<iframe id='${this._frameId}' src='${this._pageUrl}' style='all:unset;width:100%;height:100%'></iframe>`;
            // add to document (right side)
            this.document.body.appendChild(elem);
            // Animation end handler
            elem.addEventListener('transitionend', _e => {
                // when the animation is finished, "hide" it when out of view
                // prevents UI issues when the Studio canvas is scaled
                if (elem.style.right != '0px') {
                    elem.style.width = '0px';
                }
            });
            this._divElem = elem;
        }
    }
    remove() {
        this.document.body.removeChild(this._divElem);
    }
    addActionObject(action) {
        this.addAction(action.name, action.execFunc);
    }
    addAction(actionName, execFnc) {
        this._actions.push(new SimplePluginAction(actionName, execFnc));
    }
}
class SimplePluginAction {
    constructor(actionName, execFunc) {
        this.name = actionName;
        this._execFunc = execFunc;
    }
    execFunc(args) {
        return this._execFunc(args);
    }
}


/***/ }),

/***/ "./src/plugin/BildrPluginManager.ts":
/*!******************************************!*\
  !*** ./src/plugin/BildrPluginManager.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrPluginManager": () => (/* binding */ BildrPluginManager)
/* harmony export */ });
/**
 * @public
 */
class BildrPluginManager {
    constructor() {
        this._registeredPlugins = [];
    }
    register(plugin) {
        if (plugin.name == undefined || plugin.name == null || plugin.name.trim().length == 0) {
            throw new Error("Name is required to register a plugin.");
        }
        if (BildrPluginManager.isRegistered(plugin.name)) {
            throw new Error(`Plugin with name '${plugin.name}' already registered. Name needs to be unique.`);
        }
        this.startListeningForMessagesFromIFrame();
        this._registeredPlugins.push(plugin);
        plugin.renderPage();
    }
    isRegistered(pluginName) {
        return this._registeredPlugins.find(item => item.name == pluginName) != undefined;
    }
    remove(pluginName) {
        let plugin = this._registeredPlugins.find(item => item.name == pluginName);
        if (plugin != undefined) {
            plugin.remove();
            this._registeredPlugins.forEach((item, index) => {
                if (item === plugin)
                    this._registeredPlugins.splice(index, 1);
            });
        }
    }
    get window() {
        return window;
    }
    startListeningForMessagesFromIFrame() {
        if (this._registeredPlugins.length != 0)
            return;
        this.window.addEventListener("message", e => {
            this.triggerActionInPlugin(e);
        });
    }
    triggerActionInPlugin(e) {
        if (!e.data)
            return;
        let dataJson = e.data;
        let plugin = this._registeredPlugins.find(item => dataJson.pluginName && item.name == dataJson.pluginName);
        if (plugin == undefined)
            return;
        if (dataJson.data == undefined)
            dataJson.data = {};
        dataJson.data.uMsgId = dataJson.uMsgId;
        plugin.triggerAction(dataJson.command, dataJson.data);
    }
    // STATIC FUNCTIONS
    static getInstance() {
        if (this._instance == undefined) {
            this._instance = new BildrPluginManager();
        }
        return this._instance;
    }
    static remove(pluginName) {
        this.getInstance().remove(pluginName);
    }
    static isRegistered(pluginName) {
        return this.getInstance().isRegistered(pluginName);
    }
    static register(plugin) {
        this.getInstance().register(plugin);
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
/*!********************************************!*\
  !*** ./src/bildr-marketplace-plugin-v1.ts ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MarketplacePlugin": () => (/* binding */ MarketplacePlugin)
/* harmony export */ });
/* harmony import */ var _plugin_BildrPluginBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./plugin/BildrPluginBase */ "./src/plugin/BildrPluginBase.ts");
/* harmony import */ var _plugin_BildrPluginManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugin/BildrPluginManager */ "./src/plugin/BildrPluginManager.ts");


class MarketplacePlugin extends _plugin_BildrPluginBase__WEBPACK_IMPORTED_MODULE_0__.BildrPluginBase {
    constructor() {
        super("marketplace", "https://marketplace.bildr.com/BE");
        this.Version = "2";
        this.addAction("hideMarketplacePlugin", () => { this.hide(); return undefined; });
        this.addAction("getMarketPlaceVersion", () => { return this.Version; });
        this.addAction("getProjectActionTypes", () => { return BildrAPIHelper.getProjectActionTypes(); });
        this.addAction("getProjectFunctions", () => { return BildrAPIHelper.getProjectFunctions(); });
        this.addAction("getProjectPreviewId", () => { return BildrAPIHelper.getProjectPreviewId(); });
        this.addActionObject(new getActionTypeByMarketplaceIdAction());
        this.addActionObject(new addActionTypeWithFunctionsAction(this.sendOutgoingMessage));
        this.addActionObject(new updateActionTypeWithFunctionsAction(this.sendOutgoingMessage));
        this.addActionObject(new imageUrlToBase64Action(this.sendOutgoingMessage));
    }
    sendOutgoingMessage(msgId, result) {
        // Maybe this can be simplified since result is always success and
        // message contained the action name but never gets used I think.
        // But that requires also changes in the Marketplace plugin Website in 
        // all places where data is received an processed.... not easy to find where.
        var marketplaceResult = {
            "result": "succes",
            "message": "",
            "data": result
        };
        super.sendOutgoingMessage(msgId, marketplaceResult);
    }
}
class getActionTypeByMarketplaceIdAction {
    get name() {
        return "getActionTypeByMarketplaceId";
    }
    execFunc(args) {
        let projectActionTypes = BildrAPIHelper.getProjectActionTypes();
        var returnVal = projectActionTypes.find((act) => {
            var _a;
            return (((_a = act.opts.marketplace) === null || _a === void 0 ? void 0 : _a.actionTypeID) == args.actionTypeId);
        });
        return returnVal;
        ;
    }
}
class updateActionTypeWithFunctionsAction {
    // static addActionTypeWithFunctions(msgId: string);
    constructor(sendMessageFunc) {
        this._sendMessageFunc = sendMessageFunc;
    }
    get name() {
        return "updateActionTypeWithFunctions";
    }
    execFunc(data) {
        for (var index = 0; index < data.functions.length; index++) {
            var functData = data.functions[index];
            let stateData = {
                "last": index + 1 == data.functions.length
            };
            var dataToSave = {
                "id": functData.id,
                "opts": functData.opts
            };
            BildrAPIHelper.saveFiltersetRecord("7", dataToSave, stateData, (_returnData, stateData) => {
                // Is this the last function added to the project?
                if (stateData.last) {
                    BildrAPIHelper.saveFiltersetRecord("16", data.actionTypeJson, null, (returnData) => {
                        this._sendMessageFunc(data.msgId, returnData);
                    });
                }
            });
        }
    }
}

class addActionTypeWithFunctionsAction {
    // static addActionTypeWithFunctions(msgId: string);
    constructor(sendMessageFunc) {
        this._sendMessageFunc = sendMessageFunc;
    }
    get name() {
        return "getActionTypeByMarketplaceId";
    }
    execFunc(data) {
        // * add some extra info to replace the original function Id by new function Id in 
        //   the actionType.functions array
        // * data contains the json object data to store
        var functionsArr = data.functions.map((funct) => {
            let returnData = {
                "originalId": funct.id,
                "newId": "0",
                "data": {
                    "id": 0,
                    "type": funct.type,
                    "name": funct.name,
                    "opts": funct.opts,
                    "JsCode": funct.JsCode,
                }
            };
            return returnData;
        });
        // Add functions to the Bildr Project by putting them on the queue
        // when the last function is added to the Bildr project 
        // replace all originalId by their newId in actionType.functions
        // and save the actionType
        for (var index = 0; index < functionsArr.length; index++) {
            var funct = functionsArr[index];
            let stateData = {
                "index": index,
                "last": index + 1 == functionsArr.length
            };
            BildrAPIHelper.saveFiltersetRecord("7", funct.data, stateData, (returnData, stateData) => {
                // remember the newly created function id
                let index = stateData.index;
                functionsArr[index].newId = returnData.recs[0].id;
                // Is this the last function added to the project?
                if (stateData.last) {
                    // update ids of actionType.functions
                    functionsArr.forEach((fnc) => {
                        for (let i = 0; i < data.actionTypeJson.functions.length; i++) {
                            if (data.actionTypeJson.functions[i].id == fnc.originalId) {
                                data.actionTypeJson.functions[i].id = fnc.newId;
                            }
                        }
                    });
                    // add actionType
                    var actionTypeJson = {
                        "id": 0,
                        "name": data.actionTypeJson.settings.displayName,
                        "opts": data.actionTypeJson
                    };
                    BildrAPIHelper.saveFiltersetRecord("16", actionTypeJson, null, (returnData) => {
                        this._sendMessageFunc(data.msgId, returnData);
                    });
                }
            });
        }
    }
}
class imageUrlToBase64Action {
    // static addActionTypeWithFunctions(msgId: string);
    constructor(sendMessageFunc) {
        this._sendMessageFunc = sendMessageFunc;
    }
    get name() {
        return "imageUrlToBase64";
    }
    execFunc(data) {
        this.imageUrlToBase64(data.iconUrl, (dataUrl) => {
            this._sendMessageFunc(data.msgId, dataUrl);
        });
        return undefined;
    }
    imageUrlToBase64(src, callback) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            const MAX_WIDTH = 30;
            const MAX_HEIGHT = 30;
            let width = img.naturalHeight;
            let height = img.naturalHeight;
            // Change the resizing logic
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height = height * (MAX_WIDTH / width);
                    width = MAX_WIDTH;
                }
            }
            else {
                if (height > MAX_HEIGHT) {
                    width = width * (MAX_HEIGHT / height);
                    height = MAX_HEIGHT;
                }
            }
            // create canvas to draw on
            let canvas = document.createElement('CANVAS');
            let ctx = canvas.getContext('2d');
            // set size and draw
            canvas.height = height;
            canvas.width = width;
            //ctx.mozImageSmoothingEnabled = false;
            //ctx.webkitImageSmoothingEnabled = false;
            //ctx.msImageSmoothingEnabled = false;
            //ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, width, height);
            // Encode the resized image to bas64 png
            let dataURL = canvas.toDataURL("image/png");
            // return result
            callback(dataURL);
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = src;
        }
    }
}
class BildrAPIHelper {
    static saveFiltersetRecord(filtersetID, dataToSave, stateData, afterOnSucces) {
        // create custom action to execute RecordSave
        var act = new Action(0, 0, 0, "BildrAPIHelper adding filterset: " + dataToSave.filtersetID, '', '');
        act.exec = function (qa) {
            var jsonData = parseStrAsJson(dataToSave);
            var onSucces = function (data, message) {
                data.recs.forEach((rec) => {
                    if (rec.ERROR && rec.ERROR == true) {
                        console.log("ERROR IN: BildrAPIHelper.saveFiltersetRecord.onSucces");
                        console.log("message: " + JSON.stringify(message));
                        console.log(data);
                    }
                });
                QueueExecNextActions(qa);
                if (afterOnSucces) {
                    afterOnSucces(data, stateData);
                }
            };
            var onError = function (data, message) {
                console.log("ERROR IN: BildrAPIHelper.saveFiltersetRecord.onError");
                console.log("message: " + JSON.stringify(message));
                console.log(data);
                QueueExecNextActions(qa);
            };
            RecordSave(jsonData, filtersetID, qa, onSucces, onError, null, null);
        };
        // add action to the Queue
        BildrAPIHelper.addToActionQueue2(act);
    }
    static addToActionQueue2(action) {
        var _brObj = brwFormRoot.brObj;
        var _brForm = brwFormRoot;
        var qaBildrCache = null;
        var qa2 = new QueueAction(action, 1, null, _brObj, {
            "brwObj": _brObj,
            "brwForm": _brForm,
            "event": null
        }, null, null, qaBildrCache, 1);
    }
    static getProjectActionTypes() {
        let cache = BildrDBCacheGet(true);
        let actionTypes = cache.actionsTypes.recs.filter((at) => {
            // Only when 
            // Not Archived
            // Not a core action type
            return (at.opts.archived == false && (!at.opts.coreType || at.opts.coreType * 1 == 0));
        });
        // should there be some mapping done here to prevent problems in the future (see getProjectFunctions)
        return actionTypes;
    }
    static getProjectFunctions() {
        let cache = BildrDBCacheGet(true);
        // Only when 
        // Not Deleted
        // ** if archived needs filtering then filter on: opts.archived (1 = archived)
        // ** seems to only be their when archive (no = 0)
        let functions = cache.functions.recs.filter((funct) => {
            return (!funct.deleted || funct.deleted * 1 == 0);
        });
        // Need to map because the javascript functions in a function object can't be
        // deep copied/cloned and crash the PostMessage to the iFrame.
        functions = functions.map((funct) => {
            let returnData = {
                "id": funct.id,
                "JsCode": funct.JsCode,
                "modifiedDate": funct.modifiedDate,
                "name": funct.name,
                "opts": funct.opts,
                "type": funct.type
            };
            return returnData;
        });
        return functions;
    }
    static getProjectPreviewId() {
        let id = location.href.split("=");
        return id[1];
    }
}
class MarketplaceMenuBarButton {
    static isTopBarAvailable() {
        return document.querySelector(`.${MarketplaceMenuBarButton.topMenuBarDivCss}`);
    }
    static create() {
        if (!document.getElementById(MarketplaceMenuBarButton.marketplaceMenuItemDivId)) {
            // init page for smooth sliding in and not seeing the page load
            let plugin = new MarketplacePlugin();
            _plugin_BildrPluginManager__WEBPACK_IMPORTED_MODULE_1__.BildrPluginManager.register(plugin);
            // Make some space in the menu bar
            var topMenuBar = document.querySelector(`.${MarketplaceMenuBarButton.topMenuBarDivCss}`);
            topMenuBar.style.width = "520px";
            // CREATE menu bar item
            var elem = document.createElement("div");
            elem.id = MarketplaceMenuBarButton.marketplaceMenuItemDivId;
            elem.className = "css_BRQAelSiDkOyetXlS0VDMQ";
            elem.innerHTML = "<img src='https://documents-weu.bildr.com/r9f576480f5ba4b118cec7ce8e6c345e3/doc/Bildr marketplace logo WB color.ynHqabhunkG6oesIc3Xzvg.png' class='css_0EWldTyzqU60XwJWKjRXog' style='filter:none;'><p class='css_BzJ7ABkWfkeHKsQbcZKVbA css_ixReGSYmjkKU0b6bxZNTHw'>market</p>";
            // add to top menu bar
            topMenuBar.appendChild(elem);
            // Handle click on button, inside the plugin or outside the plugin (auto hide)
            // Mind the config param capture: true on the addEventListener
            document.body.addEventListener('click', e => {
                let marketplacePage = new MarketplacePlugin();
                var target = (e && e.target);
                // assume the click is outside the plugin / div
                let action = "hide";
                while (target.parentNode) {
                    // Ignore click inside the plugin / div
                    if (plugin.isSameDivElem(target)) {
                        action = "";
                        break;
                    }
                    // Handles click on Marketplace button (and image and tekst)
                    if (target && target.id == MarketplaceMenuBarButton.marketplaceMenuItemDivId) {
                        action = "toggle";
                        break;
                    }
                    target = target.parentNode;
                }
                if (action == "hide") {
                    marketplacePage.hide();
                }
                if (action == "toggle") {
                    marketplacePage.toggleVisibility();
                }
            }, { capture: true });
        }
    }
}
MarketplaceMenuBarButton.marketplaceMenuItemDivId = "bildrMarketplaceMenuItem";
MarketplaceMenuBarButton.topMenuBarDivCss = "css_V9oRPFpIjEqGDrWGUv9yWg";
var onStudioLoadObservers = [];
// set up marketplace button as soon as top bar is available
onStudioLoadObservers.push(new MutationObserver(function (_mutations, me) {
    // `me` is the MutationObserver instance
    if (MarketplaceMenuBarButton.isTopBarAvailable()) {
        // stop observing
        me.disconnect();
        MarketplaceMenuBarButton.create();
    }
}));
// prevent running this script when not in Bildr Studio
if (location.href.indexOf("https://www.bildr.com/studio?projectName=") != -1) {
    // start observing
    onStudioLoadObservers.forEach(observer => {
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=bildr-marketplace.js.map