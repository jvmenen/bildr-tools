declare interface BildrDBCache {
    actions: group<action>,
    elements: group<element>,
    forms: group<form>,
    actionsTypes: group<actionType>
}

declare interface group<T> extends nameId {
    projectID: string;
    recs: T[]
}
declare interface actionType extends nameIdDeleted { }

declare interface form extends nameIdDeleted {
    opts: formOpts;
    objsTree?: element[];
    actions: action[];
}

declare interface formOpts {
    archived?: boolean;
    resonanceDataListeners?: resonanceDataListener[];
    newRevisionActID?: actId | undefined;
    notAuthenticatedActID?: actId | undefined;
    reConnectedActID?: actId | undefined;
    notConnectedActID?: actId | undefined;
    onLoadAct?: actId | undefined;
    autoSaveActionID?: actId | undefined;
}

declare type actId = string | number;

declare interface resonanceDataListener {
    actID: actId | undefined;

}

declare interface action extends nameIdDeleted {
    opts: {
        arguments: actionArgument[]
    };
    formID: string;
    type: string;
}

declare interface actionArgument {
    type?: string;
    name: string;
}

declare interface actionArgumentActionsArray extends actionArgument {
    value: actionRef[] | null;
}

declare interface actionArgumentStaticActions extends actionArgument {
    value: string;
}

declare interface element extends nameIdDeleted {
    items: element[] | undefined;
    opts: {
        arguments: actionArgument[];
        events: event[];
    };
    formID: string;
    type: string;
}

declare interface event {
    actID: string | null;
    code: string;
    eventID: number;
    _arrayIndex: number;
}

declare interface nameIdDeleted extends nameId {
    deleted: number;
}

declare interface nameId {
    name: string;
    id: string | number;
}

declare interface actionsArray {
    value: actionRef[];
}

declare interface actionRef extends nameId { }

declare interface formInstance extends nameIdDeleted { }

declare interface brwForm {
    name: any;
    form: formInstance;
    cBrwForms: brwForm[];
    _vars: { [key: string]: any }
}