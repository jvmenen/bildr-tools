(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Bildr"] = factory();
	else
		root["Bildr"] = root["Bildr"] || {}, root["Bildr"]["plugins"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/plugin/BildrPluginAction.ts":
/*!*****************************************!*\
  !*** ./src/plugin/BildrPluginAction.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/**
 * @public
 */



/***/ }),

/***/ "./src/plugin/BildrPluginLeftSide.ts":
/*!*******************************************!*\
  !*** ./src/plugin/BildrPluginLeftSide.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrPluginLeftSide": () => (/* binding */ BildrPluginLeftSide)
/* harmony export */ });
/* harmony import */ var _BildrPluginRightSide__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BildrPluginRightSide */ "./src/plugin/BildrPluginRightSide.ts");

/**
 * @public
 */
class BildrPluginLeftSide extends _BildrPluginRightSide__WEBPACK_IMPORTED_MODULE_0__.BildrPluginRightSide {
    constructor(name, pageUrl) {
        super(name, pageUrl);
    }
    renderPage() {
        if (!this._divElem) {
            // CREATE plugin div/iframe
            let elem = this.document.createElement('div');
            elem.id = this._divId;
            elem.style.cssText = "width:0px;height:100vh;top:0px;left:-350px;right:unset;bottom:unset;border:none;background:#ffffff;position: fixed;z-index: 100004;overflow: hidden;position:absolute;transition: left 300ms ease-in-out 0s;";
            elem.innerHTML = `<iframe id='${this._frameId}' src='${this.pageUrl}' style='all:unset;width:100%;height:100%';background-color:#292c33></iframe>`;
            // add to document (right side)
            this.document.body.appendChild(elem);
            // Animation end handler
            elem.addEventListener('transitionend', _e => {
                // when the animation is finished, "hide" it when out of view
                // prevents UI issues when the Studio canvas is scaled
                if (elem.style.left != '53px') {
                    elem.style.width = '0px';
                }
            });
            this._divElem = elem;
        }
    }
    hide() {
        this._divElem.style.left = "-350px";
    }
    show() {
        this._divElem.style.width = '350px';
        this._divElem.style.left = '53px';
    }
    get isVisible() {
        return this._divElem.style.left == '53px';
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
    showPlugin(pluginName) {
        let plugin = this._registeredPlugins.find(item => item.name == pluginName);
        if (plugin != undefined) {
            plugin.show();
        }
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
            throw new Error("e.data property is missing.");
        let dataJson = e.data;
        if (!dataJson.pluginName)
            throw new Error("Required property e.data.pluginName is missing.");
        if (!dataJson.command)
            throw new Error("Required property e.data.command is missing.");
        if (!dataJson.uMsgId)
            throw new Error("Required property e.data.uMsgId is missing.");
        let plugin = this._registeredPlugins.find(item => dataJson.pluginName && item.name == dataJson.pluginName);
        if (plugin == undefined) {
            throw new Error(`Plugin with name '${dataJson.pluginName}' is not registered.`);
        }
        ;
        if (dataJson.data === undefined || dataJson.data === null || dataJson.data === "")
            dataJson.data = {};
        dataJson.data.uMsgId = dataJson.uMsgId;
        plugin.triggerAction(dataJson.command, dataJson.data);
    }
    getVisiblePlugins() {
        return this._registeredPlugins.filter(item => item.isVisible);
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
    static getVisiblePlugins() {
        return this.getInstance().getVisiblePlugins();
    }
    static showPlugin(pluginName) {
        this.getInstance().showPlugin(pluginName);
    }
}


/***/ }),

/***/ "./src/plugin/BildrPluginRightSide.ts":
/*!********************************************!*\
  !*** ./src/plugin/BildrPluginRightSide.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BildrPluginRightSide": () => (/* binding */ BildrPluginRightSide)
/* harmony export */ });
/* harmony import */ var _SimplePluginAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SimplePluginAction */ "./src/plugin/SimplePluginAction.ts");

/**
 * @public
 */
class BildrPluginRightSide {
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
    isSameDivElem(divElem) {
        return this._divElem === divElem;
    }
    get divElem() {
        return this._divElem;
    }
    sendOutgoingMessage(msgId, result) {
        // if sendOutgoingMessage is passed as function reference _frameId migth not be
        // set, so we check for it to help debugging the issue (locking the Studio)
        if (this._frameId == undefined || this._frameId == null || this._frameId == "") {
            throw new Error("this._frameId should be set in the context of sendOutgoingMessage");
        }
        var window = document.getElementById(this._frameId).contentWindow;
        window.postMessage({
            "msgId": msgId,
            "result": result
        }, "*");
    }
    triggerAction(actionName, actionData) {
        let action = this._actions.find(item => item.name == actionName);
        if (action == undefined) {
            throw new Error(`Unknown action '${actionName}' on plugin '${this.name}'`);
        }
        let result = action.execFunc(actionData);
        if (result) {
            if (actionData.uMsgId == undefined || actionData.uMsgId == null || actionData.uMsgId == "") {
                throw new Error("uMsgId is required and should be set on Data");
            }
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
            elem.innerHTML = `<iframe id='${this._frameId}' src='${this.pageUrl}' style='all:unset;width:100%;height:100%;background-color:#292c33'></iframe>`;
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
    get pageUrl() {
        return this._pageUrl;
    }
    remove() {
        this.document.body.removeChild(this._divElem);
    }
    addActionObject(action) {
        this._actions.push(action);
    }
    addAction(actionName, execFnc) {
        this.addActionObject(new _SimplePluginAction__WEBPACK_IMPORTED_MODULE_0__.SimplePluginAction(actionName, execFnc));
    }
}


/***/ }),

/***/ "./src/plugin/BildrPluginsUI.ts":
/*!**************************************!*\
  !*** ./src/plugin/BildrPluginsUI.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initPluginManagerUI": () => (/* binding */ initPluginManagerUI)
/* harmony export */ });
/* harmony import */ var _BildrPluginLeftSide__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BildrPluginLeftSide */ "./src/plugin/BildrPluginLeftSide.ts");
/* harmony import */ var _BildrPluginManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BildrPluginManager */ "./src/plugin/BildrPluginManager.ts");


class BildrPluginsUI extends _BildrPluginLeftSide__WEBPACK_IMPORTED_MODULE_0__.BildrPluginLeftSide {
    constructor() {
        let scriptUrl = "";
        if (false) {}
        else {
            scriptUrl = "https://p1a6bee8b69e94699b5845bcfc8906d9b.bildr.com/";
        }
        super("BildrPluginsUI", scriptUrl);
        this.addAction("hidePlugin", () => { this.hide(); });
        this.addActionObject(new LoadPluginScriptAndShowAction(document));
        this.addActionObject(new LoadPluginScriptAction(document));
    }
}
class LoadPluginScriptAndShowAction {
    constructor(document) {
        this._document = document;
    }
    get name() {
        return "loadPluginScriptAndShow";
    }
    ;
    execFunc(args) {
        // Hide the visible plugin(s) (except me=BildrPluginsUI)
        _BildrPluginManager__WEBPACK_IMPORTED_MODULE_1__.BildrPluginManager.getVisiblePlugins().forEach(plugin => {
            if (plugin.name != "BildrPluginsUI") {
                plugin.hide();
            }
        });
        if (!_BildrPluginManager__WEBPACK_IMPORTED_MODULE_1__.BildrPluginManager.isRegistered(args.pluginName)) {
            var script = this._document.createElement("script");
            script.src = args.src;
            script.onload = () => {
                _BildrPluginManager__WEBPACK_IMPORTED_MODULE_1__.BildrPluginManager.showPlugin(args.pluginName);
            };
            this._document.head.appendChild(script);
        }
        else {
            _BildrPluginManager__WEBPACK_IMPORTED_MODULE_1__.BildrPluginManager.showPlugin(args.pluginName);
        }
    }
}
// Use this Action to load a plugin script and to run actions
// from the plugin on page load without showing the plugin.
class LoadPluginScriptAction {
    constructor(document) {
        this._document = document;
    }
    get name() {
        return "loadPluginScript";
    }
    ;
    execFunc(args) {
        if (!_BildrPluginManager__WEBPACK_IMPORTED_MODULE_1__.BildrPluginManager.isRegistered(args.pluginName)) {
            var script = this._document.createElement("script");
            script.src = args.src;
            this._document.head.appendChild(script);
        }
    }
}
class PluginToolBarButton {
    static isSideBarAvailable() {
        return document.querySelector(`.${PluginToolBarButton.sideMenuBarDivCss}`);
    }
    static create() {
        if (!document.getElementById(PluginToolBarButton.pluginsMenuItemDivId)) {
            // init page for smooth sliding in and not seeing the page load
            let bildrPlugins = new BildrPluginsUI();
            _BildrPluginManager__WEBPACK_IMPORTED_MODULE_1__.BildrPluginManager.register(bildrPlugins);
            // CREATE menu bar item
            var elem = document.createElement("div");
            elem.id = PluginToolBarButton.pluginsMenuItemDivId;
            elem.className = "css_0Bn06MSFX0Oj13pgDAho9g ";
            elem.innerHTML = "<img src='https://documents-weu.bildr.com/r778fd6080b694ebc8451a3af0b77b028/doc/tool.5hBAqSf0U0aFZAloVaMjBw.svg' class='css_40tBJ8HulEaFxBAoX32hBQ' draggable='false' width='240'><div innerhtml='Community Plugins' class='css_ css_23185 css_22538 css_23641' style='white-space:nowrap;'>Community Plugins</div>";
            // add to side menu bar
            var sideMenuBar = document.querySelector(`.${PluginToolBarButton.sideMenuBarDivCss}`);
            if (sideMenuBar == undefined) {
                throw new Error("Could not find side menu bar");
            }
            // after the 5th seperator
            let seperator = sideMenuBar.querySelectorAll(".css_jMrwOmSGxUezs1sr6VSoNQ  ")[5];
            if (seperator) {
                seperator.before(elem);
            }
            else {
                sideMenuBar.appendChild(elem);
            }
            // Handle click on button, inside the plugin or outside the plugin (auto hide)
            // Mind the config param capture: true on the addEventListener
            document.body.addEventListener('click', e => {
                var target = e.target;
                // assume the click is outside the plugin / div
                let action = "hide";
                let visiblePlugins = _BildrPluginManager__WEBPACK_IMPORTED_MODULE_1__.BildrPluginManager.getVisiblePlugins();
                while (target) {
                    if (target == null)
                        return;
                    // Ignore click inside the plugin / div
                    let clickedInPlugin = visiblePlugins.find(p => p.isSameDivElem(target));
                    if (clickedInPlugin) {
                        action = "";
                        break;
                    }
                    // Handles click on plugins button (and image and tekst)
                    if (target.id == PluginToolBarButton.pluginsMenuItemDivId) {
                        action = "toggle";
                        break;
                    }
                    target = target.parentNode;
                }
                if (action == "hide") {
                    visiblePlugins.forEach(p => p.hide());
                }
                if (action == "toggle") {
                    bildrPlugins.toggleVisibility();
                }
            }, { capture: true });
        }
    }
}
PluginToolBarButton.pluginsMenuItemDivId = "bildrPluginsMenuItem";
PluginToolBarButton.sideMenuBarDivCss = "css_23071.css_23052";
function initializeMutationObservers() {
    var onStudioLoadObservers = [];
    // set up marketplace button as soon as top bar is available
    onStudioLoadObservers.push(new MutationObserver(function (_mutations, me) {
        // `me` is the MutationObserver instance
        if (PluginToolBarButton.isSideBarAvailable()) {
            // stop observing
            me.disconnect();
            PluginToolBarButton.create();
        }
    }));
    return onStudioLoadObservers;
}
/**
 * @public
 */
function initPluginManagerUI() {
    // prevent running this script when not in Bildr Studio
    if (location.href.indexOf("https://www.bildr.com/studio?projectName=") != -1) {
        // start observing
        var onStudioLoadObservers = initializeMutationObservers();
        onStudioLoadObservers.forEach(observer => {
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });
    }
}


/***/ }),

/***/ "./src/plugin/SimplePluginAction.ts":
/*!******************************************!*\
  !*** ./src/plugin/SimplePluginAction.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SimplePluginAction": () => (/* binding */ SimplePluginAction)
/* harmony export */ });
/**
 * @public
 */
class SimplePluginAction {
    constructor(actionName, execFunc) {
        this._name = actionName;
        this._execFunc = execFunc;
    }
    get name() {
        return this._name;
    }
    execFunc(args) {
        return this._execFunc(args);
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
/*!***********************************!*\
  !*** ./src/plugin/PluginEntry.ts ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PluginBase": () => (/* reexport safe */ _BildrPluginRightSide__WEBPACK_IMPORTED_MODULE_1__.BildrPluginRightSide),
/* harmony export */   "PluginLeftSide": () => (/* reexport safe */ _BildrPluginLeftSide__WEBPACK_IMPORTED_MODULE_4__.BildrPluginLeftSide),
/* harmony export */   "SimplePluginAction": () => (/* reexport safe */ _SimplePluginAction__WEBPACK_IMPORTED_MODULE_3__.SimplePluginAction),
/* harmony export */   "initPluginManagerUI": () => (/* reexport safe */ _BildrPluginsUI__WEBPACK_IMPORTED_MODULE_5__.initPluginManagerUI),
/* harmony export */   "manager": () => (/* reexport safe */ _BildrPluginManager__WEBPACK_IMPORTED_MODULE_0__.BildrPluginManager)
/* harmony export */ });
/* harmony import */ var _BildrPluginManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BildrPluginManager */ "./src/plugin/BildrPluginManager.ts");
/* harmony import */ var _BildrPluginRightSide__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BildrPluginRightSide */ "./src/plugin/BildrPluginRightSide.ts");
/* harmony import */ var _BildrPluginAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BildrPluginAction */ "./src/plugin/BildrPluginAction.ts");
/* harmony import */ var _SimplePluginAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SimplePluginAction */ "./src/plugin/SimplePluginAction.ts");
/* harmony import */ var _BildrPluginLeftSide__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./BildrPluginLeftSide */ "./src/plugin/BildrPluginLeftSide.ts");
/* harmony import */ var _BildrPluginsUI__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BildrPluginsUI */ "./src/plugin/BildrPluginsUI.ts");








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=bildr-plugins.js.map