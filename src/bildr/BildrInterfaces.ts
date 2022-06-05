export interface BildrDBCache {
    actions: group<action>,
    elements: group<element>,
    forms: group<form>,
    actionsTypes: group<actionType>
}

export interface group<T> extends nameId {
    projectID: string;
    recs: T[]
}
export interface actionType extends nameIdDeleted { }

export interface form extends nameIdDeleted {
    opts: formOpts;
    objsTree?: element[];
    actions: action[];
}

export interface formOpts {
    resonanceDataListeners?: resonanceDataListener[];
    newRevisionActID?: actId | undefined;
    notAuthenticatedActID?: actId | undefined;
    reConnectedActID?: actId | undefined;
    notConnectedActID?: actId | undefined;
    onLoadAct?: actId | undefined;
    autoSaveActionID?: actId | undefined;
}

export type actId = string | number;

export interface resonanceDataListener {
    actID: actId | undefined;

}

export interface action extends nameIdDeleted {
    opts: {
        arguments: actionArgument[]
    };
    formID: string;
    type: string;
}

export interface actionArgument {
    type?: string;
    name: string;
}

export interface actionArgumentActionsArray extends actionArgument {
    value: actionRef[] | null;
}

export interface actionArgumentStaticActions extends actionArgument {
    value: string;
}

export interface element extends nameIdDeleted {
    items: element[] | undefined;
    opts: {
        arguments: actionArgument[];
        events: event[];
    };
    formID: string;
    type: string;
}

export interface event {
    actID: string | null;
    code: string;
    eventID: number;
    _arrayIndex: number;
}

export interface nameIdDeleted extends nameId {
    deleted: number;
}

export interface nameId {
    name: string;
    id: string | number;
}

export interface actionsArray {
    value: actionRef[];
}

export interface actionRef extends nameId { }

export interface formInstance extends nameIdDeleted { }

export interface brwForm {
    name: any;
    form: formInstance;
    cBrwForms: brwForm[];
    _vars: { [key: string]: any }
}