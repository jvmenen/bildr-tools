declare interface BildrDBCache {
    actions: group<action>,
    actionsTypes: group<actionType>
    elements: group<element>,
    forms: group<form>,
    functions: group<functon>,
    pageHeader: group<pageHeader>,
}

declare interface group<T> extends nameId {
    projectID: string;
    recs: T[]
}
declare interface actionType extends nameIdDeleted {
    opts: {
        coreType: any;
        archived?: boolean;
        marketplace?: {
            actionTypeID: string,
            checksum: string
        }
    };
}

declare interface functon extends nameIdDeleted {
    modifiedDate?: any;
    type: any,
    opts: any,
    JsCode: any
}

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
    name: string;
    displayName: string;
    argumentType: string;
    argumentTypeName: string;
    argumentID: string;
    thisIsAVariableName?: boolean
}

declare interface actionArgumentActionsArray extends actionArgument {
    value: actionRef[] | null;
}

declare interface actionArgumentStaticText extends actionArgument {
    type: string
    value: string;
    thisIsAVariableName: boolean;
}

declare interface actionArgumentVariable extends actionArgument {
    type: string
    value: string;
    partialValue?: string;
    path?: string;
    variableName: string;
}

declare interface actionArgumentFilterset extends actionArgument {
    filters?: {
        fieldsToFilterArray: {
            valueToFilterWith: actionArgumentVariable[]
        }[]
    }[]
}

declare interface actionArgumentElement extends actionArgumentVariable {
}

/**
 * @param type Only exists if a value is set
 * @param value Only exists if a value is set
 */
declare interface actionArgumentStaticActions extends actionArgument {
    type?: string;
    value?: string;
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
    deleted?: number;
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
    brObj: brwObj;
    name: any;
    form: formInstance;
    cBrwForms: brwForm[];
    _vars: { [key: string]: any }
}

declare interface brwObj {
    HTML: HTMLElement,
    brwForm: brwForm,
    childBrwFrm: brwForm,
    of: any
}

declare interface pageHeader extends nameIdDeleted {
    opts: {
        loadInStudio?: boolean,
        systemCreated?: boolean,
        systemType: string
    }
    value: string
}