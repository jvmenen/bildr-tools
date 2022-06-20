/**
 * @public
 */
export declare class Actions {
    /**
     * Search in the actions for use of path on Variables and Elements
     *
     * @param path - any string text. Use * to list all actions that have a path
     * @param exactMatch - should it match exactly. default = false
     */
    static findInPath(path: string, exactMatch?: boolean): void;
    /**
     * Find where variable(s) are used
     *
     * @param variableName - The (partial) name of the variable. Use * to show all variable ussage
     * @param setValue - Show where the variable gets set
     * @param readValue - Show where the variable is read
     * @param exactMatch - Default true, if partial search is required set it to false
     */
    static findVariable(variableName: string, setValue?: boolean, readValue?: boolean, exactMatch?: boolean): void;
}

/**
 * If you want both Flows and actions use: Flows | Actions
 * @public
 */
export declare enum ActionsToShowEnum {
    Flows = 1,
    Actions = 2,
    BildrActions = 4,
    MouseActions = 8
}

/**
 * @public
 */
export declare class ActionTypes {
    static findUsage(actionTypeId: string): void;
}

/**
 * @public
 */
export declare class Debug {
    private static _StepMode;
    static ActionsToShow: ActionsToShowEnum;
    static ShowAllVariables(): void;
    static Start(): void;
    static Stop(): void;
    static StepModeOff(): void;
}

/**
 * @public
 */
export declare class Flows {
    static findUnusedFlows(skipAutoSave?: boolean): void;
    static findUsageOfFlow(flowId: string | number, logToConsole?: boolean): boolean;
    static findUsageOfDeletedFlows(): void;
    static getFlowWithActions(flowId: string): void;
}

export { }
