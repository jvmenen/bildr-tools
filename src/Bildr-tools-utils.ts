
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
    static createInstance = () => {return new BildrCacheHelper(true)};

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
        return groupBy<action, string>(this.activeFlows, f => f.formID);
    }
    get activeElements() {
        return this.cache.elements.recs.filter(item => item.deleted == 0);
    }
}