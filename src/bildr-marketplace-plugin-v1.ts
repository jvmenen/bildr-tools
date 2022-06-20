var marketplaceUrl = "https://marketplace.bildr.com/BE";

interface BildrHTMLDivElement extends HTMLDivElement {
    brwObj: brwObj;
}

class MarketplacePage {
    static iframeId = "ifrm_bildrMarketplacePage";
    static marketplaceDivId = "bildrMarketplacePage"
    private _instance: HTMLDivElement | null = null;

    constructor() {
        if (!this.instance) {
            // CREATE plugin div/iframe
            var elem = document.createElement('div');
            elem.id = MarketplacePage.marketplaceDivId;
            elem.style.cssText = "width:0px;height:100vh;top:0px;left:unset;right:-400px;bottom:unset;border:none;background:#ffffff;position: fixed;z-index: 100010;overflow: hidden;position:absolute;transition: right 300ms ease-in-out 0s;";
            elem.innerHTML = `<iframe id='${MarketplacePage.iframeId}' src='${marketplaceUrl}' style='all:unset;width:100%;height:100%'></iframe>`;
            // add to document (right side)
            document.body.appendChild(elem);

            // Animation end handler
            elem.addEventListener('transitionend', _e => {
                // when the animation is finished, "hide" it when out of view
                // prevents UI issues when the Studio canvas is scaled
                if (elem.style.right != '0px') { elem.style.width = '0px'; }
            });

            this._instance = elem;
        }
    }
    get instance() {
        if (!this._instance) {
            this._instance = document.getElementById(MarketplacePage.marketplaceDivId) as HTMLDivElement;
        }
        return this._instance;
    }

    // PUBLIC METHODS
    toggleVisibility() {
        if (this.isHidden()) {
            this.show();
        } else {
            this.hide();
        }
    }

    isHidden() {
        return this.instance.style.right != '0px';
    }

    show() {
        this.instance.style.width = '400px';
        this.instance.style.right = '0px';
    }

    hide() {
        this.instance.style.right = "-400px";
        // setting width to 0px is handled be eventlistener on transitioned, setup in constructor
    }

    static sendmessage(msgId: string, result: any, message: string, data: any) {
        var response = {
            "result": result,
            "message": message,
            "data": data
        }

        var theIframe = (document.getElementById(MarketplacePage.iframeId) as HTMLIFrameElement).contentWindow;
        theIframe!.postMessage({
            "msgId": msgId,
            "result": response
        }, "*");

    }
}

class MarketplaceMenuBarButton {
    static marketplaceMenuItemDivId = "bildrMarketplaceMenuItem";
    static topMenuBarDivCss = "css_V9oRPFpIjEqGDrWGUv9yWg";

    static isTopBarAvailable() {
        return document.querySelector(`.${MarketplaceMenuBarButton.topMenuBarDivCss}`);
    }

    static create() {
        if (!document.getElementById(MarketplaceMenuBarButton.marketplaceMenuItemDivId)) {
            // Make some space in the menu bar
            var topMenuBar = document.querySelector(`.${MarketplaceMenuBarButton.topMenuBarDivCss}`) as HTMLDivElement;
            topMenuBar.style.width = "520px";

            // CREATE menu bar item
            var elem = document.createElement("div");
            elem.id = MarketplaceMenuBarButton.marketplaceMenuItemDivId;
            elem.className = "css_BRQAelSiDkOyetXlS0VDMQ";
            elem.innerHTML = "<img src='https://documents-weu.bildr.com/r9f576480f5ba4b118cec7ce8e6c345e3/doc/Bildr marketplace logo WB color.ynHqabhunkG6oesIc3Xzvg.png' class='css_0EWldTyzqU60XwJWKjRXog' style='filter:none;'><p class='css_BzJ7ABkWfkeHKsQbcZKVbA css_ixReGSYmjkKU0b6bxZNTHw'>market</p>";
            // add to top menu bar
            topMenuBar.appendChild(elem);

            // init page for smooth sliding in and not seeing the page load
            let init = new MarketplacePage;

            // Handle click on button, inside the plugin or outside the plugin (auto hide)
            // Mind the config param capture: true on the addEventListener
            document.body.addEventListener('click', e => {

                let marketplacePage = new MarketplacePage()
                var target = (e && e.target);
                // assume the click is outside the plugin / div
                let action = "hide";

                while ((target as HTMLElement).parentNode) {

                    // Ignore click inside the plugin / div
                    if (target == marketplacePage.instance) {
                        action = "";
                        break;
                    }
                    // Handles click on Marketplace button (and image and tekst)
                    if (target && (target as HTMLElement).id == MarketplaceMenuBarButton.marketplaceMenuItemDivId) {
                        action = "toggle";
                        break;
                    }
                    target = (target as HTMLElement).parentNode;
                }

                if (action == "hide") { marketplacePage.hide(); }
                if (action == "toggle") { marketplacePage.toggleVisibility(); }
            }, { capture: true })

        }
    }
    static getBrwObj() {
        const topbarElement = document.querySelector(`.${MarketplaceMenuBarButton.topMenuBarDivCss}`) as HTMLDivElement;
        var brObj = (topbarElement.children[0] as BildrHTMLDivElement).brwObj;
        return brObj || null;
    }
}

class Marketplace {
    static Version = "2";

    static init() {
        // Create MenuBarItem for Marketplace
        MarketplaceMenuBarButton.create();

        // Start listening for messages from iFrame/Bildr Marketplace
        window.addEventListener("message", e => {
            if (e && (marketplaceUrl.indexOf(e.origin) != -1)) {
                Marketplace.handleMessage(e.data);
            }
        });
    }

    static handleMessage(args:any) {

        let callParams = parseStrAsJson(args);

        let command = callParams.command;
        let msgId = callParams.uMsgId;
        let data = callParams.data;

        switch (command) {
            case "getMarketPlaceVersion":
                MarketplacePage.sendmessage(msgId, "succes", "getMarketPlaceVersion", Marketplace.Version);
                break;

            case "hideMarketplacePlugin":
                new MarketplacePage().hide();
                break;

            case "addActionTypeWithFunctions":
                Marketplace.addActionTypeWithFunctions(msgId, callParams.actionType);
                break;

            case "updateActionTypeWithFunctions":
                Marketplace.updateActionTypeWithFunctions(msgId, callParams.actionType);
                break;

            case "getProjectActionTypes":
                let projectActionTypes = BildrAPIHelper.getProjectActionTypes();
                MarketplacePage.sendmessage(msgId, "succes", "projectActionTypes", projectActionTypes);
                break;

            case "getActionTypeByMarketplaceId":
                let actionType = Marketplace.getActionTypeByMarketplaceId(data.marketplaceActionTypeId);
                MarketplacePage.sendmessage(msgId, "succes", "getActionTypeByMarketplaceId", actionType);
                break;

            case "getProjectFunctions":
                let projectFunctions = BildrAPIHelper.getProjectFunctions();
                MarketplacePage.sendmessage(msgId, "succes", "getProjectFunctions", projectFunctions);
                break;

            case "getProjectPreviewId":
                let projectPreviewId = BildrAPIHelper.getProjectPreviewId();
                MarketplacePage.sendmessage(msgId, "succes", "getProjectPreviewId", projectPreviewId);
                break;

            case "iconUrlToBase64":
                Marketplace.imageUrlToBase64(data.iconUrl, (dataUrl: string) => {
                    MarketplacePage.sendmessage(msgId, "succes", "iconUrlToBase64", dataUrl);
                })
                break;

            default:
                console.log('Unknown command from marketplace: ' + command);
                break;
        }
    }

    static getActionTypeByMarketplaceId(actionTypeId: string) {
        let projectActionTypes = BildrAPIHelper.getProjectActionTypes();

        var returnVal = projectActionTypes.find((act: actionType): boolean => {
            return (act.opts.marketplace?.actionTypeID == actionTypeId)
        })

        return returnVal;
    }

    static imageUrlToBase64(src: string, callback: Function): void {
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
            } else {
                if (height > MAX_HEIGHT) {
                    width = width * (MAX_HEIGHT / height);
                    height = MAX_HEIGHT;
                }
            }

            // create canvas to draw on
            let canvas = document.createElement('CANVAS') as HTMLCanvasElement;
            let ctx = canvas.getContext('2d');

            // set size and draw
            canvas.height = height;
            canvas.width = width;

            //ctx.mozImageSmoothingEnabled = false;
            //ctx.webkitImageSmoothingEnabled = false;
            //ctx.msImageSmoothingEnabled = false;
            //ctx.imageSmoothingEnabled = false;

            ctx!.drawImage(img, 0, 0, width, height);

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
    static addActionTypeWithFunctions(msgId: string, data: any) {

        // * add some extra info to replace the original function Id by new function Id in 
        //   the actionType.functions array
        // * data contains the json object data to store
        var functionsArr = data.functions.map((funct: functon) => {
            let returnData: convertFunction = {
                "originalId": funct.id,
                "newId": "0",
                "data": {
                    "id": 0,
                    "type": funct.type,
                    "name": funct.name,
                    "opts": funct.opts,
                    "JsCode": funct.JsCode,
                }
            }
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
            }
            BildrAPIHelper.saveFiltersetRecord("7", funct.data, stateData, (returnData: { recs: { id: string; }[]; }, stateData: { index: number; last: boolean; }) => {
                // remember the newly created function id
                let index = stateData.index;
                functionsArr[index].newId = returnData.recs[0].id;

                // Is this the last function added to the project?
                if (stateData.last) {
                    // update ids of actionType.functions
                    functionsArr.forEach((fnc: convertFunction) => {
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
                    }

                    BildrAPIHelper.saveFiltersetRecord("16", actionTypeJson, null, (returnData: any) => {
                        MarketplacePage.sendmessage(msgId, "succes", "action type added succesfully", returnData)
                    });

                }
            });
        }
    }

    static updateActionTypeWithFunctions(msgId: string, data: any) {

        var functionsArr = data.functions;
        var actionTypeOpts = data.actionTypeJson;

        for (var index = 0; index < functionsArr.length; index++) {
            var functData = functionsArr[index];
            let stateData = {
                "last": index + 1 == functionsArr.length
            }
            var funct = {
                "id": functData.id,
                "opts": functData.opts
            }
            BildrAPIHelper.saveFiltersetRecord("7", funct, stateData, (_returnData: any, stateData: { last: boolean; }) => {

                // Is this the last function added to the project?
                if (stateData.last) {

                    BildrAPIHelper.saveFiltersetRecord("16", actionTypeOpts, null, (returnData: any) => {
                        MarketplacePage.sendmessage(msgId, "succes", "action type added succesfully", returnData)
                    });
                }
            })
        }
    }
}

type convertFunction = {
    "originalId": string | number,
    "newId": string,
    "data": functon
}

class BildrAPIHelper {

    static saveFiltersetRecord(filtersetID: string, dataToSave: any, stateData: any, afterOnSucces: Function) {

        // create custom action to execute RecordSave
        var act = new Action(0, 0, 0, "Marketplace plugin adding filterset: " + dataToSave.filtersetID, '', '');
        act.exec = function (qa: any) {

            var jsonData = parseStrAsJson(dataToSave)

            var onSucces = function (data: any, message: string) {
                data.recs.forEach((rec: any) => {
                    if (rec.ERROR && rec.ERROR == true) {
                        console.log("ERROR IN: BildrAPIHelper.saveFiltersetRecord.onSucces");
                        console.log("message: " + JSON.stringify(message));
                        console.log(data);
                    }
                })
                QueueExecNextActions(qa);
                if (afterOnSucces) {
                    afterOnSucces(data, stateData);
                }
            };
            var onError = function (data: any, message: string) {
                console.log("ERROR IN: BildrAPIHelper.saveFiltersetRecord.onError");
                console.log("message: " + JSON.stringify(message));
                console.log(data);
                QueueExecNextActions(qa);
            };

            RecordSave(jsonData, filtersetID, qa, onSucces, onError, null, null);
        }

        // add action to the Queue
        BildrAPIHelper.addToActionQueue2(act);
    }

    static addToActionQueue2(action: Action) {
        var _brObj = brwFormRoot.brObj;
        var _brForm = brwFormRoot;

        var qaBildrCache = null;

        var qa2 = new (QueueAction as any)(action, 1, null, _brObj, {
            "brwObj": _brObj,
            "brwForm": _brForm,
            "event": null
        }, null, null, qaBildrCache, 1);
    }

    static getProjectActionTypes() {
        let cache = BildrDBCacheGet(true);
        let actionTypes = cache.actionsTypes.recs.filter((at: actionType) => {
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
        let functions = cache.functions.recs.filter((funct: functon) => {
            return (!funct.deleted || funct.deleted * 1 == 0)
        })

        // Need to map because the javascript functions in a function object can't be
        // deep copied/cloned and crash the PostMessage to the iFrame.
        functions = functions.map((funct: functon) => {
            let returnData = {
                "id": funct.id,
                "JsCode": funct.JsCode,
                "modifiedDate": funct.modifiedDate,
                "name": funct.name,
                "opts": funct.opts,
                "type": funct.type
            }
            return returnData;
        });
        return functions;
    }

    static getProjectPreviewId() {
        let id = location.href.split("=");
        return id[1];
    }

}


var onStudioLoadObservers = [];
// set up marketplace button as soon as top bar is available
onStudioLoadObservers.push(new MutationObserver(function (_mutations, me) {
    // `me` is the MutationObserver instance

    if (MarketplaceMenuBarButton.isTopBarAvailable()) {
        // stop observing
        me.disconnect();

        Marketplace.init();
    }
}))

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