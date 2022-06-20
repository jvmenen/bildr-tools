const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) previous[group] = [];
        previous[group].push(currentItem);
        return previous;
    }, {} as Record<K, T[]>);

export const nameSort = <T extends { name: string }>(list: Array<T>) => {
    return list.sort((a, b) => { return ('' + a.name).localeCompare(b.name) });
}

export const ConsoleLog = (text: string, logIt: boolean = true): boolean => {
    if (logIt) console.log(text);
    return false;
};

class CacheItem {
    name: string;
    exec: Function;
    value: any;
    nullDefault: any;

    public constructor(name: string, execFn: Function, initValue: any) {
        this.name = name;
        this.exec = execFn;
        this.nullDefault = initValue;
        this.clear();
    }

    clear(): void {
        this.value == null;
    }

    getValue<T>() {
        if (this.value == null) {
            this.value = this.exec() as T;
        }
        return this.value ? this.value as T : this.nullDefault as T;
    }
}
export class CacheHelper {
    cache: CacheItem[] = [];

    public register<T>(variableName: string, execFn: () => T, initValue: T) {
        if (this.cache.find(item => item.name == variableName)) {
            throw new Error(`VariableName '${variableName}' already registered.`);
        }
        this.cache.push(new CacheItem(variableName, execFn, initValue));
    }

    public getValue<T>(variableName: string) {
        let cacheItem = this.cache.find(item => item.name == variableName);
        if (cacheItem) {
            return cacheItem.getValue<T>();
        }
        throw new Error(`VariableName '${variableName}' is not registered.`);
    }

    public clear() {
        this.cache.forEach(item => item.clear())
    }
}

export class BildrCacheHelper {
    static createInstance = () => { return new BildrCacheHelper(true) };
    static bildrDBCacheGet = (...args:any[]): BildrDBCache => {return BildrDBCacheGet(args[0],args[1],args[2],args[3])} 

    bildrCache: BildrDBCache;
    cache: CacheHelper;

    public constructor(forSelectedBildr: boolean);
    public constructor(projectID: string, revisionID: string);
    public constructor(...myarray: any[]) {
        if (myarray.length === 1) {
            this.bildrCache = BildrCacheHelper.bildrDBCacheGet(myarray[0], "", "", null)!;
        } else if (myarray.length === 2) {
            this.bildrCache = BildrCacheHelper.bildrDBCacheGet(false, myarray[0], myarray[1], null)!;
        } else {
            this.bildrCache = BildrCacheHelper.bildrDBCacheGet(true, "", "", null)!;
        }

        this.cache = new CacheHelper()
        this.cache.register("actionsGroupedByFormID",
            () => groupBy<ActionHelper, string>(this.actions, act => act.formID),
            groupBy<ActionHelper, string>([], () => ""));

        this.cache.register("actions",
            () => this.bildrCache.actions.recs.map(act => new ActionHelper(act, this)),
            Array<ActionHelper>());

        this.cache.register("flows",
            () => this.actions.filter(action => action.type == "68").map(flw => new FlowHelper(flw, this)),
            Array<FlowHelper>());

        this.cache.register("elements",
            () => this.bildrCache.elements.recs,
            Array<element>());

        this.cache.register("pages",
            () => this.bildrCache.forms.recs.map(frm => new PageHelper(frm, this)),
            Array<PageHelper>());

        this.cache.register("actionTypes",
            () => this.bildrCache.actionsTypes.recs,
            Array<actionType>());

        this.cache.register("activePages",
            () => this.pages.filter(item => item.deleted == 0 && item.opts.archived != true),
            Array<PageHelper>());

        this.cache.register("activeFlows",
            () => this.flows.filter(flow => flow.deleted == 0),
            Array<FlowHelper>());

        this.cache.register("deletedFlows",
            () => this.flows.filter(flow => flow.deleted != 0),
            Array<FlowHelper>());

        this.cache.register("activeFlowsGroupedByFormID",
            () => groupBy<FlowHelper, string>(this.activeFlows, f => f.formID),
            groupBy<FlowHelper, string>([], () => ""));

        this.cache.register("activeElements",
            () => this.elements.filter(item => item.deleted == 0),
            Array<element>());

    }
    get actions() {
        return this.cache.getValue<ActionHelper[]>("actions")
    }
    get flows() {
        return this.cache.getValue<FlowHelper[]>("flows")
    }
    get elements() {
        return this.cache.getValue<element[]>("elements")
    }
    get pages() {
        return this.cache.getValue<PageHelper[]>("pages")
    }
    get actionTypes() {
        return this.cache.getValue<actionType[]>("actionTypes")
    }
    get activePages() {
        return this.cache.getValue<PageHelper[]>("activePages")
    }
    get activeFlows() {
        return this.cache.getValue<FlowHelper[]>("activeFlows")
    }
    get deletedFlows() {
        return this.cache.getValue<FlowHelper[]>("deletedFlows")
    }
    get activeFlowsGroupedByFormID() {
        return this.cache.getValue<Record<string, FlowHelper[]>>("activeFlowsGroupedByFormID")
    }
    get actionsGroupedByFormID() {
        return this.cache.getValue<Record<string, ActionHelper[]>>("actionsGroupedByFormID");
    }
    get activeElements() {
        return this.cache.getValue<element[]>("activeElements")
    }
}

export class PageHelper implements form {
    opts: formOpts;
    objsTree?: element[] | undefined;
    actions: action[];
    deleted: number | undefined;
    name: string;
    id: string | number;

    protected bildrCache: BildrCacheHelper;

    public constructor(form: form, bildrCache: BildrCacheHelper) {
        this.opts = form.opts;
        this.objsTree = form.objsTree;
        this.actions = form.actions;
        this.deleted = form.deleted;
        this.name = form.name;
        this.id = form.id
        this.bildrCache = bildrCache;
    }

    public get ActiveFlows() {
        let flows = this.bildrCache.activeFlowsGroupedByFormID[this.id.toString()];
        return flows ? flows : Array<FlowHelper>();
    }

    public get ActiveElements() {
        let formObjsTreeFlattend = Array<element>();

        function flattenElements(items: element[] | undefined) {
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

export class ActionHelper implements action {
    opts: { arguments: actionArgument[]; };
    formID: string;
    type: string;
    deleted: number | undefined;
    name: string;
    id: string | number;

    protected bildrCache: BildrCacheHelper;
    private page: PageHelper | undefined;

    public constructor(action: action, bildrCache: BildrCacheHelper) {
        this.opts = action.opts;
        this.formID = action.formID;
        this.type = action.type;
        this.deleted = action.deleted;
        this.name = action.name;
        this.id = action.id
        this.bildrCache = bildrCache;
    }
    public get Page() {
        if (!this.page) { this.page = this.bildrCache.pages.find(item => item.id == this.formID); }
        return this.page;
    }
    public get Arguments() {
        //check nodig? Array.isArray(action.Arguments
        return this.opts.arguments
    }

}

export class FlowHelper extends ActionHelper {
    public constructor(action: action, bildrCache: BildrCacheHelper) {
        super(action, bildrCache);
    }

    public get Actions() {
        let actionsArray = this.opts.arguments.find(item => item.name == "actionsArray");
        let retValue = Array<ActionHelper>();

        if (!actionsArray) return retValue;

        let actArgActionsArray = actionsArray as actionArgumentActionsArray;

        if (!actArgActionsArray.value) return retValue;

        actArgActionsArray.value.forEach(actRef => {
            let act = this.bildrCache.actionsGroupedByFormID[this.formID].find(act => act.id == actRef.id)
            if (act) { retValue.push(act) }
        });
        return retValue;
    }
}