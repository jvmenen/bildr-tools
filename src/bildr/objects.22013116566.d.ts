declare var Usr: any;
declare var ActTypeBildrBrw: string, ActTypeBildrBrwFunct: string, ActSyncType: number, ActSyncTypeAsync: number, ActSyncWithWaitAll: number, ActSyncWithWaitAllMyParent: number, ActSyncWithNoWait: number;
declare var ActIdBildrBrw: number, QueueToBeFirst: number, ActIdAutoNr: number, QueueActionRoot: any;
declare var UpdateStateNot: number, UpdateState: number, UpdateStateDone: number;
declare var DBG: boolean, DBGDisplay: boolean, DBGExpand: boolean, DEBUGMODE: boolean;
declare var DBGDisplayLog: number, DBGDisplayLogTriggers: number, DBGDisplayLogCss: number, DBGDisplayLogDB: number, DBGDisplayLogShowForm: number, DBGDisplayLogBAPI: number, DBGDisplayLogReso: number, DBGDisplayLogLevel: number;
declare var BildrDB: any;
declare var BildrCache: {}, BildrCacheBase: any, BildrCacheSelected: any;
declare var NameActionsTypes: string, NameCss: string, NameFields: string, NameForms: string, NameElementsTypes: string, NameFunctions: string, NameLibraries: string, NameActions: string, NameElements: string, NameHistory: string, NameSlots: string, NameCurentUser: string, NameFiltersSets: string, NameGroups: string, NameRecords: string;
declare var Names: any[];
declare function BildrCacheRevision(bildrName: string): any;
declare function RefreshSelectedBildr(): void;
declare var baseProjID: number, baseRevID: number, baseSelProjID: number, baseSelRevID: number, baseProjDB: any, baseSelProjDB: any, baseSelProjDBOld: any;
declare function BildrDBGetName(projectID: any, revisionID: any): any;
declare function BildrDBCacheGet(forSelectedBildr: boolean, projectID: string, revisionID: string, type: any): any;
declare function BildrCacheGetForFltSet(brwForm: brwForm, oForProjRev: any): any;
declare function BildrCacheGetForGroup(bildrCacheForFltSet: any, fltSet: any, oForProjRev: any): any;
declare function BildrDBCreate(): void;
declare function BildrDBPutBulk(typ: any, list: any, bildrCache: any, listPropsToDel: any, setDeleted: any): void;
declare function BildrDBPutRecursive(entities: any, list: any): void;
declare function BildrDBRequest(grp: any, parent: any, entities: any, bildrCache: any, onQAction: any, IDs: any, execAfterGet: any, execAfterError: any, updateDocument: any): any;
declare function BildrDBError(err: any, e: any): void;
declare function InsertDependences(bildrCache: any, r: any, checkModifyChilds: any, isForm: any): void;
declare function Group(id: any, name: any): any;
declare function LibraryRequest(lib: any, bildrCache: any, reqAct: any, forcedRefresh: any): void;
declare function StyleCreate(objStylesID: any): any;
declare var StylesBildr: any, StylesClient: any, StylesBildrAppend: any, StylesClientAppend: any, StylesMediaQuerries: any;
declare function Field(gParent: any, id: any, name: any, type: any, def: any, calcOrd: any, optsStr: any, dependOnFields: any, dependsFields: any, dependOnFilterSets: any, dependsFilterSets: any): any;
declare function BildrDBGroupGetRecs(g: any, bildrCache: any, qaToExec: any): boolean;
declare function GroupsSearchAfterName(groups: any, name: any): any;
declare function BildrDBFilterSetGetGroup(fltSet: any, bildrCache: any, qaToExec: any, returnWithoutGetRecords: any, groupRecAssocID: any): any;
declare function FilterSetRequestRecords(fltSetID: any, onlyIdsStr: any, onlyFields: any, fltsetParentID: any, out_arg: any, qaToExec: any, fltSetFilters: any, fltSetAlias: any, useCache: any, oForProjRev: any): void;
declare function LimitMultipleRequestsInSameTime(g: any, qaToExec: any): void;
declare function FilterSet(id: any, name: any, groupID: any): any;
declare function FilterVal(val: any, name: any, filterType: any): any;
declare function FilterSetCreateFromJSON(fltSet: any, g: any, filtersJSON: any, addFilters: any): any;
declare function FilterNode(name: any, filterType: any): any;
declare function FilterSplitString(str: any, flt: any, name: any, cacheFilters: any): any;
declare function FilterIsMatch(rec: any, fltNode: any): boolean;
declare function FilterCacheGetRecords(g: any, filters: any, onlyIds: any, allData: any): any;
declare function FilterGetFromCache(recs: any, filtersCache: any, onlyIds: any, filters: any): any;
declare function FilterSetCacheQuery(returnRecs: any, fltSet: any, g: any, fltSetFilters: any, returnObject: any, recs: any, allData: any): any;
declare function FilterSetUpdateCache(g: any, r: any, filterCache: any): void;
declare function RecordsInsert(g: any, recs: any, oldRecs: any, bildrCache: any, dsc: any): void;
declare function RecordSave(recs: any, fltsetID: any, qaToExec: any, fncToExecAfter: any, fncToExecOnError: any, oForProjRev: any, oFltSetProjRev: any): void;
declare function FileUpload(file: any, dataToAppend: any): void;
declare function RecordSaveNext(data: any): any[];
declare function FilterSetsCheckListeners(g: any, rTo: any): void;
declare function UpdateStateDoneCheck(listWait: any, afterStateDB: any, qAct: any, entityName: any, ids: any, runAfterGet: any): boolean;
declare function QueueActionDoneGoNext(qActInWait: any): void;
declare function UpdateStateObject(isFromDB: any): any;
// declare function Response(name: any, dsc: any, obj: any): any;
declare function Record(id: any, idsModifyByUser: any, usrId: any, usrIdModify: any, usrName: any, usrNameMod: any, dateCreated: any, dateModify: any, opts: any): any;
declare function Filter(id: any, name: any, typ: any, usrId: any, isVis: any, vals: any, label: any): any;
declare function Action(id: any, type: any, aSync: any, name: any, dsc: any, params: any, exec: any, frmID: any): any;
declare function ActionAddToQueue(wait: any, qAct: any, brwObj: any, params: any, brwForm: any): any;
declare function ActionType(id: any, name: any, type: any, dsc: any, exec: any): any;
declare function FunctionGetArgumentValue(argOr: any, act: any, brwForm: any, qaToExec: any): any;
declare function getArgumentByName(args: any, name: any): any;
declare function FunctionsAddToQueue(fncts: any, qa: any): void;
declare function ActionExec(qa: any): any;
declare var DBGParamsShowDiv: any;
declare function QueueAction(a: any, wait: any, parentQAction: any, brwObj: any, params: any, isThread: any, qName: any, bildrCache: any, addToQueue: any): any;
declare function QueueStart(qa: any, timeOut: any): void;
declare function QueueRemoveChildsNode(qa: any): void;
declare function QueueDoneSet(qa: any, qaFirst: any): void;
declare function QueueStopQueueThread(parentThread: any): void;
declare var CheckOnlineFileName: string, CheckOnlineLastNavigatorStatus: boolean, CheckOnlineLastBildrStatus: boolean, CheckOnlineTimeout: number, xhr: XMLHttpRequest;
declare function CheckOnlineListener(e: any): void;
declare function CheckOnlineResponse(data: any, qAct: any, message: any, act: any, status: any): void;
declare function CheckOnlineLoop(): void;
declare function CheckOnline(checkOnlineFormID: any, backOnlineActionID: any, offlineActionID: any, timeout: any): void;
declare var CheckOnlineNewTime: {
    _id: string;
    time: number;
}, CheckOnlineOldTime: any;
declare function CheckOnlineStatus(navigatorStatus: any, bildrStatus: any): void;
declare function CheckOnlineAddActionToQueue(frm: any, actID: any): void;
declare var listActionsAfterGetOnline: any[];
declare function QueueRunAfterGetOnline(fromQAction: any, isFromRun: any, isFromDebug: any, isStartThread: any, isFromRunAgain: any): any;
declare function QueueActionCheckDone(qaToExec: any): void;
declare var QueueRunAgain: string, QueueMustWait: string;
declare function QueueExecNextActions(fromQAction: any, isFromRun: any, isFromDebug: any, isStartThread: any, isFromRunAgain: any, fromQAInitiate: any): boolean;
declare function FilterGetFields(fltNode: any): any;
// declare function Request(xHttp: any, url: any, method: any, qAct: any, act: any, reqType: any, postData: any, returnAction: any, returnError: any, headers: any): void;
declare function RequestError(qAct: any, msg: any, returnError: any, act: any, executeAgain: any, err: any): void;
declare function Requestold(xHttp: any, url: any, method: any, qAct: any, act: any, reqType: any, postData: any, returnAction: any, returnError: any): void;
declare function RequestGet(method: any, reqType: any, url: any, showStatus: any, returnAction: any, returnError: any, requestName: any, onQAction: any, rootUrl: any, postData: any, getPostData: any, mustWait: any, isThread: any): any;
declare function Resonance(data: any, bildrCache: any): void;
declare function CacheClear(qAct: any): void;
declare var WSOnOff: boolean;
declare function WSResonance(bildrCache: any, timeout: any, sendHistoryAfterGet: any): void;
declare var WSRefreshTokens: any[], WSRefreshTokenInGet: number;
declare function WSResonanceCreate(bildrCache: any, sendHistoryAfterGet: any, message: any): void;
declare function SendResonance(bildrCache: any, JObj: any, withoutHistory: any): void;
declare function ResonanceCheck(bildrCache: any, form: any): void;
declare function uuidv4(): any;
declare function getSystemValue(argValue: any): any;
