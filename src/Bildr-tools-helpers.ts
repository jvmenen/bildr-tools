
const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) previous[group] = [];
        previous[group].push(currentItem);
        return previous;
    }, {} as Record<K, T[]>);

export const nameSort = <T extends nameId>(list: Array<T>) => {
    return list.sort((a, b) => { return ('' + a.name).localeCompare(b.name) });
}

export class BildrCacheHelper {
    static createInstance = () => { return new BildrCacheHelper(true) };

    cache: BildrDBCache;
    public constructor(forSelectedBildr: boolean);
    public constructor(projectID: string, revisionID: string);
    public constructor(...myarray: any[]) {
        if (myarray.length === 1) {
            this.cache = BildrDBCacheGet(myarray[0], "", "", null)!;
        } else if (myarray.length === 2) {
            this.cache = BildrDBCacheGet(false, myarray[0], myarray[1], null)!;
        } else {
            this.cache = BildrDBCacheGet(true, "", "", null)!;
        }
    }
    get actions() {
        return this.cache.actions.recs;
    }
    get flows() {
        return this.actions.filter(action => action.type == "68").map(flw => new FlowHelper(flw, this));
    }
    get elements() {
        return this.cache.elements.recs;
    }
    get forms() {
        return this.cache.forms.recs.map(frm => new FormHelper(frm, this));
    }
    get actionTypes() {
        return this.cache.actionsTypes.recs;
    }
    get activeForms() {
        return this.forms.filter(item => item.deleted == 0);
    }
    get activeFlows() {
        return this.flows.filter(flow => flow.deleted == 0);
    }
    get deletedFlows() {
        return this.flows.filter(flow => flow.deleted != 0);
    }
    get activeFlowsGroupedByFormID() {
        return groupBy<FlowHelper, string>(this.activeFlows, f => f.formID);
    }
    get activeElements() {
        return this.elements.filter(item => item.deleted == 0);
    }
}

class FormHelper implements form {
    opts: formOpts;
    objsTree?: element[] | undefined;
    actions: action[];
    deleted: number;
    name: string;
    id: string | number;
    bildrCache: BildrCacheHelper;

    public constructor(form: form, bildrCache: BildrCacheHelper) {
        this.opts = form.opts;
        this.objsTree = form.objsTree;
        this.actions = form.actions;
        this.deleted = form.deleted;
        this.name = form.name;
        this.id = form.id
        this.bildrCache = bildrCache;
    }

    public get activeFlows() {
        let flows = this.bildrCache.activeFlowsGroupedByFormID[this.id.toString()];
        return flows ? flows : Array<FlowHelper>();
    }
}

class FlowHelper implements action {
    opts: { arguments: actionArgument[]; };
    formID: string;
    type: string;
    deleted: number;
    name: string;
    id: string | number;
    bildrCache: BildrCacheHelper;

    public constructor(action: action, bildrCache: BildrCacheHelper) {
        this.opts = action.opts;
        this.formID = action.formID;
        this.type = action.type;
        this.deleted = action.deleted;
        this.name = action.name;
        this.id = action.id
        this.bildrCache = bildrCache;
    }

    public get actions() {
        return ActionArgumentActionsArrayHelper.getActions(this.opts.arguments, this.bildrCache)
    }
}

class ActionArgumentActionsArrayHelper {

    static getActions(args: actionArgument[], bildrCache: BildrCacheHelper) {
        let actionsArray = args.find(item => item.name == "actionsArray");

        if (!actionsArray) return Array<action>();

        let actArgActionsArray = actionsArray as actionArgumentActionsArray;

        if (!actArgActionsArray.value) return Array<action>();

        return bildrCache.actions.filter(item => {
            let found = actArgActionsArray.value?.find(actRef => actRef.id == item.id);
            return found ? true: false;
        });
    }
}