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

class BildrPluginLeftSide extends _BildrPluginRightSide__WEBPACK_IMPORTED_MODULE_0__.BildrPluginRightSide {
    constructor(name, pageUrl) {
        super(name, pageUrl);
    }
    renderPage() {
        if (!this._divElem) {
            // CREATE plugin div/iframe
            let elem = this.document.createElement('div');
            elem.id = this._divId;
            elem.style.cssText = "width:0px;height:100vh;top:0px;left:-350px;right:unset;bottom:unset;border:none;background:#ffffff;position: fixed;z-index: 100010;overflow: hidden;position:absolute;transition: right 300ms ease-in-out 0s;";
            elem.innerHTML = `<iframe id='${this._frameId}' src='${this._pageUrl}' style='all:unset;width:100%;height:100%'></iframe>`;
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
        this._actions.push(action);
    }
    addAction(actionName, execFnc) {
        this.addActionObject(new SimplePluginAction(actionName, execFnc));
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
/* harmony export */   "manager": () => (/* reexport safe */ _BildrPluginManager__WEBPACK_IMPORTED_MODULE_0__.BildrPluginManager),
/* harmony export */   "pluginBase": () => (/* reexport safe */ _BildrPluginRightSide__WEBPACK_IMPORTED_MODULE_1__.BildrPluginRightSide),
/* harmony export */   "pluginLeftSide": () => (/* reexport safe */ _BildrPluginLeftSide__WEBPACK_IMPORTED_MODULE_2__.BildrPluginLeftSide)
/* harmony export */ });
/* harmony import */ var _BildrPluginManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BildrPluginManager */ "./src/plugin/BildrPluginManager.ts");
/* harmony import */ var _BildrPluginRightSide__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BildrPluginRightSide */ "./src/plugin/BildrPluginRightSide.ts");
/* harmony import */ var _BildrPluginLeftSide__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BildrPluginLeftSide */ "./src/plugin/BildrPluginLeftSide.ts");





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=bildr-plugins.js.map