declare var isIE4: number;
declare function cmnActionNothing(): boolean;
declare function EventCancelPropagation(e: any): void;
declare function parseStrAsJson(str: any): any;
declare function b64Dec(str: any): any;
declare function BrwObjDelFromParent(parent: any): void;
declare function BrwObjDelChilds(parent: any, andMe: any, notChilds: any): void;
declare function cmnBrwObjGet(oID: any): any;
declare function cmnIFrameContentGet(iFrame: any): any;
declare function cmnBrwObjGetOwnerWin(o: any): any;
declare function cmnBrwObjGetAbsPos(o: any, np: any, toW: any): number[];
declare function cmnBrwObjGetChildIndex(child: any): number;
declare function ArraySortedIdx(idx: any, obj: any): any;
declare function ObjectGetPropertyValue(o: any, properties: any): any;
declare function RecordUpdateWithNewData(rFrom: any, rTo: any, withCheckModify: any): void;
declare function triggerEvent(el: any, eventName: any, options: any): void;
declare function sortArrayByKey(property: any, sortOrder: any, numeric: any): (a: any, b: any) => number;
declare function BILDR_mathCalulation(val1: any, val2: any, operator: any, decimalPlaces: any): number;
declare function BILDR_mergeArrays(masterArray: any, mergeWithArray: any, matchKey: any, limitResultsToMasterArray: any, returnOnlyKeys: any): any;
declare function elementAddClass(el: any, sClassName: any): void;
declare function elementRemoveClass(el: any, sClassName: any): void;
declare function elementGetRect(elem: any): {
    box: any;
    top: number;
    left: number;
};
declare function getElementOffset(element: any): {
    x: number;
    y: number;
};
declare function stringBLDRCommaSplit(str: any): any;
declare function checkForJsonString(str: any, _spaceIfEmpty: any): any;
declare function getValueFromPath(ob: any, path: any, brwForm: any, qaToExec: any): any;
declare function getAllPagesWithIdValue(_bForm: any, pgid: any, varPath: any, varVal: any, arPgs: any, exceptCurrent: any, currentPage: any): void;
declare function isConfigTrue(value: any): any;
declare function forceClone(obj: any): any;
declare function elementContEdtiableBlur(e: any): void;
declare function IntersectForObject(list: any, properties: any, withRemoveDiff: any, withDataFromList: any, thisIsNotSorted: any, listNew: any, propertiesNew: any): any;
declare function convertInlineCssToCss(inputValue: any): string;
declare function BildrSortedGet(list: any, v: any, properties: any, startIdx: any): any;
declare function BildrDiff(objs: any, list: any, properties: any, withRemoveDiff: any): any;
declare function BildrDeleteKey(obj: any, key: any): void;
declare function BildrIndexValue(obj: any, index: any): any;
declare function BildrKeyValue(obj: any, key: any): any;
declare function BildrIndexKey(obj: any, index: any): string;
declare function BildrKeysLength(obj: any): number;
declare function BildrToArray(obj: any): any[];
declare function BildrRemovePropsOfType(obj: any, type: any): any;
declare function BildrRemoveProps(obj: any, list: any): any;
declare function BildrClone(obj: any, nrLevel: any): any;
declare function isBapiPresent(): boolean;
declare function RegExpFromString(str: any): any;
declare function decodePathParamsString(str: any): any;
declare function encodePathParamsString(str: any): any;
declare function createCssDeclaration(r: any, forSelectedBildr: any, bildrCache: any): boolean;
declare function CssRuleInsert(parentEntity: any, rule: any, r: any): any;
declare function CssSetRootTheme(arStyles: any): void;
declare function uuidv4(): any;
declare function getBildrDocumentPath(oFName: any, bildrCache: any): any;
declare function DBGWriteInLog(msgLevel: any, msg: any, msg1: any, msg2: any, msg3: any, msg4: any): void;
declare function DBGShowStatus(msg: any, fromQAction: any, qActFirst: any, isFromRun: any, isFromDebug: any, isStartThread: any, isFromRunAgain: any, fromQAInitiate: any, fnct: any): void;
declare function simpleCondition(arg1: any, arg2: any, operator: any, bExactMatch: any, sDelimiter: any): boolean;
declare function testValidationRule(strVal: any, strRule: any): boolean;
declare function isOddNumber(num: any): boolean;
declare function bildrExtProcessMsg(msg: any): void;
