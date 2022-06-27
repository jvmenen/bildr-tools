//import { actId } from "../../../bildr-misc/bildr/Bildr-cache";

declare var bapi: {
    get helper(): {

        setExtensionsForTarget(oTarget: {}, oExtensions: {}): void,

        eventStopPropagation(e: Event): void,

        toString(value: any): string,
        isTrue(value: any): boolean,
        isBoolean(value: any): boolean,
        isString(value: any): boolean,
        isArray(value: any): boolean,
        isObject(value: any): boolean,
        isDOMNode(value: any): boolean,
        isDate(value: any): boolean,
        isNumeric(value: any): boolean,
        isInteger(value: any): boolean,
        isFunction(value: any): boolean,
        getValueFromPath(obj: any, path: string, page?: formInstance, executingQueueAction?: any): any,
        getValue(element: Node): any,
        getData(element: Node): any,
        getInfo(element: Node): any,
        getTokenValue(ob: any, token: string, page?: any, executingQueueAction?: any): any,
        //getValueFromBildrArguments(config, argumentName, page, executingQueueAction) // Internal Bildr function
        //getPageElement(brwForm: brwForm, elemId: string): any // doesn't give a return value
        elementAddClass(el: Element, sClassName: string | number): void,
        elementRemoveClass(el: Element, sClassName: string | number): void,

        /**
         * @param page: "current", "parent", "root", "page.<pageId>" 
         * */
        getPageAction(page: string, actID: actId): action,

        /**
         * @param page: valid values for "current", "parent", "root", "page.<pageId>" 
         * @param currentPage: only required when page = "current" or "parent"
        */
        getPageVariable(page: string, variableName: string, currentPage: brwForm): any,

        /**
         * @param page: valid values for "current", "parent", "root", "page.<pageId>" 
         * @param currentPage: only required when page = "current" or "parent"
         * @param mapObjectKeys: if variableValue is an object containing name-value pairs that each need to be put in the
         * page variables collection then leave variableValue undefined and mapObjectKeys = true.
        */
        setPageVariable(page: string, variableName: string, variableValue: any, currentPage?: brwForm, mapObjectKeys?: boolean): void,

        openPageInContainerElement(pageId: string, containerElement: any, pageData: any, runFormLoadAction: actId, extraOpts: any): void,

        getElementNodeFromPage(pageElementRequest: string, currentPage: brwForm): any,

        getElementBrwObjFromPage(pageElementRequest: string, currentPage: brwForm): any,

        getPageElementFromRequest(pageElementRequest: string, currentPage: brwForm): any,

        /**
         * @param page: valid values for "current", "parent", "root", "allExceptCurrent", "page.<pageId>" 
         * @param exceptCurrent: required when page = "page.<pageId>"
         * @param variableName: used to filter a page with multiple instances (gridrow page)
         * @param variableValue: the value to filter on
        */
        getPageActionFromRequest(pageActionRequest: string, currentPage: brwForm, exceptCurrent?: boolean, variableName?: string, variableValue?: any): { "pgs": brwForm[], "actionId": actId } | null

        runActionOnPage(pages: string | string[], actionID: actId, currentQAction: any, currentBrwObj: brwForm): void,
        runPageActionFromRequest(pageActionRequest: string, currentPage: brwForm, exceptCurrent?: boolean, variableName?: string, variableValue?: any, currentQAction?: any, currentBrwObj?: brwForm): void

        // checkPageSafeToDisplayNotLoop(checkPageId, currentPage) // internal Bildr function

        postExtensionMessageFunction(customCode: string, args: any, variableName: string, nextAction: actId): void,

        /**
         * Change case of a string
         * @param str : valid values: "sentence", "upper", "camel", "title", "crazy","lower"= default
         * @param newCase 
         */
        changeCase(str: string, newCase?: string): string,

        /**
         * Loads a script tag and returns if the script already was loaded (true) or got loaded (false)
         * @param alias The script tag alias
         * @param url The url of the script
         * @param runafter function to run after script is loaded
         * @param extra arguments for @param runafter
         */
        addHeaderScript(alias: string, url: string, runafter?: Function, ...extra: any): boolean

    }
}
