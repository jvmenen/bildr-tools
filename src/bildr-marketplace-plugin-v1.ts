import { BildrPluginRightSide, BildrPluginAction } from "./plugin/BildrPluginRightSide";
import { BildrPluginManager } from './plugin/BildrPluginManager';

export class MarketplacePlugin extends BildrPluginRightSide {
    private Version = "2";

    constructor() {
        super("marketplace", "https://marketplace.bildr.com/BE")
        this.addAction("hideMarketplacePlugin", () => { this.hide(); return undefined });
        this.addAction("getMarketPlaceVersion", () => { return this.Version });

        this.addAction("getProjectActionTypes", () => { return BildrAPIHelper.getProjectActionTypes() });
        this.addAction("getProjectFunctions", () => { return BildrAPIHelper.getProjectFunctions(); });
        this.addAction("getProjectPreviewId", () => { return BildrAPIHelper.getProjectPreviewId(); });

        this.addActionObject(new getActionTypeByMarketplaceIdAction());
        this.addActionObject(new addActionTypeWithFunctionsAction(this.sendOutgoingMessage));
        this.addActionObject(new updateActionTypeWithFunctionsAction(this.sendOutgoingMessage));

        this.addActionObject(new imageUrlToBase64Action(this.sendOutgoingMessage));
    }

    protected override sendOutgoingMessage(msgId: string, result: any) {
        // Maybe this can be simplified since result is always success and
        // message contained the action name but never gets used I think.
        // But that requires also changes in the Marketplace plugin Website in 
        // all places where data is received an processed.... not easy to find where.
        var marketplaceResult = {
            "result": "succes",
            "message": "",  // was this needed anyway in the marketplace?
            "data": result
        }
        super.sendOutgoingMessage(msgId, marketplaceResult)
    }
}

type sendOutgoingMessage = (msgId: string, result: any) => void;

class getActionTypeByMarketplaceIdAction implements BildrPluginAction {

    get name(): string {
        return "getActionTypeByMarketplaceId";
    }

    public execFunc(args: any) {
        let projectActionTypes = BildrAPIHelper.getProjectActionTypes();

        var returnVal = projectActionTypes.find((act: actionType): boolean => {
            return (act.opts.marketplace?.actionTypeID == args.actionTypeId)
        })
        return returnVal;;
    }
}

class updateActionTypeWithFunctionsAction implements BildrPluginAction {

    private _sendMessageFunc: sendOutgoingMessage;

    // static addActionTypeWithFunctions(msgId: string);
    constructor(sendMessageFunc: sendOutgoingMessage) {
        this._sendMessageFunc = sendMessageFunc
    }
    get name(): string {
        return "updateActionTypeWithFunctions";
    }

    execFunc(data: any) {

        for (var index = 0; index < data.functions.length; index++) {
            var functData = data.functions[index];
            let stateData = {
                "last": index + 1 == data.functions.length
            }
            var dataToSave = {
                "id": functData.id,
                "opts": functData.opts
            }
            BildrAPIHelper.saveFiltersetRecord("7", dataToSave, stateData, (_returnData: any, stateData: { last: boolean; }) => {

                // Is this the last function added to the project?
                if (stateData.last) {

                    BildrAPIHelper.saveFiltersetRecord("16", data.actionTypeJson, null, (returnData: any) => {
                        this._sendMessageFunc(data.msgId, returnData)
                    });
                }
            })
        }
    }
}

class addActionTypeWithFunctionsAction implements BildrPluginAction {
    private _sendMessageFunc: sendOutgoingMessage;

    // static addActionTypeWithFunctions(msgId: string);
    constructor(sendMessageFunc: sendOutgoingMessage) {
        this._sendMessageFunc = sendMessageFunc
    }

    get name(): string {
        return "addActionTypeWithFunctions";
    }

    public execFunc(data: any) {
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
                        this._sendMessageFunc(data.msgId, returnData)
                    });

                }
            });
        }
    }
}

class imageUrlToBase64Action implements BildrPluginAction {
    private _sendMessageFunc: sendOutgoingMessage;

    // static addActionTypeWithFunctions(msgId: string);
    constructor(sendMessageFunc: sendOutgoingMessage) {
        this._sendMessageFunc = sendMessageFunc
    }

    get name(): string {
        return "imageUrlToBase64";
    }
    execFunc(data: any) {
        this.imageUrlToBase64(data.iconUrl, (dataUrl: string) => {
            this._sendMessageFunc(data.msgId, dataUrl);
        })
        return undefined;
    }

    private imageUrlToBase64(src: string, callback: Function): void {
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

}

type convertFunction = {
    "originalId": string | number,
    "newId": string,
    "data": functon
}

class BildrAPIHelper {

    static saveFiltersetRecord(filtersetID: string, dataToSave: any, stateData: any, afterOnSucces: Function) {

        // create custom action to execute RecordSave
        var act = new Action(0, 0, 0, "BildrAPIHelper adding filterset: " + dataToSave.filtersetID, '', '');
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

class MarketplaceMenuBarButton {
    static marketplaceMenuItemDivId = "bildrMarketplaceMenuItem";
    static topMenuBarDivCss = "css_V9oRPFpIjEqGDrWGUv9yWg";

    static isTopBarAvailable() {
        return document.querySelector(`.${MarketplaceMenuBarButton.topMenuBarDivCss}`);
    }

    static create() {
        if (!document.getElementById(MarketplaceMenuBarButton.marketplaceMenuItemDivId)) {
            // init page for smooth sliding in and not seeing the page load
            let plugin = new MarketplacePlugin();
            BildrPluginManager.register(plugin)

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

            // Handle click on button, inside the plugin or outside the plugin (auto hide)
            // Mind the config param capture: true on the addEventListener
            document.body.addEventListener('click', e => {

                let marketplacePage = new MarketplacePlugin()
                var target = (e && e.target);
                // assume the click is outside the plugin / div
                let action = "hide";

                while ((target as HTMLElement).parentNode) {

                    // Ignore click inside the plugin / div
                    if (plugin.isSameDivElem(target as HTMLDivElement)) {
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
}

var onStudioLoadObservers = [];
// set up marketplace button as soon as top bar is available
onStudioLoadObservers.push(new MutationObserver(function (_mutations, me) {
    // `me` is the MutationObserver instance

    if (MarketplaceMenuBarButton.isTopBarAvailable()) {
        // stop observing
        me.disconnect();

        MarketplaceMenuBarButton.create();
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