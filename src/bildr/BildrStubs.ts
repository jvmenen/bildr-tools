import { BildrCacheHelper } from '../Bildr-tools-utils';
import { BildrDBCache, brwForm } from "./BildrInterfaces";

export var brwFormRoot: brwForm

export function BildrDBCacheGet(currentProject: boolean, projectID: string, revisionID: string): BildrDBCache | null {

    // This is kind of weird but this way typescript assumes we know what we are doing
    // otherwise it would give a string is not a number error...
    let test = window["BildrDBCacheGet" as unknown as number];
    if (test != undefined) {
        let func = (test as unknown as func);
        return func(currentProject, projectID, revisionID)
    }
    return null
}
type func = (currentProject: boolean, projectID: string, revisionID: string) => BildrDBCache;

